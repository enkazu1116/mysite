import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { v7 as uuidv7 } from "uuid";
import isoDateTime from "../types/isoDateTime";
import uuid from "../types/uuid";
import { usersTable } from "./users";

/**
 * Google Books API から取得した書籍情報を保持するテーブル
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
    (table) => [
        uniqueIndex("books_source_source_book_id_idx").on(
            table.source,
            table.source_book_id,
        ),
    ],
);
/**
 * ユーザーが保存した書籍データを保持するテーブル
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
        started_at: isoDateTime(),
        finished_at: isoDateTime(),
        created_at: isoDateTime().notNull().default(sql`(CURRENT_TIMESTAMP)`),
        updated_at: isoDateTime().notNull().default(sql`(CURRENT_TIMESTAMP)`),
    },
    (table) => [
        uniqueIndex("user_books_user_id_book_id_idx").on(
            table.user_id,
            table.book_id,
        ),
    ],
);
