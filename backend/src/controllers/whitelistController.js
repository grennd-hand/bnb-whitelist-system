const WhitelistCode = require('../models/whitelistCode');
const { createLogger } = require('../utils/logger');

const logger = createLogger('whitelistController');

/**
 * 验证白名单代码
 */
exports.verifyCode = async (req, res) => {
  try {
    const { code, walletAddress } = req.body;

    // 检查钱包是否已经验证过白名单
    const existingVerification = await WhitelistCode.findOne({
      where: { walletAddress }
    });

    if (existingVerification) {
      return res.status(400).json({
        success: false,
        message: '该钱包地址已经验证过白名单'
      });
    }

    // 查找白名单代码
    const whitelistCode = await WhitelistCode.findOne({
      where: { code }
    });

    if (!whitelistCode) {
      logger.warn(`无效的白名单代码尝试: ${code}, 钱包: ${walletAddress}`);
      return res.status(404).json({
        success: false,
        message: '无效的白名单代码'
      });
    }

    // 检查代码是否已被使用
    if (whitelistCode.isUsed) {
      logger.warn(`尝试使用已使用的白名单代码: ${code}, 钱包: ${walletAddress}`);
      return res.status(400).json({
        success: false,
        message: '该白名单代码已被使用'
      });
    }

    // 更新白名单代码状态
    whitelistCode.isUsed = true;
    whitelistCode.walletAddress = walletAddress;
    whitelistCode.usedAt = new Date();
    
    await whitelistCode.save();
    
    logger.info(`白名单验证成功: ${code}, 钱包: ${walletAddress}`);
    
    return res.status(200).json({
      success: true,
      message: '白名单验证成功'
    });
  } catch (error) {
    logger.error(`验证白名单代码时出错: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};

/**
 * 检查钱包状态
 */
exports.checkWalletStatus = async (req, res) => {
  try {
    const { walletAddress } = req.params;

    // 查找钱包是否已验证
    const verification = await WhitelistCode.findOne({
      where: { walletAddress }
    });

    return res.status(200).json({
      success: true,
      isVerified: !!verification,
      verificationDate: verification ? verification.usedAt : null
    });
  } catch (error) {
    logger.error(`检查钱包状态时出错: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: '服务器内部错误'
    });
  }
};