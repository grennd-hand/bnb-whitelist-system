require('dotenv').config();
const app = require('./app');
const db = require('./config/database');
const { createLogger } = require('./utils/logger');

const logger = createLogger('server');
const PORT = process.env.PORT || 3000;

// 测试数据库连接
db.authenticate()
  .then(() => {
    logger.info('数据库连接成功');
    
    // 同步数据库模型
    return db.sync();
  })
  .then(() => {
    logger.info('数据库模型同步成功');
    
    // 启动服务器
    app.listen(PORT, () => {
      logger.info(`服务器运行在端口 ${PORT}`);
    });
  })
  .catch(err => {
    logger.error(`数据库连接错误: ${err.message}`);
    process.exit(1);
  });

// 处理未捕获的异常
process.on('uncaughtException', (err) => {
  logger.error(`未捕获的异常: ${err.message}`, { stack: err.stack });
  process.exit(1);
});

// 处理未处理的Promise拒绝
process.on('unhandledRejection', (reason, promise) => {
  logger.error('未处理的Promise拒绝', { reason, promise });
});