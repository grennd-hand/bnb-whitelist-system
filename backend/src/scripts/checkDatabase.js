const mysql = require('mysql2/promise');

async function checkDatabase() {
  try {
    // 连接数据库
    const connection = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '20050615',
      database: 'whitelist_db'
    });

    console.log('数据库连接成功！');

    // 查询总数量
    const [rows] = await connection.query('SELECT COUNT(*) as count FROM WhitelistCodes');
    console.log('白名单代码总数量:', rows[0].count);

    // 查询前10个示例
    const [samples] = await connection.query('SELECT code FROM WhitelistCodes LIMIT 10');
    console.log('\n前10个白名单代码示例:');
    samples.forEach((row, index) => {
      console.log(`${index + 1}. ${row.code}`);
    });

    // 关闭连接
    await connection.end();
    console.log('\n数据库检查完成！');

  } catch (error) {
    console.error('数据库检查失败:', error.message);
  }
}

checkDatabase();