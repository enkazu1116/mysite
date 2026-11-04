import { describe, expect, test } from "bun:test";
import { canAuthenticateAsAdministrator } from "../domain/authIdentity";

const allowList = {
    google: ["google-subject"],
    github: ["12345"],
};

describe("管理者認可", () => {
    test("許可リストにある主体を管理者として許可する", () => {
        expect(canAuthenticateAsAdministrator(
            { provider: "google", id: "google-subject" }, allowList,
        )).toBe(true);
        expect(canAuthenticateAsAdministrator(
            { provider: "github", id: "12345" }, allowList,
        )).toBe(true);
        expect(canAuthenticateAsAdministrator(
            { provider: "google", id: "other" }, allowList,
        )).toBe(false);
    });

    test("Googleアカウントはメールアドレスが確認済みの場合に認証を許可する", () => {
        expect(canAuthenticateAsAdministrator(
            { provider: "google", id: "google-subject", emailVerified: false }, allowList,
        )).toBe(false);
        expect(canAuthenticateAsAdministrator(
            { provider: "google", id: "google-subject", emailVerified: true }, allowList,
        )).toBe(true);
    });
});
