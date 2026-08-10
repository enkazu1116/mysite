CREATE TABLE `__new_book_chapter_memos_table` (
	`chapter_memo_id` text PRIMARY KEY NOT NULL,
	`user_book_id` text NOT NULL,
	`chapter_title` text,
	`chapter_order` integer NOT NULL,
	`memo` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`user_book_id`) REFERENCES `user_books_table`(`user_book_id`)
);
--> statement-breakpoint
INSERT INTO `__new_book_chapter_memos_table`(
	`chapter_memo_id`,
	`user_book_id`,
	`chapter_title`,
	`chapter_order`,
	`memo`,
	`created_at`,
	`updated_at`
)
SELECT
	`chapter_memo_id`,
	`user_book_id`,
	`chapter_title`,
	`chapter_order`,
	`memo`,
	`created_at`,
	`updated_at`
FROM `book_chapter_memos_table`;
--> statement-breakpoint
DROP TABLE `book_chapter_memos_table`;
--> statement-breakpoint
ALTER TABLE `__new_book_chapter_memos_table` RENAME TO `book_chapter_memos_table`;
