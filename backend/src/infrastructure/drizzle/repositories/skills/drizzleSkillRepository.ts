import { and, eq, sql } from "drizzle-orm";
import { skillPersistenceMessages } from "../../../../util/messages/persistence/skills";
import type { SkillRepository } from "../../../../features/skills/repositories/skillRepository";
import type { Skill } from "../../../../features/skills/types/skill";
import type {
    CreateSkillsInput,
    DeleteSkillsInput,
    UpdateSkillsInput,
} from "../../../../features/skills/types/skillInput";
import { skillSelect, toSkills } from "../../mappers/skills/skillMapper";
import db from "../../db";
import { skillTechsTable, skillsTable, techsTable } from "../../schema";

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
                throw new Error(skillPersistenceMessages.createFailed);
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
                    throw new Error(skillPersistenceMessages.notFound);
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
                    throw new Error(skillPersistenceMessages.notFound);
                }
            }
        });
    }
}

export { DrizzleSkillRepository };
