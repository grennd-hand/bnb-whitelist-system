const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

/**
 * 生成简单易记的白名单代码
 * 格式：ABCD1234（4位字母+4位数字）
 * @param {number} count 生成数量
 * @returns {string[]} 白名单代码数组
 */
function generateSimpleCodes(count) {
  const codes = new Set();
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  
  while (codes.size < count) {
    // 生成4位字母
    let letterPart = '';
    for (let i = 0; i < 4; i++) {
      letterPart += letters[Math.floor(Math.random() * letters.length)];
    }
    
    // 生成4位数字
    let numberPart = '';
    for (let i = 0; i < 4; i++) {
      numberPart += Math.floor(Math.random() * 10);
    }
    
    const code = letterPart + numberPart;
    codes.add(code);
  }
  
  return Array.from(codes);
}

/**
 * 初始化数据库
 * 创建数据库和表结构
 */
async function initDatabase() {
  let connection;
  
  try {
    console.log('正在连接MySQL服务器...');
    
    // 连接到MySQL服务器（不指定数据库）
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '20050615'
    });
    
    console.log('MySQL连接成功');
    
    // 创建数据库
    const dbName = process.env.DB_NAME || 'whitelist_db';
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`数据库 ${dbName} 创建成功`);
    
    // 选择数据库
    await connection.query(`USE ${dbName}`);
    
    // 创建白名单代码表
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS WhitelistCodes (
        id INT AUTO_INCREMENT PRIMARY KEY,
        code VARCHAR(12) NOT NULL UNIQUE,
        isUsed BOOLEAN NOT NULL DEFAULT FALSE,
        walletAddress VARCHAR(42) NULL,
        usedAt DATETIME NULL,
        createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        
        INDEX idx_code (code),
        INDEX idx_wallet_address (walletAddress),
        INDEX idx_is_used (isUsed)
      )
    `;
    
    await connection.query(createTableSQL);
    console.log('WhitelistCodes表创建成功');
    
    // 检查是否已有数据
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM WhitelistCodes');
    const count = rows[0].count;
    
    // 如果已有数据，先清空
    if (count > 0) {
      console.log(`发现已存在 ${count} 条数据，正在清空...`);
      await connection.query('DELETE FROM WhitelistCodes');
      console.log('数据清空完成');
    }
    
    // 生成新的白名单代码
    console.log('开始生成5000个白名单代码...');
    
    // 生成5000个简单易记的白名单代码
    const codes = generateSimpleCodes(5000);
    
    // 分批插入数据（每批100条）
    const batchSize = 100;
    for (let i = 0; i < codes.length; i += batchSize) {
      const batch = codes.slice(i, i + batchSize);
      const values = batch.map(code => `('${code}')`).join(',');
      const insertSQL = `INSERT INTO WhitelistCodes (code) VALUES ${values}`;
      
      await connection.query(insertSQL);
      console.log(`已插入 ${Math.min(i + batchSize, codes.length)} / ${codes.length} 条白名单代码`);
    }
    
    console.log('5000个白名单代码生成完成！');
    
    console.log('数据库初始化完成！');
    
  } catch (error) {
    console.error('数据库初始化失败:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  initDatabase();
}

module.exports = initDatabase;