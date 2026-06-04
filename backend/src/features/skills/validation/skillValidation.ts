import { z } from "zod";
import {
    type CreateSkillInput,
    type CreateSkillsInput,
    type DeleteSkillsInput,
    type UpdateSkillInput,
    type UpdateSkillsInput,
} from "../types/skillInput";
import { SkillLevel } from "../types/skillLevel";
import { skillValidationMessages } from "./messages";

const MAX_LANGUAGE_LENGTH = 100;
const MAX_DETAIL_LENGTH = 2000;
const MAX_EXPERIENCE_MONTHS = 1200;
const SKILL_LEVEL_VALUES = Object.values(SkillLevel).filter(
    (value): value is SkillLevel => typeof value === "number",
) as [SkillLevel, ...SkillLevel[]];

const userIdSchema = z.uuid({
    error: () => skillValidationMessages.userIdInvalid,
});

const skillIdSchema = z.uuid({
    error: () => skillValidationMessages.skillIdInvalid,
});

const techIdSchema = z.uuid({
    error: () => skillValidationMessages.techIdInvalid,
});

const skillFormSchema = z.object({
    language: z
        .string()
        .trim()
        .min(1, skillValidationMessages.languageRequired)
        .max(
            MAX_LANGUAGE_LENGTH,
            skillValidationMessages.languageMax(MAX_LANGUAGE_LENGTH),
        ),
    techIds: z
        .array(techIdSchema)
        .min(1, skillValidationMessages.techIdsRequired),
    experienceMonths: z
        .number()
        .int(skillValidationMessages.experienceMonthsInteger)
        .min(0, skillValidationMessages.experienceMonthsMin)
        .max(
            MAX_EXPERIENCE_MONTHS,
            skillValidationMessages.experienceMonthsMax(MAX_EXPERIENCE_MONTHS),
        ),
    level: z
        .number()
        .int(skillValidationMessages.levelInteger)
        .refine(
            (value) => SKILL_LEVEL_VALUES.includes(value),
            skillValidationMessages.levelUnsupported,
        ),
    detail: z
        .string()
        .trim()
        .min(1, skillValidationMessages.detailRequired)
        .max(
            MAX_DETAIL_LENGTH,
            skillValidationMessages.detailMax(MAX_DETAIL_LENGTH),
        ),
});

const createSkillSchema = skillFormSchema satisfies z.ZodType<CreateSkillInput>;

const updateSkillSchema = skillFormSchema.extend({
    skillId: skillIdSchema,
}) satisfies z.ZodType<UpdateSkillInput>;

const createSkillsSchema = z.object({
    userId: userIdSchema,
    skills: z
        .array(createSkillSchema)
        .min(1, skillValidationMessages.skillsRequired),
}) satisfies z.ZodType<CreateSkillsInput>;

const updateSkillsSchema = z.object({
    userId: userIdSchema,
    skills: z
        .array(updateSkillSchema)
        .min(1, skillValidationMessages.skillsRequired),
}) satisfies z.ZodType<UpdateSkillsInput>;

const deleteSkillsSchema = z.object({
    userId: userIdSchema,
    skillIds: z
        .array(skillIdSchema)
        .min(1, skillValidationMessages.skillIdsRequired),
}) satisfies z.ZodType<DeleteSkillsInput>;

/**
 * スキル登録・更新時の入力値をバックエンド側で検証する。
 * フロントエンドでも検証する前提だが、API 単体で不正入力を弾くために同等のチェックを行う。
 *
 * @param input 検証対象のスキル入力
 * @returns バリデーションエラーメッセージ一覧
 */
function validateCreateSkillsInput(input: CreateSkillsInput): string[] {
    const result = createSkillsSchema.safeParse(input);

    if (result.success) {
        return [];
    }

    return result.error.issues.map((issue) => issue.message);
}

/**
 * スキル削除時の入力値を Zod スキーマで検証する。
 *
 * @param input 検証対象の削除入力
 * @returns バリデーションエラーメッセージ一覧
 */
function validateUpdateSkillsInput(input: UpdateSkillsInput): string[] {
    const result = updateSkillsSchema.safeParse(input);

    if (result.success) {
        return [];
    }

    return result.error.issues.map((issue) => issue.message);
}

/**
 * スキル削除時の入力値を Zod スキーマで検証する。
 *
 * @param input 検証対象の削除入力
 * @returns バリデーションエラーメッセージ一覧
 */
function validateDeleteSkillsInput(input: DeleteSkillsInput): string[] {
    const result = deleteSkillsSchema.safeParse(input);

    if (result.success) {
        return [];
    }

    return result.error.issues.map((issue) => issue.message);
}

export {
    MAX_EXPERIENCE_MONTHS,
    MAX_DETAIL_LENGTH,
    MAX_LANGUAGE_LENGTH,
    createSkillSchema,
    createSkillsSchema,
    deleteSkillsSchema,
    updateSkillsSchema,
    updateSkillSchema,
    validateCreateSkillsInput,
    validateDeleteSkillsInput,
    validateUpdateSkillsInput,
};
