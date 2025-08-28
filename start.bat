@echo off
echo 正在启动BNB链Web3.0白名单验证系统...

echo 1. 启动后端服务...
start cmd /k "cd backend && npm install && npm run dev"

echo 2. 启动前端服务...
start cmd /k "cd frontend && npm install && npm run dev"

echo 系统启动中，请稍候...
echo 前端地址: http://localhost:5173
echo 后端地址: http://localhost:3000

pause