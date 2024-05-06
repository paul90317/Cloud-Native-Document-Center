-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS doc_center;

-- Switch to the created database
USE doc_center;

CREATE TABLE `users` (
  `account` varchar(255) PRIMARY KEY,
  `passwd` varchar(255),
  `name` varchar(255),
  `email` varchar(255),
  `phone` varchar(255),
  `profile` text,
  `manager` bool,
  `created_time` timestamp
);

CREATE TABLE `documents` (
  `id` varchar(255) PRIMARY KEY,
  `creator` varchar(255),
  `description` text,
  `title` varchar(255),
  `changed_time` timestamp,
  `created_time` timestamp
);

CREATE TABLE `user_role` (
  `document` varchar(255),
  `user` varchar(255),
  `role` integer,
  `status` integer,
  `created_time` timestamp,
  PRIMARY KEY (`document`, `user`)
);

CREATE TABLE `images` (
  `id` varchar(255) PRIMARY KEY,
  `document` varchar(255),
  `created_time` timestamp
);

CREATE TABLE `logs` (
  `id` integer PRIMARY KEY,
  `document` varchar(255),
  `user` varchar(255),
  `type` integer,
  `title` varchar(255),
  `message` text,
  `created_time` timestamp
);

ALTER TABLE `user_role` ADD FOREIGN KEY (`document`) REFERENCES `documents` (`id`);

ALTER TABLE `user_role` ADD FOREIGN KEY (`user`) REFERENCES `users` (`account`);

ALTER TABLE `images` ADD FOREIGN KEY (`document`) REFERENCES `documents` (`id`);

ALTER TABLE `logs` ADD FOREIGN KEY (`document`) REFERENCES `documents` (`id`);

ALTER TABLE `logs` ADD FOREIGN KEY (`user`) REFERENCES `users` (`account`);
