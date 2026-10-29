CREATE TABLE `users_table` (
	`user_id` text PRIMARY KEY NOT NULL,
	`user_name` text NOT NULL,
	`bio` text,
	`icon_url` text,
	`github_url` text,
	`article_url` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_table_user_name_unique` ON `users_table` (`user_name`);
--> statement-breakpoint
CREATE TABLE `techs_table` (
	`tech_id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`category` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `skills_table` (
	`skill_id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`language` text NOT NULL,
	`experience_months` integer NOT NULL,
	`level` integer NOT NULL,
	`detail` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users_table`(`user_id`)
);
--> statement-breakpoint
CREATE TABLE `skill_techs_table` (
	`skill_tech_id` text PRIMARY KEY NOT NULL,
	`skill_id` text NOT NULL,
	`tech_id` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`skill_id`) REFERENCES `skills_table`(`skill_id`),
	FOREIGN KEY (`tech_id`) REFERENCES `techs_table`(`tech_id`)
);
--> statement-breakpoint
CREATE TABLE `books_table` (
	`book_id` text PRIMARY KEY NOT NULL,
	`source` text NOT NULL,
	`source_book_id` text NOT NULL,
	`title` text NOT NULL,
	`authors_json` text NOT NULL,
	`publisher` text,
	`published_date` text,
	`description` text,
	`page_count` integer,
	`thumbnail_url` text,
	`info_link` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `books_source_source_book_id_idx` ON `books_table` (`source`,`source_book_id`);
--> statement-breakpoint
CREATE TABLE `user_books_table` (
	`user_book_id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`book_id` text NOT NULL,
	`status` text NOT NULL,
	`current_page` integer,
	`started_at` text,
	`finished_at` text,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users_table`(`user_id`),
	FOREIGN KEY (`book_id`) REFERENCES `books_table`(`book_id`)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `user_books_user_id_book_id_idx` ON `user_books_table` (`user_id`,`book_id`);
--> statement-breakpoint
CREATE TABLE `projects_table` (
	`project_id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`project_name` text NOT NULL,
	`is_highlighted` integer DEFAULT 0 NOT NULL,
	`start_date` text,
	`end_date` text,
	`description` text NOT NULL,
	`my_role` text NOT NULL,
	`team_size` integer NOT NULL,
	`technologies` text NOT NULL,
	`project_scale` text NOT NULL,
	`challenges` text NOT NULL,
	`decisions` text NOT NULL,
	`outcomes` text NOT NULL,
	`reflection` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users_table`(`user_id`)
);
