import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证令牌等
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    // 处理错误响应
    if (error.response) {
      // 服务器返回了错误状态码
      return Promise.reject(error.response.data);
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      return Promise.reject({
        success: false,
        message: '服务器无响应，请检查网络连接',
      });
    } else {
      // 请求配置出错
      return Promise.reject({
        success: false,
        message: '请求配置错误',
      });
    }
  }
);

// 白名单API接口
export const whitelistApi = {
  // 验证白名单代码
  verifyCode: async (code: string, walletAddress: string) => {
    return api.post('/whitelist/verify', { code, walletAddress });
  },

  // 检查钱包状态
  checkWalletStatus: async (walletAddress: string) => {
    return api.get(`/whitelist/status/${walletAddress}`);
  },
};

export default api;