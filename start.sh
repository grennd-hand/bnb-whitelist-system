#!/bin/bash
echo "正在启动BNB链Web3.0白名单验证系统..."

echo "1. 启动后端服务..."
gnome-terminal -- bash -c "cd backend && npm install && npm run dev; exec bash"

echo "2. 启动前端服务..."
gnome-terminal -- bash -c "cd frontend && npm install && npm run dev; exec bash"

echo "系统启动中，请稍候..."
echo "前端地址: http://localhost:5173"
echo "后端地址: http://localhost:3000"