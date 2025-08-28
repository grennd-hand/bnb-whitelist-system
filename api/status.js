const { WhitelistCode } = require('../src/models');
const logger = require('../src/utils/logger');

// 验证钱包地址格式
function isValidWalletAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

module.exports = async (req, res) => {
  // 设置CORS头
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: '方法不允许' });
  }

  try {
    const { walletAddress } = req.query;

    if (!walletAddress) {
      return res.status(400).json({ error: '钱包地址不能为空' });
    }

    if (!isValidWalletAddress(walletAddress)) {
      return res.status(400).json({ error: '无效的钱包地址格式' });
    }

    // 查找钱包状态
    const walletRecord = await WhitelistCode.findOne({
      where: { walletAddress },
      attributes: ['code', 'isUsed', 'usedAt']
    });

    if (walletRecord) {
      res.json({
        isVerified: true,
        whitelistCode: walletRecord.code,
        verifiedAt: walletRecord.usedAt
      });
    } else {
      res.json({
        isVerified: false
      });
    }

  } catch (error) {
    logger.error('状态检查错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
};