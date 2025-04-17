-- Bảng Users
CREATE TABLE `Users` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL UNIQUE,
  `email` VARCHAR(255) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `balance` DECIMAL(10,2) DEFAULT 0.00,
  `stripeCustomerId` VARCHAR(255),
  `role` ENUM('user', 'admin') DEFAULT 'user',
  `isActive` BOOLEAN DEFAULT true,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL
);

-- Bảng RefreshTokens
CREATE TABLE `RefreshTokens` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `token` VARCHAR(255) NOT NULL,
  `userId` INTEGER NOT NULL,
  `expiresAt` DATETIME NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  FOREIGN KEY (`userId`) REFERENCES `Users`(`id`)
);

-- Bảng Settings
CREATE TABLE `settings` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `setting_name` VARCHAR(255) NOT NULL,
  `setting_key` VARCHAR(255) NOT NULL UNIQUE,
  `setting_value` TEXT,
  `uuid` VARCHAR(255),
  `setting_type` VARCHAR(255) NOT NULL,
  `isActive` BOOLEAN DEFAULT true,
  `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Bảng ShippingOrders
CREATE TABLE `ShippingOrders` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `userId` INTEGER NOT NULL,
  `projectName` VARCHAR(255),
  `fileName` VARCHAR(255) NOT NULL,
  `labelUrl` VARCHAR(255),
  `totalOrders` INTEGER NOT NULL DEFAULT 0,
  `totalCost` DECIMAL(10,2) NOT NULL DEFAULT 0,
  `fileStorageType` ENUM('local', 'drive') NOT NULL DEFAULT 'local',
  `status` ENUM('pending', 'processing', 'completed', 'rejected') DEFAULT 'pending',
  `isTemporary` BOOLEAN DEFAULT false,
  `processedAt` DATETIME,
  `notes` TEXT,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  FOREIGN KEY (`userId`) REFERENCES `Users`(`id`)
);

-- Bảng ShippingPrices
CREATE TABLE `ShippingPrices` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `minWeight` DECIMAL(10,2) NOT NULL,
  `maxWeight` DECIMAL(10,2) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `isActive` BOOLEAN DEFAULT true,
  `description` VARCHAR(255),
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL
);

-- Bảng Transactions
CREATE TABLE `Transactions` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `userId` INTEGER NOT NULL,
  `shippingOrderId` INTEGER,
  `amount` DECIMAL(10,2) NOT NULL,
  `type` ENUM('debit', 'credit') NOT NULL,
  `description` TEXT,
  `status` ENUM('pending', 'completed', 'failed') DEFAULT 'completed',
  `metadata` JSON,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL,
  FOREIGN KEY (`userId`) REFERENCES `Users`(`id`),
  FOREIGN KEY (`shippingOrderId`) REFERENCES `ShippingOrders`(`id`)
);

-- Bảng Notifications
CREATE TABLE `notifications` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `content` TEXT NOT NULL,
  `type` ENUM('info', 'warning', 'success', 'error') DEFAULT 'info',
  `isActive` BOOLEAN DEFAULT true,
  `createdBy` INTEGER NOT NULL,
  `updatedBy` INTEGER,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL
);

-- Bảng AuditLogs
CREATE TABLE `AuditLogs` (
  `id` INTEGER PRIMARY KEY AUTO_INCREMENT,
  `userId` INTEGER NOT NULL,
  `username` VARCHAR(255) NOT NULL,
  `action` VARCHAR(255) NOT NULL,
  `status` VARCHAR(255) NOT NULL,
  `details` TEXT,
  `ipAddress` VARCHAR(255) NOT NULL,
  `createdAt` DATETIME NOT NULL,
  `updatedAt` DATETIME NOT NULL
);
