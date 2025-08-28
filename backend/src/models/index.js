const { Sequelize } = require('sequelize');
const config = require('../config/database');

// 创建Sequelize实例
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    port: config.port,
    logging: config.logging,
    pool: config.pool
  }
);

// 初始化模型
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

// 导入模型
db.WhitelistCode = require('./whitelistCode')(sequelize);

// 设置模型关联（如果有的话）

module.exports = db;