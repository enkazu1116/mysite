import { describe, expect, test } from "bun:test";
import {
    parseAuthProvider,
    validateOAuthCallbackParams,
} from "../validation/authValidation";
import { authValidationMessages } from "../validation/messages";

describe("authValidation", () => {
    test("parseAuthProvider は許可されたプロバイダーのみ通す", () => {
        expect(parseAuthProvider("google")).toBe("google");
        expect(parseAuthProvider("github")).toBe("github");
        expect(parseAuthProvider("unknown")).toBeNull();
        expect(parseAuthProvider(undefined)).toBeNull();
    });

    test("validateOAuthCallbackParams は code と state の不一致を拒否する", () => {
        expect(validateOAuthCallbackParams({
            code: "code",
            stateMatches: true,
        })).toEqual([]);

        expect(validateOAuthCallbackParams({
            code: undefined,
            stateMatches: true,
        })).toContain(authValidationMessages.oauthVerificationFailed);

        expect(validateOAuthCallbackParams({
            code: "code",
            stateMatches: false,
        })).toContain(authValidationMessages.oauthVerificationFailed);
    });
});
