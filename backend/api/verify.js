const { WhitelistCode } = require('../src/models');
const logger = require('../src/utils/logger');

// 验证钱包地址格式
function isValidWalletAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// 验证白名单代码格式
function isValidWhitelistCode(code) {
  return /^[A-Z]{4}\d{4}$/.test(code);
}

module.exports = async (req, res) => {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: '方法不允许' });
  }

  try {
    const { walletAddress, whitelistCode } = req.body;

    // 验证输入
    if (!walletAddress || !whitelistCode) {
      return res.status(400).json({ error: '钱包地址和白名单代码不能为空' });
    }

    if (!isValidWalletAddress(walletAddress)) {
      return res.status(400).json({ error: '无效的钱包地址格式' });
    }

    if (!isValidWhitelistCode(whitelistCode)) {
      return res.status(400).json({ error: '无效的白名单代码格式' });
    }

    // 检查钱包是否已经验证过
    const existingWallet = await WhitelistCode.findOne({
      where: { walletAddress }
    });

    if (existingWallet) {
      return res.status(400).json({ error: '该钱包已经验证过白名单' });
    }

    // 查找白名单代码
    const codeRecord = await WhitelistCode.findOne({
      where: { code: whitelistCode }
    });

    if (!codeRecord) {
      logger.warn(`无效的白名单代码尝试: ${whitelistCode}`, {
        walletAddress,
        ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
      });
      return res.status(400).json({ error: '无效的白名单代码' });
    }

    if (codeRecord.isUsed) {
      return res.status(400).json({ error: '该白名单代码已被使用' });
    }

    // 更新记录
    await codeRecord.update({
      walletAddress,
      isUsed: true,
      usedAt: new Date()
    });

    logger.info(`白名单验证成功`, {
      walletAddress,
      whitelistCode,
      ip: req.headers['x-forwarded-for'] || req.connection.remoteAddress
    });

    res.json({
      success: true,
      message: '白名单验证成功',
      walletAddress,
      verifiedAt: new Date()
    });

  } catch (error) {
    logger.error('白名单验证错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};