-- Create database
CREATE DATABASE IF NOT EXISTS auth_db;
USE auth_db;

-- Create Users table
CREATE TABLE IF NOT EXISTS Users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(30) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    balance DECIMAL(10, 2) DEFAULT 0.00,
    stripeCustomerId VARCHAR(255),
    isActive BOOLEAN DEFAULT true,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create RefreshTokens table
CREATE TABLE IF NOT EXISTS RefreshTokens (
    id INT AUTO_INCREMENT PRIMARY KEY,
    token VARCHAR(255) NOT NULL,
    userId INT NOT NULL,
    expiresAt DATETIME NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
);

-- Create ShippingPrices table
CREATE TABLE ShippingPrices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    minWeight DECIMAL(10, 2) NOT NULL,
    maxWeight DECIMAL(10, 2) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    isActive BOOLEAN DEFAULT true,
    description VARCHAR(255),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create ShippingOrders table
CREATE TABLE ShippingOrders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT NOT NULL,
    projectName VARCHAR(255),
    fileName VARCHAR(255) NOT NULL,
    totalOrders INT NOT NULL DEFAULT 0,
    totalCost DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    status ENUM('pending', 'processing', 'completed', 'rejected') DEFAULT 'pending',
    labelUrl VARCHAR(255),
    isTemporary BOOLEAN DEFAULT false,
    processedAt DATETIME,
    notes TEXT,
    fileStorageType ENUM('local', 'drive') NOT NULL DEFAULT 'local',
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id)
);

CREATE TABLE AuditLogs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    userId INT,
    username VARCHAR(30),
    action VARCHAR(50) NOT NULL,
    details TEXT,
    ipAddress VARCHAR(45),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES Users(id)
);

-- Create indexes
CREATE INDEX idx_users_email ON Users(email);
CREATE INDEX idx_users_username ON Users(username);
CREATE INDEX idx_refresh_tokens_token ON RefreshTokens(token);
CREATE INDEX idx_refresh_tokens_user_id ON RefreshTokens(userId);

-- Insert default admin user (password: admin123)
INSERT INTO Users (username, email, password, role) VALUES 
('admin', 'admin@example.com', '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iq.1ZxQKzqK2', 'admin')
ON DUPLICATE KEY UPDATE id=id;