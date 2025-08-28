/**
 * 清空数据库脚本
 * 删除WhitelistCodes表中的所有数据
 */

const mysql = require('mysql2/promise');
require('dotenv').config();

// 数据库配置
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '20050615',
  database: process.env.DB_NAME || 'whitelist_db',
  charset: 'utf8mb4'
};

/**
 * 清空WhitelistCodes表中的所有数据
 */
async function clearDatabase() {
  let connection;
  
  try {
    // 连接数据库
    connection = await mysql.createConnection(dbConfig);
    console.log('数据库连接成功！');
    
    // 查询当前数据数量
    const [countResult] = await connection.execute(
      'SELECT COUNT(*) as count FROM WhitelistCodes'
    );
    const currentCount = countResult[0].count;
    console.log(`当前数据库中有 ${currentCount} 条白名单代码`);
    
    if (currentCount === 0) {
      console.log('数据库已经是空的，无需清空。');
      return;
    }
    
    // 清空表数据
    await connection.execute('DELETE FROM WhitelistCodes');
    console.log('正在清空WhitelistCodes表...');
    
    // 重置自增ID
    await connection.execute('ALTER TABLE WhitelistCodes AUTO_INCREMENT = 1');
    console.log('已重置自增ID');
    
    // 验证清空结果
    const [verifyResult] = await connection.execute(
      'SELECT COUNT(*) as count FROM WhitelistCodes'
    );
    const finalCount = verifyResult[0].count;
    
    if (finalCount === 0) {
      console.log('✅ 数据库清空成功！所有白名单代码已被删除。');
    } else {
      console.log(`❌ 清空失败，仍有 ${finalCount} 条数据`);
    }
    
  } catch (error) {
    console.error('清空数据库时发生错误:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
      console.log('数据库连接已关闭');
    }
  }
}

// 执行清空操作
clearDatabase();