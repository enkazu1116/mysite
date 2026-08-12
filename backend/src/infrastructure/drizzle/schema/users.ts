import { sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { v7 as uuidv7 } from "uuid";
import isoDateTime from "../types/isoDateTime";
import uuid from "../types/uuid";

/**
 * ユーザーの基本情報を保持するテーブル
 */
export const usersTable = sqliteTable("users_table", {
    user_id: uuid("user_id").$defaultFn(() => uuidv7()).notNull().primaryKey(),
    user_name: text("user_name").notNull().unique(),
    bio: text("bio"),
    icon_url: text("icon_url"),
    github_url: text("github_url"),
    article_url: text("article_url"),
    created_at: isoDateTime().notNull().default(sql`(CURRENT_TIMESTAMP)`),
    updated_at: isoDateTime().notNull().default(sql`(CURRENT_TIMESTAMP)`),
});
