-- 创建数据库
CREATE DATABASE IF NOT EXISTS whitelist_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE whitelist_db;

-- 创建白名单代码表
CREATE TABLE IF NOT EXISTS WhitelistCodes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(12) NOT NULL UNIQUE,
  isUsed BOOLEAN NOT NULL DEFAULT FALSE,
  walletAddress VARCHAR(42) NULL,
  usedAt DATETIME NULL,
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- 索引
  INDEX idx_code (code),
  INDEX idx_wallet_address (walletAddress),
  INDEX idx_is_used (isUsed),
  
  -- 约束
  CONSTRAINT chk_code_format CHECK (code REGEXP '^[A-Za-z0-9]{8,12}$'),
  CONSTRAINT chk_wallet_format CHECK (walletAddress IS NULL OR walletAddress REGEXP '^0x[a-fA-F0-9]{40}$')
);

-- 插入一些测试白名单代码
INSERT IGNORE INTO WhitelistCodes (code) VALUES 
('ABC12345'),
('DEF67890'),
('GHI11111'),
('JKL22222'),
('MNO33333');