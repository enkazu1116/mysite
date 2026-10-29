ALTER TABLE `projects_table` RENAME COLUMN `overview` TO `description`;
--> statement-breakpoint
ALTER TABLE `projects_table` ADD COLUMN `project_scale` text NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE `projects_table` ADD COLUMN `reflection` text NOT NULL DEFAULT '';
--> statement-breakpoint
ALTER TABLE `user_books_table` DROP COLUMN `note`;
--> statement-breakpoint
DROP TABLE `book_chapter_memos_table`;
--> statement-breakpoint
DROP TABLE `book_outputs_table`;
