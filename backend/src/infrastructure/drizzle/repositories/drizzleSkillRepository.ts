import { and, eq, sql } from "drizzle-orm";
import type { SkillRepository } from "../../../features/skills/repositories/skillRepository";
import type { Skill } from "../../../features/skills/types/skill";
import type {
    CreateSkillsInput,
    DeleteSkillsInput,
    UpdateSkillsInput,
} from "../../../features/skills/types/skillInput";
import type { SkillLevel } from "../../../features/skills/types/skillLevel";
import db from "../db";
import { skillTechsTable, skillsTable, techsTable } from "../schema";

type SkillRow = {
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

class DrizzleSkillRepository implements SkillRepository {
    async findAll(): Promise<Skill[]> {
        const rows = await db
            .select(skillSelect())
            .from(skillsTable)
            .innerJoin(skillTechsTable, eq(skillsTable.skill_id, skillTechsTable.skill_id))
            .innerJoin(techsTable, eq(skillTechsTable.tech_id, techsTable.tech_id));

        return toSkills(rows);
    }

    async findBySkillId(skillId: string): Promise<Skill | null> {
        const rows = await db
            .select(skillSelect())
            .from(skillsTable)
            .innerJoin(skillTechsTable, eq(skillsTable.skill_id, skillTechsTable.skill_id))
            .innerJoin(techsTable, eq(skillTechsTable.tech_id, techsTable.tech_id))
            .where(eq(skillsTable.skill_id, skillId));

        const skills = toSkills(rows);

        return skills[0] ?? null;
    }

    async createSkills(input: CreateSkillsInput): Promise<Skill[]> {
        return db.transaction(async (tx) => {
            const inserted = await tx
                .insert(skillsTable)
                .values(
                    input.skills.map((skill) => ({
                        user_id: input.userId,
                        language: skill.language,
                        experience_months: skill.experienceMonths,
                        level: skill.level,
                        detail: skill.detail,
                    })),
                )
                .returning({
                    skill_id: skillsTable.skill_id,
                });

            if (inserted.length === 0) {
                throw new Error("Failed to create skills.");
            }

            await tx.insert(skillTechsTable).values(
                inserted.flatMap((insertedSkill, index) =>
                    input.skills[index].techIds.map((techId) => ({
                        skill_id: insertedSkill.skill_id,
                        tech_id: techId,
                    })),
                ),
            );

            const insertedIds = new Set(inserted.map((skill) => skill.skill_id));
            const createdSkills = await Promise.all(
                Array.from(insertedIds).map((skillId) => this.findBySkillId(skillId)),
            );

            return createdSkills.filter((skill): skill is Skill => skill !== null);
        });
    }

    async updateSkills(input: UpdateSkillsInput): Promise<Skill[]> {
        return db.transaction(async (tx) => {
            for (const skill of input.skills) {
                const updatedResult = await tx
                    .update(skillsTable)
                    .set({
                        language: skill.language,
                        experience_months: skill.experienceMonths,
                        level: skill.level,
                        detail: skill.detail,
                        updated_at: sql`(CURRENT_TIMESTAMP)`,
                    })
                    .where(
                        and(
                            eq(skillsTable.skill_id, skill.skillId),
                            eq(skillsTable.user_id, input.userId),
                        ),
                    );

                if (updatedResult.rowsAffected === 0) {
                    throw new Error("Skill not found.");
                }

                await tx
                    .delete(skillTechsTable)
                    .where(eq(skillTechsTable.skill_id, skill.skillId));

                await tx.insert(skillTechsTable).values(
                    skill.techIds.map((techId) => ({
                        skill_id: skill.skillId,
                        tech_id: techId,
                    })),
                );
            }

            const updatedSkills = await Promise.all(
                input.skills.map((skill) => this.findBySkillId(skill.skillId)),
            );

            return updatedSkills.filter((skill): skill is Skill => skill !== null);
        });
    }

    async deleteSkills(input: DeleteSkillsInput): Promise<void> {
        await db.transaction(async (tx) => {
            for (const skillId of input.skillIds) {
                await tx
                    .delete(skillTechsTable)
                    .where(eq(skillTechsTable.skill_id, skillId));

                const deletedResult = await tx
                    .delete(skillsTable)
                    .where(
                        and(
                            eq(skillsTable.skill_id, skillId),
                            eq(skillsTable.user_id, input.userId),
                        ),
                    );

                if (deletedResult.rowsAffected === 0) {
                    throw new Error("Skill not found.");
                }
            }
        });
    }
}

export { DrizzleSkillRepository };
