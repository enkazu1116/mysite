import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { v7 as uuidv7 } from "uuid";
import isoDateTime from "../types/isoDateTime";
import uuid from "../types/uuid";
import { usersTable } from "./users";

/**
 * ユーザーに紐づく参画プロジェクトを保持するテーブル。
 * 概要項目と詳細項目を同一レコード内で管理する。
 */
export const projectsTable = sqliteTable("projects_table", {
    project_id: uuid("project_id").$defaultFn(() => uuidv7()).notNull().primaryKey(),
    user_id: uuid("user_id")
        .notNull()
        .references(() => usersTable.user_id),
    project_name: text("project_name").notNull(),
    is_highlighted: integer("is_highlighted", { mode: "boolean" })
        .notNull()
        .default(false),
    start_date: text("start_date"),
    end_date: text("end_date"),
    description: text("description").notNull(),
    my_role: text("my_role").notNull(),
    team_size: integer("team_size").notNull(),
    technologies: text("technologies").notNull(),
    project_scale: text("project_scale").notNull(),
    challenges: text("challenges").notNull(),
    decisions: text("decisions").notNull(),
    outcomes: text("outcomes").notNull(),
    reflection: text("reflection").notNull(),
    created_at: isoDateTime().notNull().default(sql`(CURRENT_TIMESTAMP)`),
    updated_at: isoDateTime().notNull().default(sql`(CURRENT_TIMESTAMP)`),
});
