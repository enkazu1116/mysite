import { z } from "zod";
import type {
    CreateProjectInput,
    ListProjectsInput,
    UpdateProjectInput,
} from "../../commands/projectCommands";
import { projectValidationMessages } from "../messages/projectMessages";

const safeText = (message: string, max: number) =>
    z
        .string()
        .trim()
        .min(1, message)
        .max(max, message)
        .refine(
            (value) => [...value].every((char) => {
                const code = char.charCodeAt(0);
                return code >= 0x20 && code !== 0x7f;
            }),
            message,
        );

const requiredText = (message: string) => safeText(message, 5000);
const shortText = (message: string) => safeText(message, 200);

const teamSizeSchema = z
    .number({
        error: () => projectValidationMessages.teamSizeInvalid,
    })
    .int(projectValidationMessages.teamSizeInvalid)
    .min(1, projectValidationMessages.teamSizeInvalid)
    .max(10000, projectValidationMessages.teamSizeInvalid);

const projectDateSchema = z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, projectValidationMessages.dateInvalid)
    .refine((value) => {
        const parsed = new Date(`${value}T00:00:00Z`);
        return !Number.isNaN(parsed.getTime()) &&
            parsed.toISOString().slice(0, 10) === value;
    }, projectValidationMessages.dateInvalid);

const nullableProjectDateSchema = z.union([
    projectDateSchema,
    z.null(),
]);

const dateRangeIsValid = (value: { startDate?: string | null; endDate?: string | null }) =>
    !value.startDate || !value.endDate || value.startDate <= value.endDate;

/**
 * プロジェクト作成用スキーマ
 */
const createProjectSchema = z.object({
    userId: z.uuid({
        error: () => projectValidationMessages.userIdInvalid,
    }),
    projectName: shortText(projectValidationMessages.projectNameRequired),
    isHighlighted: z.boolean({
        error: () => projectValidationMessages.highlightInvalid,
    }),
    startDate: nullableProjectDateSchema,
    endDate: nullableProjectDateSchema,
    description: requiredText(projectValidationMessages.descriptionRequired),
    myRole: shortText(projectValidationMessages.myRoleRequired),
    teamSize: teamSizeSchema,
    technologies: requiredText(projectValidationMessages.technologiesRequired),
    projectScale: shortText(projectValidationMessages.projectScaleRequired),
    challenges: requiredText(projectValidationMessages.challengesRequired),
    decisions: requiredText(projectValidationMessages.decisionsRequired),
    outcomes: requiredText(projectValidationMessages.outcomesRequired),
    reflection: requiredText(projectValidationMessages.reflectionRequired),
}).refine(dateRangeIsValid, {
    message: projectValidationMessages.dateRangeInvalid,
    path: ["endDate"],
}) satisfies z.ZodType<CreateProjectInput>;

/**
 * プロジェクト一覧取得用スキーマ
 */
const listProjectsSchema = z.object({
    userId: z
        .uuid({
            error: () => projectValidationMessages.userIdInvalid,
        })
        .optional(),
}) satisfies z.ZodType<ListProjectsInput>;

/**
 * プロジェクト部分更新用スキーマ
 */
const updateProjectSchema = z.object({
    projectId: z.uuid({
        error: () => projectValidationMessages.projectIdInvalid,
    }),
    projectName: shortText(
        projectValidationMessages.projectNameRequired,
    ).optional(),
    isHighlighted: z.boolean({
        error: () => projectValidationMessages.highlightInvalid,
    }).optional(),
    startDate: nullableProjectDateSchema.optional(),
    endDate: nullableProjectDateSchema.optional(),
    description: requiredText(projectValidationMessages.descriptionRequired).optional(),
    myRole: shortText(projectValidationMessages.myRoleRequired).optional(),
    teamSize: teamSizeSchema.optional(),
    technologies: requiredText(
        projectValidationMessages.technologiesRequired,
    ).optional(),
    projectScale: shortText(
        projectValidationMessages.projectScaleRequired,
    ).optional(),
    challenges: requiredText(
        projectValidationMessages.challengesRequired,
    ).optional(),
    decisions: requiredText(
        projectValidationMessages.decisionsRequired,
    ).optional(),
    outcomes: requiredText(projectValidationMessages.outcomesRequired).optional(),
    reflection: requiredText(projectValidationMessages.reflectionRequired).optional(),
}).refine(dateRangeIsValid, {
    message: projectValidationMessages.dateRangeInvalid,
    path: ["endDate"],
}) satisfies z.ZodType<UpdateProjectInput>;

export { createProjectSchema, listProjectsSchema, updateProjectSchema };
