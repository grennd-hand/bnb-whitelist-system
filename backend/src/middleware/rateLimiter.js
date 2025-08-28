const rateLimit = require('express-rate-limit');

// 创建API请求限制中间件
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 每个IP在windowMs内最多可以发送100个请求
  standardHeaders: true, // 返回标准的RateLimit头信息
  legacyHeaders: false, // 禁用X-RateLimit-*头信息
  message: {
    success: false,
    message: '请求过于频繁，请稍后再试'
  }
});

// 创建验证请求限制中间件（更严格）
const verifyLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1小时
  max: 10, // 每个IP在windowMs内最多可以发送10个验证请求
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: '验证请求过于频繁，请稍后再试'
  }
});

module.exports = {
  apiLimiter,
  verifyLimiter
};