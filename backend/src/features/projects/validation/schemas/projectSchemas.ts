import { z } from "zod";
import type {
    CreateProjectInput,
    ListProjectsInput,
    UpdateProjectInput,
} from "../../commands/projectCommands";
import { projectValidationMessages } from "../messages/projectMessages";

const requiredText = (message: string) =>
    z.string().trim().min(1, message);

const teamSizeSchema = z
    .number({
        error: () => projectValidationMessages.teamSizeInvalid,
    })
    .int(projectValidationMessages.teamSizeInvalid)
    .min(1, projectValidationMessages.teamSizeInvalid);

/**
 * プロジェクト作成用スキーマ
 */
const createProjectSchema = z.object({
    userId: z.uuid({
        error: () => projectValidationMessages.userIdInvalid,
    }),
    projectName: requiredText(projectValidationMessages.projectNameRequired),
    overview: requiredText(projectValidationMessages.overviewRequired),
    myRole: requiredText(projectValidationMessages.myRoleRequired),
    teamSize: teamSizeSchema,
    technologies: requiredText(projectValidationMessages.technologiesRequired),
    challenges: requiredText(projectValidationMessages.challengesRequired),
    decisions: requiredText(projectValidationMessages.decisionsRequired),
    outcomes: requiredText(projectValidationMessages.outcomesRequired),
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
    projectName: requiredText(
        projectValidationMessages.projectNameRequired,
    ).optional(),
    overview: requiredText(projectValidationMessages.overviewRequired).optional(),
    myRole: requiredText(projectValidationMessages.myRoleRequired).optional(),
    teamSize: teamSizeSchema.optional(),
    technologies: requiredText(
        projectValidationMessages.technologiesRequired,
    ).optional(),
    challenges: requiredText(
        projectValidationMessages.challengesRequired,
    ).optional(),
    decisions: requiredText(
        projectValidationMessages.decisionsRequired,
    ).optional(),
    outcomes: requiredText(projectValidationMessages.outcomesRequired).optional(),
}) satisfies z.ZodType<UpdateProjectInput>;

export { createProjectSchema, listProjectsSchema, updateProjectSchema };
