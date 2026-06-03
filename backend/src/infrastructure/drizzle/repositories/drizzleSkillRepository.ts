import { and, eq, sql } from "drizzle-orm";
import type { SkillRepository } from "../../../features/skills/repositories/skillRepository";
import type { Skill } from "../../../features/skills/types/skill";
import type {
    CreateSkillInput,
    DeleteSkillInput,
    UpdateSkillInput,
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

/**
 * skills / skill_techs / techs の結合結果を、言語単位の Skill に集約する。
 *
 * @param rows 結合結果のレコード一覧
 * @returns techs 配列を持つスキル一覧
 */
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

    return [...skillsById.values()];
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

/**
 * Drizzle を用いて skills / skill_techs / techs テーブルからスキル情報を取得する Repository 実装。
 */
class DrizzleSkillRepository implements SkillRepository {
    /**
     * 全ユーザーのスキル情報を取得する。
     *
     * @returns すべてのスキル一覧
     */
    async findAll(): Promise<Skill[]> {
        const rows = await db
            .select(skillSelect())
            .from(skillsTable)
            .innerJoin(skillTechsTable, eq(skillsTable.skill_id, skillTechsTable.skill_id))
            .innerJoin(techsTable, eq(skillTechsTable.tech_id, techsTable.tech_id));

        return toSkills(rows);
    }

    /**
     * 指定ユーザーに紐づくスキル情報を取得する。
     *
     * @param userId 検索対象のユーザー ID
     * @returns 指定ユーザーのスキル一覧
     */
    async findByUserId(userId: string): Promise<Skill[]> {
        const rows = await db
            .select(skillSelect())
            .from(skillsTable)
            .innerJoin(skillTechsTable, eq(skillsTable.skill_id, skillTechsTable.skill_id))
            .innerJoin(techsTable, eq(skillTechsTable.tech_id, techsTable.tech_id))
            .where(eq(skillsTable.user_id, userId));

        return toSkills(rows);
    }

    /**
     * 1 言語分のスキル情報を登録し、紐づく複数技術もまとめて登録する。
     *
     * @param input 登録対象のスキル情報
     * @returns 登録後のスキル情報
     */
    async create(input: CreateSkillInput): Promise<Skill> {
        return db.transaction(async (tx) => {
            const inserted = await tx
                .insert(skillsTable)
                .values({
                    user_id: input.userId,
                    language: input.language,
                    experience_months: input.experienceMonths,
                    level: input.level,
                    detail: input.detail,
                })
                .returning({
                    skill_id: skillsTable.skill_id,
                });

            if (inserted.length === 0) {
                throw new Error("Failed to create skill.");
            }

            await tx.insert(skillTechsTable).values(
                input.techIds.map((techId) => ({
                    skill_id: inserted[0].skill_id,
                    tech_id: techId,
                })),
            );

            const created = await tx
                .select(skillSelect())
                .from(skillsTable)
                .innerJoin(skillTechsTable, eq(skillsTable.skill_id, skillTechsTable.skill_id))
                .innerJoin(techsTable, eq(skillTechsTable.tech_id, techsTable.tech_id))
                .where(eq(skillsTable.skill_id, inserted[0].skill_id));

            if (created.length === 0) {
                throw new Error("Created skill could not be loaded.");
            }

            return toSkills(created)[0];
        });
    }

    /**
     * スキル本体を更新し、紐づく技術一覧も入れ替える。
     *
     * @param input 更新対象のスキル情報
     * @returns 更新後のスキル情報
     */
    async update(input: UpdateSkillInput): Promise<Skill> {
        return db.transaction(async (tx) => {
            const updatedResult = await tx
                .update(skillsTable)
                .set({
                    language: input.language,
                    experience_months: input.experienceMonths,
                    level: input.level,
                    detail: input.detail,
                    updated_at: sql`(CURRENT_TIMESTAMP)`,
                })
                .where(
                    and(
                        eq(skillsTable.skill_id, input.skillId),
                        eq(skillsTable.user_id, input.userId),
                    ),
                );

            if (updatedResult.rowsAffected === 0) {
                throw new Error("Skill not found.");
            }

            await tx
                .delete(skillTechsTable)
                .where(eq(skillTechsTable.skill_id, input.skillId));

            await tx.insert(skillTechsTable).values(
                input.techIds.map((techId) => ({
                    skill_id: input.skillId,
                    tech_id: techId,
                })),
            );

            const updated = await tx
                .select(skillSelect())
                .from(skillsTable)
                .innerJoin(skillTechsTable, eq(skillsTable.skill_id, skillTechsTable.skill_id))
                .innerJoin(techsTable, eq(skillTechsTable.tech_id, techsTable.tech_id))
                .where(
                    and(
                        eq(skillsTable.skill_id, input.skillId),
                        eq(skillsTable.user_id, input.userId),
                    ),
                );

            if (updated.length === 0) {
                throw new Error("Updated skill could not be loaded.");
            }

            return toSkills(updated)[0];
        });
    }

    /**
     * スキル情報を物理削除する。
     * 紐づく skill_techs も合わせて削除する。
     *
     * @param input 削除対象の識別情報
     */
    async delete(input: DeleteSkillInput): Promise<void> {
        await db.transaction(async (tx) => {
            await tx
                .delete(skillTechsTable)
                .where(eq(skillTechsTable.skill_id, input.skillId));

            const deletedResult = await tx
                .delete(skillsTable)
                .where(
                    and(
                        eq(skillsTable.skill_id, input.skillId),
                        eq(skillsTable.user_id, input.userId),
                    ),
                );

            if (deletedResult.rowsAffected === 0) {
                throw new Error("Skill not found.");
            }
        });
    }
}

export { DrizzleSkillRepository };
