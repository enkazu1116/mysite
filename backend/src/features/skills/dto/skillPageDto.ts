import type { SkillLevel } from "../types/skillLevel";

/**
 * スキルページ表示用の DTO。
 * user / skill / tech の情報を 1 つにまとめ、画面側が扱いやすい形で返す。
 */
type SkillPageDto = {
    userId: string;
    userName: string;
    profile: string | null;
    skillId: string;
    language: string;
    experienceMonths: number;
    level: SkillLevel;
    detail: string;
    techs: {
        techId: string;
        name: string;
        category: string;
    }[];
};

export type { SkillPageDto };
