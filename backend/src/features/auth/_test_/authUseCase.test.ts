import { describe, expect, test } from "bun:test";
import { AuthUseCase } from "../usecase/authUseCase";

const allowList = { google: ["google-subject"], github: ["12345"] };

describe("認証ユースケース", () => {
    test("許可された主体を認証済みとして返す", () => {
        const useCase = new AuthUseCase();
        expect(useCase.authenticateAdministrator({
            identity: { provider: "google", id: "google-subject" },
            administratorAllowList: allowList,
        })).toEqual({
            type: "authenticated",
            identity: { provider: "google", id: "google-subject" },
        });
    });

    test("許可リストにない主体を拒否する", () => {
        const useCase = new AuthUseCase();
        expect(useCase.authenticateAdministrator({
            identity: { provider: "google", id: "other-subject" },
            administratorAllowList: allowList,
        })).toEqual({
            type: "unauthorized",
            identity: { provider: "google", id: "other-subject" },
        });
    });
});
