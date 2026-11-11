import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import {
    canAuthenticateAsAdministrator,
    type AdminIdentity,
    isAuthProvider,
} from "../features/auth/domain/authIdentity";
import { getAdministratorAllowList } from "../infrastructure/auth/administratorAuthentication";
import { authValidationMessages } from "../features/auth/validation/messages";
import { hasValidSessionSecret } from "../features/auth/validation/oauthSetupValidation";
import {
    cookieNames,
    expireSecurityCookie,
    securityCookieOptions,
    type AppContext,
    type AppEnv,
} from "./cookieOptions";

const sessionSeconds = 60 * 60 * 8;
const encoder = new TextEncoder();
const decoder = new TextDecoder();

type SessionPayload = {
    v: 1;
    iss: "mysite";
    aud: "admin";
    sub: string;
    iat: number;
    exp: number;
};

function encodeBase64Url(bytes: Uint8Array): string {
    let binary = "";
    for (const byte of bytes) binary += String.fromCharCode(byte);
    return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "");
}

function decodeBase64Url(value: string): Uint8Array | null {
    if (!/^[A-Za-z0-9_-]+$/u.test(value)) return null;
    try {
        const padded = value.replaceAll("-", "+").replaceAll("_", "/") + "=".repeat((4 - value.length % 4) % 4);
        return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
    } catch {
        return null;
    }
}

async function sign(value: string, secret: string): Promise<Uint8Array> {
    const key = await crypto.subtle.importKey(
        "raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"],
    );
    return new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value)));
}

function timingSafeEqual(left: Uint8Array, right: Uint8Array): boolean {
    if (left.length !== right.length) return false;
    let difference = 0;
    for (let index = 0; index < left.length; index += 1) difference |= left[index]! ^ right[index]!;
    return difference === 0;
}

async function encodeSession(payload: SessionPayload, secret: string): Promise<string> {
    const encodedPayload = encodeBase64Url(encoder.encode(JSON.stringify(payload)));
    return `${encodedPayload}.${encodeBase64Url(await sign(encodedPayload, secret))}`;
}

async function decodeSession(token: string, secret: string): Promise<SessionPayload | null> {
    const [encodedPayload, encodedSignature, ...remainder] = token.split(".");
    if (!encodedPayload || !encodedSignature || remainder.length > 0) return null;

    const signature = decodeBase64Url(encodedSignature);
    if (!signature || !timingSafeEqual(signature, await sign(encodedPayload, secret))) return null;

    const payloadBytes = decodeBase64Url(encodedPayload);
    if (!payloadBytes) return null;
    try {
        const payload = JSON.parse(decoder.decode(payloadBytes)) as Partial<SessionPayload>;
        if (
            payload.v !== 1 || payload.iss !== "mysite" || payload.aud !== "admin" ||
            typeof payload.sub !== "string" || typeof payload.iat !== "number" ||
            typeof payload.exp !== "number" || payload.exp <= Math.floor(Date.now() / 1000)
        ) return null;
        return payload as SessionPayload;
    } catch {
        return null;
    }
}

/** Returns an allow-listed administrator only for an unexpired, signed cookie. */
export async function getAdministratorFromSession<E extends AppEnv>(c: AppContext<E>): Promise<AdminIdentity | null> {
    const token = getCookie(c, cookieNames.administratorSession);
    if (!token || !hasValidSessionSecret(c.env)) return null;

    const payload = await decodeSession(token, c.env.SESSION_SECRET);
    if (!payload) return null;
    const [provider, id] = payload.sub.split(":", 2);
    if (!provider || !id || !isAuthProvider(provider)) return null;

    const identity = { provider, id };
    return canAuthenticateAsAdministrator(identity, getAdministratorAllowList(c.env)) ? identity : null;
}

/** Starts an eight-hour, HMAC-SHA-256 signed administrator session. */
export async function startAdministratorSession<E extends AppEnv>(c: AppContext<E>, identity: AdminIdentity): Promise<void> {
    if (!hasValidSessionSecret(c.env)) throw new Error(authValidationMessages.sessionSecretInvalid);

    const now = Math.floor(Date.now() / 1000);
    const value = await encodeSession({
        v: 1, iss: "mysite", aud: "admin", sub: `${identity.provider}:${identity.id}`,
        iat: now, exp: now + sessionSeconds,
    }, c.env.SESSION_SECRET);
    setCookie(c, cookieNames.administratorSession, value, securityCookieOptions({
        prefix: "__Host-", maxAge: sessionSeconds,
    }));
}

export function endAdministratorSession<E extends AppEnv>(c: AppContext<E>): void {
    deleteCookie(c, cookieNames.administratorSession, expireSecurityCookie());
}
