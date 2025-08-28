/**
 * 验证白名单代码格式是否有效
 */
const validateWhitelistCode = (req, res, next) => {
  const { code } = req.body;
  
  if (!code) {
    return res.status(400).json({
      success: false,
      message: '白名单代码不能为空'
    });
  }

  // 验证白名单代码格式（假设格式为：字母和数字组合，长度为8-12位）
  const codeRegex = /^[A-Za-z0-9]{8,12}$/;
  if (!codeRegex.test(code)) {
    return res.status(400).json({
      success: false,
      message: '无效的白名单代码格式'
    });
  }

  next();
};

module.exports = validateWhitelistCode;