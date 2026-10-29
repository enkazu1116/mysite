ALTER TABLE `book_outputs_table` ADD `chapter_title` text;--> statement-breakpoint
ALTER TABLE `book_outputs_table` ADD `chapter_order` integer DEFAULT 0 NOT NULL;
