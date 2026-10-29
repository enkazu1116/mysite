ALTER TABLE `projects_table` ADD COLUMN `is_highlighted` integer DEFAULT false NOT NULL;
--> statement-breakpoint
ALTER TABLE `projects_table` ADD COLUMN `start_date` text;
--> statement-breakpoint
ALTER TABLE `projects_table` ADD COLUMN `end_date` text;
