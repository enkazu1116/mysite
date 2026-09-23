import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { v7 as uuidv7 } from "uuid";
import isoDateTime from "../types/isoDateTime";
import uuid from "../types/uuid";
import { usersTable } from "./users";

/**
 * ユーザーに紐づく参画プロジェクトを保持するテーブル。
 * 使用技術は自由記述テキストとして持つ。
 */
export const projectsTable = sqliteTable("projects_table", {
    project_id: uuid("project_id").$defaultFn(() => uuidv7()).notNull().primaryKey(),
    user_id: uuid("user_id")
        .notNull()
        .references(() => usersTable.user_id),
    project_name: text("project_name").notNull(),
    overview: text("overview").notNull(),
    my_role: text("my_role").notNull(),
    team_size: integer("team_size").notNull(),
    technologies: text("technologies").notNull(),
    challenges: text("challenges").notNull(),
    decisions: text("decisions").notNull(),
    outcomes: text("outcomes").notNull(),
    created_at: isoDateTime().notNull().default(sql`(CURRENT_TIMESTAMP)`),
    updated_at: isoDateTime().notNull().default(sql`(CURRENT_TIMESTAMP)`),
});
