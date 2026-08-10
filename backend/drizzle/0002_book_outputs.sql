CREATE TABLE `book_chapter_memos_table` (
	`chapter_memo_id` text PRIMARY KEY NOT NULL,
	`user_book_id` text NOT NULL,
	`chapter_title` text NOT NULL,
	`chapter_order` integer NOT NULL,
	`memo` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`user_book_id`) REFERENCES `user_books_table`(`user_book_id`)
);
--> statement-breakpoint
CREATE TABLE `book_outputs_table` (
	`book_output_id` text PRIMARY KEY NOT NULL,
	`user_book_id` text NOT NULL,
	`title` text NOT NULL,
	`body` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`user_book_id`) REFERENCES `user_books_table`(`user_book_id`)
);
