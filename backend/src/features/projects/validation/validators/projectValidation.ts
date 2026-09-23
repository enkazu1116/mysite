import type {
    CreateProjectInput,
    ListProjectsInput,
    UpdateProjectInput,
} from "../../commands/projectCommands";
import {
    createProjectSchema,
    listProjectsSchema,
    updateProjectSchema,
} from "../schemas/projectSchemas";
import { toErrorMessages } from "../utils/toErrorMessages";

type ParseResult<T> = {
    errors: string[];
    data?: T;
};

function validateCreateProjectInput(
    input: CreateProjectInput,
): ParseResult<CreateProjectInput> {
    const result = createProjectSchema.safeParse(input);
    if (!result.success) {
        return { errors: toErrorMessages(result) };
    }

    return { errors: [], data: result.data };
}

function validateListProjectsInput(input: ListProjectsInput): string[] {
    return toErrorMessages(listProjectsSchema.safeParse(input));
}

function validateUpdateProjectInput(input: UpdateProjectInput): string[] {
    return toErrorMessages(updateProjectSchema.safeParse(input));
}

export {
    validateCreateProjectInput,
    validateListProjectsInput,
    validateUpdateProjectInput,
};
