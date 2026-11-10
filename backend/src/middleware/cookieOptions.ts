import type { Context } from "hono";
import type { CookieOptions } from "hono/utils/cookie";
import type { AppBindings } from "../app";

export type AppEnv = { Bindings: AppBindings };
export type AppContext<E extends AppEnv = AppEnv> = Context<E>;

const maxCookieAgeSeconds = 400 * 24 * 60 * 60;

type CookiePrefix = "__Host-" | "__Secure-";
type SecurityCookieOptions = {
    prefix: CookiePrefix;
    maxAge: number;
    sameSite?: "Lax" | "Strict" | "None";
    partitioned?: boolean;
};

/** Creates a registered cookie-prefix name and prevents accidental double prefixes. */
export function securityCookieName(prefix: CookiePrefix, name: string): `${CookiePrefix}${string}` {
    if (!/^[A-Za-z0-9][A-Za-z0-9_-]*$/u.test(name)) {
        throw new TypeError("Cookie name must be an unprefixed token.");
    }
    return `${prefix}${name}`;
}

/**
 * Builds a standards-compliant security cookie policy.
 * __Host- cookies are host-only (no Domain) and always use Path=/; Partitioned
 * cookies are only allowed with Secure, as required by CHIPS.
 */
export function securityCookieOptions(options: SecurityCookieOptions): CookieOptions {
    if (!Number.isInteger(options.maxAge) || options.maxAge <= 0 || options.maxAge > maxCookieAgeSeconds) {
        throw new RangeError(`Cookie Max-Age must be an integer between 1 and ${maxCookieAgeSeconds}.`);
    }

    // Both registered prefixes require Secure. __Host- additionally must not set Domain.
    const secure = true;
    if (options.partitioned && !secure) {
        throw new TypeError("Partitioned cookies require Secure.");
    }

    return {
        httpOnly: true,
        secure,
        sameSite: options.sameSite ?? "Lax",
        path: "/",
        maxAge: options.maxAge,
        expires: new Date(Date.now() + options.maxAge * 1000),
        ...(options.partitioned ? { partitioned: true } : {}),
    };
}

/** Expire a security cookie with the same host/path scope used at creation. */
export function expireSecurityCookie(): CookieOptions {
    return {
        httpOnly: true,
        secure: true,
        sameSite: "Lax",
        path: "/",
        maxAge: 0,
        expires: new Date(0),
    };
}

export const cookieNames = {
    administratorSession: securityCookieName("__Host-", "admin_session"),
    oauthState: securityCookieName("__Host-", "oauth_state"),
} as const;
