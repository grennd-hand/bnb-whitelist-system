const winston = require('winston');
const path = require('path');
const fs = require('fs');

// 确保日志目录存在
const logDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

/**
 * 创建日志记录器
 * @param {string} module 模块名称
 * @returns {winston.Logger} 日志记录器实例
 */
const createLogger = (module) => {
  return winston.createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    format: winston.format.combine(
      winston.format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss'
      }),
      winston.format.errors({ stack: true }),
      winston.format.splat(),
      winston.format.json()
    ),
    defaultMeta: { service: 'whitelist-api', module },
    transports: [
      // 控制台输出
      new winston.transports.Console({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.printf(
            info => `${info.timestamp} ${info.level}: [${info.module}] ${info.message}`
          )
        )
      }),
      // 文件输出 - 错误日志
      new winston.transports.File({ 
        filename: path.join(logDir, 'error.log'), 
        level: 'error' 
      }),
      // 文件输出 - 所有日志
      new winston.transports.File({ 
        filename: path.join(logDir, 'combined.log') 
      }),
      // 文件输出 - 安全相关日志
      new winston.transports.File({ 
        filename: path.join(logDir, 'security.log'),
        level: 'warn'
      })
    ]
  });
};

module.exports = {
  createLogger
};