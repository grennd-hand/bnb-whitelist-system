# BNB链Web3.0白名单验证系统启动指南

本指南将帮助您启动BNB链Web3.0白名单验证系统的前端和后端服务。

## 前置条件

1. 安装Node.js (推荐v16.0.0或更高版本)
2. 安装MySQL数据库 (v8.0或更高版本)
3. 安装MetaMask或其他兼容BNB链的钱包扩展

## 数据库设置

1. 创建MySQL数据库:

```sql
CREATE DATABASE whitelist_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. 确保您的MySQL用户有权限访问该数据库。

## 配置环境变量

1. 后端环境变量 (backend/.env):
   - 检查数据库连接信息是否正确
   - 确认端口设置 (默认3000)

2. 前端环境变量 (frontend/.env):
   - 确认API URL设置 (默认http://localhost:3000/api)

## 启动系统

### 方法一：使用启动脚本

Windows系统:
```
start.bat
```

Linux/Mac系统:
```
chmod +x start.sh
./start.sh
```

### 方法二：手动启动

1. 启动后端服务:

```bash
cd backend
npm install
npm run dev
```

2. 生成白名单代码 (首次运行时):

```bash
cd backend
npm run generate-codes
```

3. 启动前端服务:

```bash
cd frontend
npm install
npm run dev
```

## 访问系统

- 前端界面: http://localhost:5173
- 后端API: http://localhost:3000

## 钱包设置

1. 确保您的MetaMask已添加BNB Smart Chain网络:
   - 网络名称: BNB Smart Chain
   - RPC URL: https://bsc-dataseed.binance.org/
   - 链ID: 56
   - 符号: BNB
   - 区块浏览器: https://bscscan.com/

2. 如果您使用测试网:
   - 网络名称: BNB Smart Chain Testnet
   - RPC URL: https://data-seed-prebsc-1-s1.binance.org:8545/
   - 链ID: 97
   - 符号: tBNB
   - 区块浏览器: https://testnet.bscscan.com/

## 常见问题

1. 如果遇到数据库连接问题:
   - 检查MySQL服务是否运行
   - 验证数据库凭据是否正确
   - 确认数据库whitelist_db是否存在

2. 如果前端无法连接到后端:
   - 确认后端服务是否正常运行
   - 检查CORS设置是否正确
   - 验证API URL配置是否正确

3. 如果钱包连接失败:
   - 确认MetaMask扩展是否安装
   - 检查是否已登录MetaMask
   - 验证是否已切换到正确的网络

## 支持

如有任何问题，请联系系统管理员或查阅项目文档。