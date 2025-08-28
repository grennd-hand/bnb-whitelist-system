const express = require('express');
const router = express.Router();
const whitelistController = require('../controllers/whitelistController');
const validateWalletAddress = require('../middleware/validateWallet');
const validateWhitelistCode = require('../middleware/validateCode');
const { verifyLimiter, apiLimiter } = require('../middleware/rateLimiter');

// 验证白名单代码 - 使用严格的速率限制和验证中间件
router.post(
  '/verify',
  verifyLimiter,
  validateWalletAddress,
  validateWhitelistCode,
  whitelistController.verifyCode
);

// 检查钱包状态 - 使用一般的API速率限制
router.get(
  '/status/:walletAddress',
  apiLimiter,
  whitelistController.checkWalletStatus
);

module.exports = router;