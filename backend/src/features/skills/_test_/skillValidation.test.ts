import { describe, expect, test } from "bun:test";
import {
    MAX_DETAIL_LENGTH,
    MAX_EXPERIENCE_MONTHS,
    MAX_LANGUAGE_LENGTH,
    validateCreateSkillsInput,
    validateDeleteSkillsInput,
    validateUpdateSkillsInput,
} from "../validation/skillValidation";
import { skillValidationMessages } from "../validation/messages";
import {
    validCreateSkillInput,
    validCreateSkillsInput,
    validDeleteSkillsInput,
    validUpdateSkillsInput,
} from "./fixtures";

describe("skillValidation.ts / 入力バリデーション", () => {
    describe("validateCreateSkillsInput", () => {
        test("有効な入力なら空配列を返す", () => {
            expect(validateCreateSkillsInput(validCreateSkillsInput)).toEqual(
                [],
            );
        });

        test.each([
            [
                "userId が UUID でない",
                { ...validCreateSkillsInput, userId: "not-uuid" },
                skillValidationMessages.userIdInvalid,
            ],
            [
                "skills が空",
                { ...validCreateSkillsInput, skills: [] },
                skillValidationMessages.skillsRequired,
            ],
            [
                "language が空",
                {
                    ...validCreateSkillsInput,
                    skills: [{ ...validCreateSkillInput(), language: "" }],
                },
                skillValidationMessages.languageRequired,
            ],
            [
                "language が上限超過",
                {
                    ...validCreateSkillsInput,
                    skills: [
                        {
                            ...validCreateSkillInput(),
                            language: "a".repeat(MAX_LANGUAGE_LENGTH + 1),
                        },
                    ],
                },
                skillValidationMessages.languageMax(MAX_LANGUAGE_LENGTH),
            ],
            [
                "techIds が空",
                {
                    ...validCreateSkillsInput,
                    skills: [{ ...validCreateSkillInput(), techIds: [] }],
                },
                skillValidationMessages.techIdsRequired,
            ],
            [
                "techId が UUID でない",
                {
                    ...validCreateSkillsInput,
                    skills: [
                        { ...validCreateSkillInput(), techIds: ["not-uuid"] },
                    ],
                },
                skillValidationMessages.techIdInvalid,
            ],
            [
                "experienceMonths が負数",
                {
                    ...validCreateSkillsInput,
                    skills: [
                        { ...validCreateSkillInput(), experienceMonths: -1 },
                    ],
                },
                skillValidationMessages.experienceMonthsMin,
            ],
            [
                "experienceMonths が上限超過",
                {
                    ...validCreateSkillsInput,
                    skills: [
                        {
                            ...validCreateSkillInput(),
                            experienceMonths: MAX_EXPERIENCE_MONTHS + 1,
                        },
                    ],
                },
                skillValidationMessages.experienceMonthsMax(
                    MAX_EXPERIENCE_MONTHS,
                ),
            ],
            [
                "level が未対応値",
                {
                    ...validCreateSkillsInput,
                    skills: [{ ...validCreateSkillInput(), level: 99 }],
                },
                skillValidationMessages.levelUnsupported,
            ],
            [
                "detail が空",
                {
                    ...validCreateSkillsInput,
                    skills: [{ ...validCreateSkillInput(), detail: "" }],
                },
                skillValidationMessages.detailRequired,
            ],
            [
                "detail が上限超過",
                {
                    ...validCreateSkillsInput,
                    skills: [
                        {
                            ...validCreateSkillInput(),
                            detail: "a".repeat(MAX_DETAIL_LENGTH + 1),
                        },
                    ],
                },
                skillValidationMessages.detailMax(MAX_DETAIL_LENGTH),
            ],
        ] as const)(
            "%s なら %s を含む",
            (_label, input, expectedMessage) => {
                const errors = validateCreateSkillsInput(input);

                expect(errors).toContain(expectedMessage);
            },
        );
    });

    describe("validateUpdateSkillsInput", () => {
        test("有効な入力なら空配列を返す", () => {
            expect(validateUpdateSkillsInput(validUpdateSkillsInput)).toEqual(
                [],
            );
        });

        test.each([
            [
                "userId が UUID でない",
                { ...validUpdateSkillsInput, userId: "not-uuid" },
                skillValidationMessages.userIdInvalid,
            ],
            [
                "skillId が UUID でない",
                {
                    ...validUpdateSkillsInput,
                    skills: [
                        {
                            ...validUpdateSkillsInput.skills[0],
                            skillId: "not-uuid",
                        },
                    ],
                },
                skillValidationMessages.skillIdInvalid,
            ],
            [
                "skills が空",
                { ...validUpdateSkillsInput, skills: [] },
                skillValidationMessages.skillsRequired,
            ],
        ] as const)("%s なら %s を含む", (_label, input, expectedMessage) => {
            const errors = validateUpdateSkillsInput(input);

            expect(errors).toContain(expectedMessage);
        });
    });

    describe("validateDeleteSkillsInput", () => {
        test("有効な入力なら空配列を返す", () => {
            expect(validateDeleteSkillsInput(validDeleteSkillsInput)).toEqual(
                [],
            );
        });

        test.each([
            [
                "userId が UUID でない",
                { ...validDeleteSkillsInput, userId: "not-uuid" },
                skillValidationMessages.userIdInvalid,
            ],
            [
                "skillIds が空",
                { ...validDeleteSkillsInput, skillIds: [] },
                skillValidationMessages.skillIdsRequired,
            ],
            [
                "skillId が UUID でない",
                {
                    ...validDeleteSkillsInput,
                    skillIds: ["not-uuid"],
                },
                skillValidationMessages.skillIdInvalid,
            ],
        ] as const)("%s なら %s を含む", (_label, input, expectedMessage) => {
            const errors = validateDeleteSkillsInput(input);

            expect(errors).toContain(expectedMessage);
        });
    });
});
