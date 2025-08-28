const ethers = require('ethers');

/**
 * 验证钱包地址格式是否有效
 */
const validateWalletAddress = (req, res, next) => {
  const { walletAddress } = req.body;
  
  if (!walletAddress) {
    return res.status(400).json({
      success: false,
      message: '钱包地址不能为空'
    });
  }

  // 验证钱包地址格式
  try {
    const isValidAddress = ethers.isAddress(walletAddress);
    if (!isValidAddress) {
      return res.status(400).json({
        success: false,
        message: '无效的钱包地址格式'
      });
    }
    
    // 将地址转换为校验和格式（大小写混合）
    req.body.walletAddress = ethers.getAddress(walletAddress);
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: '无效的钱包地址'
    });
  }
};

module.exports = validateWalletAddress;