#!/bin/bash

# Happy Billing Frontend 开发环境启动脚本

set -e

echo "🚀 Happy Billing Frontend - 开发环境启动"
echo "========================================="

# 检查后端服务
echo ""
echo "📡 检查后端 API 服务..."
if curl -s http://localhost:8080/health > /dev/null 2>&1; then
    echo "✅ 后端服务运行正常 (http://localhost:8080)"
else
    echo "❌ 后端服务未启动"
    echo ""
    echo "请先启动后端服务:"
    echo "  cd /Users/bobbowu/Happy/happy-billing"
    echo "  go run cmd/api/main.go"
    echo ""
    exit 1
fi

# 检查 node_modules
if [ ! -d "node_modules" ]; then
    echo ""
    echo "📦 安装依赖..."
    npm install
fi

# 启动前端服务
echo ""
echo "🎯 启动前端开发服务器..."
echo "========================================="
npm run dev
