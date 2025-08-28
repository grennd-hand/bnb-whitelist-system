/**
 * 生成随机白名单代码
 * @param {number} length 代码长度
 * @returns {string} 生成的白名单代码
 */
const generateRandomCode = (length = 10) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

/**
 * 批量生成唯一的白名单代码
 * @param {number} count 需要生成的代码数量
 * @param {number} length 每个代码的长度
 * @returns {Set<string>} 生成的唯一白名单代码集合
 */
const generateUniqueCodes = (count, length = 10) => {
  const codes = new Set();
  
  while (codes.size < count) {
    codes.add(generateRandomCode(length));
  }
  
  return codes;
};

module.exports = {
  generateRandomCode,
  generateUniqueCodes
};