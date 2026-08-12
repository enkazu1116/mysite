import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { v7 as uuidv7 } from "uuid";
import isoDateTime from "../types/isoDateTime";
import uuid from "../types/uuid";
import { usersTable } from "./users";

/**
 * DB 種別、フレームワーク、ライブラリなどの使用技術を保持するテーブル
 */
export const techsTable = sqliteTable("techs_table", {
    tech_id: uuid("tech_id").$defaultFn(() => uuidv7()).notNull().primaryKey(),
    name: text("name").notNull(),
    category: text("category").notNull(),
    created_at: isoDateTime().notNull().default(sql`(CURRENT_TIMESTAMP)`),
    updated_at: isoDateTime().notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

/**
 * ユーザーに紐づくスキル情報を保持するテーブル
 * 使用言語、使用技術、経験月数、数値レベル、詳細説明を管理する
 */
export const skillsTable = sqliteTable("skills_table", {
    skill_id: uuid("skill_id").$defaultFn(() => uuidv7()).notNull().primaryKey(),
    user_id: uuid("user_id")
        .notNull()
        .references(() => usersTable.user_id),
    language: text("language").notNull(),
    experience_months: integer("experience_months").notNull(),
    level: integer("level").notNull(),
    detail: text("detail").notNull(),
    created_at: isoDateTime().notNull().default(sql`(CURRENT_TIMESTAMP)`),
    updated_at: isoDateTime().notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

export const skillTechsTable = sqliteTable("skill_techs_table", {
    skill_tech_id: uuid("skill_tech_id").$defaultFn(() => uuidv7()).notNull().primaryKey(),
    skill_id: uuid("skill_id")
        .notNull()
        .references(() => skillsTable.skill_id),
    tech_id: uuid("tech_id")
        .notNull()
        .references(() => techsTable.tech_id),
    created_at: isoDateTime().notNull().default(sql`(CURRENT_TIMESTAMP)`),
    updated_at: isoDateTime().notNull().default(sql`(CURRENT_TIMESTAMP)`),
});
