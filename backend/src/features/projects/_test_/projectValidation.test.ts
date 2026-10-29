import { describe, expect, test } from "bun:test";
import {
    validateCreateProjectInput,
    validateListProjectsInput,
    validateUpdateProjectInput,
} from "../validation/validators/projectValidation";
import { projectValidationMessages } from "../validation/messages/projectMessages";
import {
    defaultProjectId,
    defaultUserId,
    validCreateProjectInput,
} from "./testHelpers";

describe("projectValidation", () => {
    test("validateCreateProjectInput (正常系)", () => {
        const result = validateCreateProjectInput(validCreateProjectInput);
        expect(result.errors).toEqual([]);
        expect(result.data?.projectName).toBe(
            validCreateProjectInput.projectName,
        );
    });

    test("validateCreateProjectInput (異常系) 空文字を拒否", () => {
        const result = validateCreateProjectInput({
            ...validCreateProjectInput,
            description: "   ",
        });
        expect(result.errors).toContain(
            projectValidationMessages.descriptionRequired,
        );
    });

    test("validateCreateProjectInput (異常系) 制御文字を拒否", () => {
        const result = validateCreateProjectInput({
            ...validCreateProjectInput,
            description: "説明\u0000",
        });
        expect(result.errors).toContain(projectValidationMessages.descriptionRequired);
    });

    test("validateCreateProjectInput (異常系) プロジェクト規模を必須にする", () => {
        const result = validateCreateProjectInput({
            ...validCreateProjectInput,
            projectScale: "   ",
        });
        expect(result.errors).toContain(projectValidationMessages.projectScaleRequired);
    });

    test("validateCreateProjectInput (異常系) 日付の形式と順序を検証する", () => {
        const result = validateCreateProjectInput({
            ...validCreateProjectInput,
            startDate: "2026-02-01",
            endDate: "2026-01-01",
        });
        expect(result.errors).toContain(projectValidationMessages.dateRangeInvalid);
    });

    test("validateListProjectsInput (正常系) userId なし", () => {
        expect(validateListProjectsInput({})).toEqual([]);
    });

    test("validateListProjectsInput (異常系) 不正な userId", () => {
        expect(validateListProjectsInput({ userId: "bad" })).toContain(
            projectValidationMessages.userIdInvalid,
        );
    });

    test("validateUpdateProjectInput (正常系)", () => {
        expect(
            validateUpdateProjectInput({
                projectId: defaultProjectId,
                myRole: "Tech Lead",
            }),
        ).toEqual([]);
    });

    test("validateUpdateProjectInput (異常系) 不正な projectId", () => {
        expect(
            validateUpdateProjectInput({
                projectId: "bad",
                userId: defaultUserId,
            } as never),
        ).toContain(projectValidationMessages.projectIdInvalid);
    });
});
