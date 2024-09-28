CREATE TABLE `reports` (
	`id` integer PRIMARY KEY NOT NULL,
	`title` text,
	`zone` text,
	`description` text,
	`photo` text,
	`video` text,
	`audio` text,
	`latitude` text,
	`longitude` text,
	`etat` text,
	`slug` text,
	`user_id` integer,
	`category_id` integer,
	`indicateur_id` integer,
	`taken_by` integer,
	`category_ids` text,
	`status` text DEFAULT 'pending'
);
