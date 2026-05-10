CREATE TABLE `users_table` (
	`user_id` text PRIMARY KEY NOT NULL,
	`user_name` text NOT NULL,
	`profile` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_user_name_unique` ON `users_table` (`user_name`);