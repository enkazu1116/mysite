import type { SkillId } from "./skill";
import type { SkillLevel } from "./skillLevel";

type SkillMutationInput = {
    userId: string;
    language: string;
    techIds: string[];
    experienceMonths: number;
    level: SkillLevel;
    detail: string;
};

type CreateSkillInput = SkillMutationInput;

type UpdateSkillInput = SkillMutationInput & {
    skillId: SkillId;
};

type DeleteSkillInput = {
    userId: string;
    skillId: SkillId;
};

export type {
    CreateSkillInput,
    DeleteSkillInput,
    SkillMutationInput,
    UpdateSkillInput,
};
