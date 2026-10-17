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
            overview: "   ",
        });
        expect(result.errors).toContain(
            projectValidationMessages.overviewRequired,
        );
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
