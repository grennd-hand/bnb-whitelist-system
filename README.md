# BNB链Web3.0白名单验证系统

基于BNB链的Web3.0白名单系统，无需智能合约。系统实现了钱包连接、白名单代码验证、状态显示等功能，并采用赛博朋克风格UI设计。

## 功能特点

- 在MySQL数据库中预生成5000个唯一白名单代码
- 用户通过网站连接钱包后输入白名单代码进行验证
- 验证成功后：
  - 将钱包地址存入数据库对应记录
  - 标记该白名单代码为已使用
  - 记录该钱包已使用过白名单
- 验证规则：
  - 每个白名单代码仅限使用一次
  - 每个钱包地址仅限验证一个白名单
- 用户再次连接时，界面显示"已验证白名单"状态
- 整体UI采用赛博朋克风格设计

## 技术栈

### 前端
- React + TypeScript
- Vite 构建工具
- Tailwind CSS 样式框架
- shadcn/ui 组件库
- ethers.js Web3交互库

### 后端
- Node.js + Express.js
- MySQL 数据库
- Sequelize ORM
- Winston 日志系统

## 项目结构

```
bnb-whitelist-system/
├── frontend/                # 前端代码
│   ├── src/
│   │   ├── components/      # UI组件
│   │   ├── contexts/        # React上下文
│   │   ├── lib/             # 工具函数和API
│   │   ├── App.tsx          # 主应用组件
│   │   └── main.tsx         # 入口文件
│   ├── public/              # 静态资源
│   ├── index.html           # HTML模板
│   └── package.json         # 依赖配置
│
└── backend/                 # 后端代码
    ├── src/
    │   ├── config/          # 配置文件
    │   ├── controllers/     # 控制器
    │   ├── middleware/      # 中间件
    │   ├── models/          # 数据模型
    │   ├── routes/          # 路由
    │   ├── scripts/         # 脚本
    │   ├── utils/           # 工具函数
    │   ├── app.js           # Express应用
    │   └── server.js        # 服务器入口
    ├── logs/                # 日志文件
    └── package.json         # 依赖配置
```

## 安装与运行

### 前端

```bash
# 进入前端目录
cd bnb-whitelist-system/frontend

# 安装依赖
npm install

# 开发模式运行
npm run dev

# 构建生产版本
npm run build
```

### 后端

```bash
# 进入后端目录
cd bnb-whitelist-system/backend

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑.env文件，设置数据库连接信息

# 初始化数据库和生成白名单代码
npm run init-db

# 开发模式运行
npm run dev

# 生产模式运行
npm start
```

## 环境变量配置

### 前端 (.env)

```
VITE_API_URL=http://localhost:3000/api
```

### 后端 (.env)

```
PORT=3000
NODE_ENV=development

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=whitelist_db
DB_USER=root
DB_PASSWORD=your_password

# CORS配置
CORS_ORIGIN=http://localhost:5173
```

## 安全机制

系统实现了多层安全机制：

1. API请求限制：防止API滥用
2. 钱包地址验证：确保地址格式正确
3. 白名单代码验证：防止无效代码提交
4. 防重复验证：每个钱包和代码只能使用一次
5. 错误日志记录：记录可疑操作
6. 安全HTTP头：使用helmet增强API安全性

## 许可证

MIT