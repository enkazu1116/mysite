import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { v7 as uuidv7 } from "uuid";
import isoDateTime from "./types/isoDateTime";
import uuid from "./types/uuid";

/**
 * ユーザーの基本情報を保持するテーブル。
 */
export const usersTable = sqliteTable("users_table", {
    user_id: uuid("user_id").$defaultFn(() => uuidv7()).notNull().primaryKey(),
    user_name: text("user_name").notNull().unique(),
    profile: text("profile"),
    created_at: isoDateTime().notNull().default(sql`(CURRENT_TIMESTAMP)`),
    updated_at: isoDateTime().notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

/**
 * DB 種別、フレームワーク、ライブラリなどの使用技術を保持するテーブル。
 */
export const techsTable = sqliteTable("techs_table", {
    tech_id: uuid("tech_id").$defaultFn(() => uuidv7()).notNull().primaryKey(),
    name: text("name").notNull(),
    category: text("category").notNull(),
    created_at: isoDateTime().notNull().default(sql`(CURRENT_TIMESTAMP)`),
    updated_at: isoDateTime().notNull().default(sql`(CURRENT_TIMESTAMP)`),
});

/**
 * ユーザーに紐づくスキル情報を保持するテーブル。
 * 使用言語、使用技術、経験月数、数値レベル、詳細説明を管理する。
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

/**
 * 外部書籍 API から取得した書誌情報を保持するテーブル。
 * 読書状態は持たず、ユーザー共通の本情報だけを保存する。
 */
export const booksTable = sqliteTable(
    "books_table",
    {
        book_id: uuid("book_id").$defaultFn(() => uuidv7()).notNull().primaryKey(),
        source: text("source").notNull(),
        source_book_id: text("source_book_id").notNull(),
        title: text("title").notNull(),
        authors_json: text("authors_json").notNull(),
        publisher: text("publisher"),
        published_date: text("published_date"),
        description: text("description"),
        page_count: integer("page_count"),
        thumbnail_url: text("thumbnail_url"),
        info_link: text("info_link"),
        created_at: isoDateTime().notNull().default(sql`(CURRENT_TIMESTAMP)`),
        updated_at: isoDateTime().notNull().default(sql`(CURRENT_TIMESTAMP)`),
    },
    (table) => ({
        sourceBookUnique: uniqueIndex("books_source_source_book_id_idx").on(
            table.source,
            table.source_book_id,
        ),
    }),
);

/**
 * ユーザーが保存した読書本データを保持するテーブル。
 * 読書状態やメモなど、ユーザー固有の情報はこちらに寄せる。
 */
export const userBooksTable = sqliteTable(
    "user_books_table",
    {
        user_book_id: uuid("user_book_id").$defaultFn(() => uuidv7()).notNull().primaryKey(),
        user_id: uuid("user_id")
            .notNull()
            .references(() => usersTable.user_id),
        book_id: uuid("book_id")
            .notNull()
            .references(() => booksTable.book_id),
        status: text("status").notNull(),
        current_page: integer("current_page"),
        note: text("note"),
        started_at: isoDateTime(),
        finished_at: isoDateTime(),
        created_at: isoDateTime().notNull().default(sql`(CURRENT_TIMESTAMP)`),
        updated_at: isoDateTime().notNull().default(sql`(CURRENT_TIMESTAMP)`),
    },
    (table) => ({
        userBookUnique: uniqueIndex("user_books_user_id_book_id_idx").on(
            table.user_id,
            table.book_id,
        ),
    }),
);
