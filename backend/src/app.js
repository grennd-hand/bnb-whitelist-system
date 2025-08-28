const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const { createLogger } = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const whitelistRoutes = require('./routes/whitelistRoutes');
const { apiLimiter } = require('./middleware/rateLimiter');

// 创建应用实例
const app = express();
const logger = createLogger('app');

// 安全相关中间件
app.use(helmet()); // 设置各种HTTP头以增加安全性
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // 在生产环境中应设置为前端域名
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 请求日志
app.use(morgan('combined', {
  stream: {
    write: (message) => logger.info(message.trim())
  }
}));

// 请求解析
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 全局API速率限制
app.use(apiLimiter);

// 路由
app.use('/api/whitelist', whitelistRoutes);

// 健康检查端点
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: '未找到请求的资源'
  });
});

// 错误处理中间件
app.use(errorHandler);

module.exports = app;