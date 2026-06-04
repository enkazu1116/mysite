import type { SkillId } from "./skill";
import type { SkillLevel } from "./skillLevel";

type SkillFormInput = {
    language: string;
    techIds: string[];
    experienceMonths: number;
    level: SkillLevel;
    detail: string;
};

type CreateSkillInput = SkillFormInput;

type UpdateSkillInput = SkillFormInput & {
    skillId: SkillId;
};

type CreateSkillsInput = {
    userId: string;
    skills: CreateSkillInput[];
};

type UpdateSkillsInput = {
    userId: string;
    skills: UpdateSkillInput[];
};

type DeleteSkillsInput = {
    userId: string;
    skillIds: SkillId[];
};

export type {
    CreateSkillInput,
    CreateSkillsInput,
    DeleteSkillsInput,
    SkillFormInput,
    UpdateSkillInput,
    UpdateSkillsInput,
};
