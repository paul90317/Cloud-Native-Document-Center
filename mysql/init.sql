-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS doc_center;

-- Switch to the created database
USE doc_center;

CREATE TABLE `users` (
  `account` varchar(255) PRIMARY KEY NOT NULL,
  `passwd` varchar(255) NOT NULL,
  `manager` bool NOT NULL DEFAULT false,
  `email` varchar(255) UNIQUE,
  `name` varchar(255),
  `phone` varchar(255),
  `profile` text
);

CREATE TABLE `documents` (
  `id` int PRIMARY KEY NOT NULL,
  `name` varchar(255) NOT NULL,
  `creator` varchar(255) NOT NULL,
  `reviewer` varchar(255) NOT NULL,
  `status` int NOT NULL DEFAULT 0,
  `message` text
);

CREATE TABLE `roles` (
  `document` int NOT NULL,
  `user` varchar(255) NOT NULL,
  `role` int NOT NULL,
  PRIMARY KEY (`document`, `user`)
);

CREATE TABLE `logs` (
  `id` int PRIMARY KEY AUTO_INCREMENT,
  `document` int NOT NULL,
  `user` varchar(255) NOT NULL,
  `type` int NOT NULL,
  `message` text,
  `time` timestamp
);

ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE roles CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE documents CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE logs CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `roles` ADD FOREIGN KEY (`document`) REFERENCES `documents` (`id`);
ALTER TABLE `roles` ADD FOREIGN KEY (`user`) REFERENCES `users` (`account`);
ALTER TABLE `logs` ADD FOREIGN KEY (`document`) REFERENCES `documents` (`id`);
ALTER TABLE `logs` ADD FOREIGN KEY (`user`) REFERENCES `users` (`account`);
ALTER TABLE `documents` ADD FOREIGN KEY (`creator`) REFERENCES `users` (`account`);
ALTER TABLE `documents` ADD FOREIGN KEY (`reviewer`) REFERENCES `users` (`account`);
