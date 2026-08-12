import type { Skill } from "../../../../features/skills/types/skill";
import type { SkillLevel } from "../../../../features/skills/types/skillLevel";
import { skillsTable, techsTable } from "../../schema";

export type SkillRow = {
    skill_id: string;
    user_id: string;
    language: string;
    experience_months: number;
    level: number;
    detail: string;
    tech_id: string;
    tech_name: string;
    tech_category: string;
};

function toSkills(rows: SkillRow[]): Skill[] {
    const skillsById = new Map<string, Skill>();

    for (const row of rows) {
        const tech = {
            techId: row.tech_id,
            name: row.tech_name,
            category: row.tech_category,
        };

        const existing = skillsById.get(row.skill_id);
        if (existing) {
            existing.techs.push(tech);
            continue;
        }

        skillsById.set(row.skill_id, {
            userId: row.user_id,
            skillId: row.skill_id,
            language: row.language,
            techs: [tech],
            experienceMonths: row.experience_months,
            level: row.level as SkillLevel,
            detail: row.detail,
        });
    }

    return Array.from(skillsById.values());
}

function skillSelect() {
    return {
        skill_id: skillsTable.skill_id,
        user_id: skillsTable.user_id,
        language: skillsTable.language,
        experience_months: skillsTable.experience_months,
        level: skillsTable.level,
        detail: skillsTable.detail,
        tech_id: techsTable.tech_id,
        tech_name: techsTable.name,
        tech_category: techsTable.category,
    };
}

export { skillSelect, toSkills };
