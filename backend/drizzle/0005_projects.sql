CREATE TABLE `projects_table` (
	`project_id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`project_name` text NOT NULL,
	`overview` text NOT NULL,
	`my_role` text NOT NULL,
	`team_size` integer NOT NULL,
	`technologies` text NOT NULL,
	`challenges` text NOT NULL,
	`decisions` text NOT NULL,
	`outcomes` text NOT NULL,
	`created_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	`updated_at` text DEFAULT (CURRENT_TIMESTAMP) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `users_table`(`user_id`)
);
