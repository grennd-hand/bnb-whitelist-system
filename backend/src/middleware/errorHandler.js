/**
 * 全局错误处理中间件
 */
const errorHandler = (err, req, res, next) => {
  console.error('错误:', err.stack);
  
  // 根据错误类型返回不同的响应
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: err.message || '验证错误'
    });
  }
  
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      message: '未授权访问'
    });
  }
  
  // 默认服务器错误
  return res.status(500).json({
    success: false,
    message: '服务器内部错误'
  });
};

module.exports = errorHandler;