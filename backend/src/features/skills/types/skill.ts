import type { Tech } from "./tech";
import type { SkillLevel } from "./skillLevel";

type SkillId = string;

type Skill = {
    userId: string;
    skillId: SkillId;
    language: string;
    techs: Tech[];
    experienceMonths: number;
    level: SkillLevel;
    detail: string;
};

export type { Skill, SkillId };
