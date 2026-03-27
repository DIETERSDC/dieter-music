CREATE TABLE `sales` (
	`id` int AUTO_INCREMENT NOT NULL,
	`trackId` int NOT NULL,
	`sellerId` int NOT NULL,
	`buyerId` int NOT NULL,
	`saleType` enum('buy','rent') NOT NULL,
	`amount` decimal(8,2) NOT NULL,
	`expiresAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `sales_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tracks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`prompt` text,
	`audioUrl` text,
	`audioKey` text,
	`duration` int,
	`bpm` int DEFAULT 128,
	`genre` varchar(100),
	`isPublished` boolean DEFAULT false,
	`isForSale` boolean DEFAULT false,
	`price` decimal(8,2),
	`rentalPrice` decimal(8,2),
	`plays` int DEFAULT 0,
	`downloads` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `tracks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`type` enum('deposit','withdrawal','sale','purchase') NOT NULL,
	`amount` decimal(10,2) NOT NULL,
	`description` text,
	`status` enum('pending','completed','failed') DEFAULT 'pending',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `transactions_id` PRIMARY KEY(`id`)
);
