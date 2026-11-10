import { describe, expect, test } from "bun:test";
import { securityCookieName, securityCookieOptions } from "../cookieOptions";

describe("securityCookieOptions", () => {
    test("登録済みの Cookie prefix を安全に付与する", () => {
        expect(securityCookieName("__Host-", "admin_session")).toBe("__Host-admin_session");
        expect(securityCookieName("__Secure-", "state")).toBe("__Secure-state");
        expect(() => securityCookieName("__Host-", "__Host-already-prefixed")).toThrow(TypeError);
    });

    test("__Host- cookie に必要な属性と期限を設定する", () => {
        const options = securityCookieOptions({ prefix: "__Host-", maxAge: 600 });
        expect(options).toMatchObject({
            httpOnly: true,
            secure: true,
            sameSite: "Lax",
            path: "/",
            maxAge: 600,
        });
        expect(options.expires).toBeInstanceOf(Date);
        expect("domain" in options).toBe(false);
    });

    test("Partitioned Cookie には Secure を設定する", () => {
        const options = securityCookieOptions({
            prefix: "__Secure-", maxAge: 600, sameSite: "None", partitioned: true,
        });
        expect(options).toMatchObject({ secure: true, sameSite: "None", partitioned: true });
    });

    test("Max-Age の範囲外を拒否する", () => {
        expect(() => securityCookieOptions({ prefix: "__Host-", maxAge: 0 })).toThrow(RangeError);
        expect(() => securityCookieOptions({ prefix: "__Host-", maxAge: 400 * 24 * 60 * 60 + 1 })).toThrow(RangeError);
    });
});
