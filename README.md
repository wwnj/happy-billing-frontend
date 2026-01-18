# Happy Billing Frontend

Happy Billing 企业级订单账单系统的前端应用，基于 Vue 3 + TypeScript + Element Plus 构建。

## ✨ 特性

- 🎯 **Vue 3 组合式 API** - 使用最新的 Vue 3 Composition API
- 🔷 **TypeScript** - 完整的类型支持
- 🎨 **Element Plus** - 美观的 UI 组件库
- 💰 **多币种支持** - CNY、USD、EUR、JPY、GBP、HKD
- 📊 **仪表盘** - 实时业务数据统计
- 📦 **订单管理** - 创建、查看、支付、取消订单
- 💳 **支付管理** - 余额支付、充值、支付记录
- 💱 **货币管理** - 汇率查询、货币转换
- 👥 **租户管理** - 多租户体系支持

## 🛠️ 技术栈

- **框架**: Vue 3.5+
- **语言**: TypeScript 5.3+
- **UI 库**: Element Plus 2.13+
- **构建工具**: Vite 5.0+
- **路由**: Vue Router 4.6+
- **状态管理**: Pinia 2.3+
- **HTTP 客户端**: Axios 1.13+
- **样式**: SCSS + UnoCSS
- **工具库**: Decimal.js (精确计算)

## 📋 前置条件

- Node.js 18+
- npm 9+ 或 pnpm 8+
- 后端 API 服务运行在 `http://localhost:8080`

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
# 方式一：使用启动脚本（推荐，会自动检查后端服务）
./scripts/dev.sh

# 方式二：直接启动
npm run dev
```

访问 [http://localhost:5173](http://localhost:5173) (如端口被占用，会自动切换到 5174 等)

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 📁 项目结构

```
happy-billing-frontend/
├── docs/                        # 项目文档
│   ├── frontend-quick-start.md # 快速开始指南
│   ├── frontend-tech-spec.md   # 技术规范
│   ├── frontend-api-reference.md # API 参考
│   └── INTEGRATION_GUIDE.md    # 前后端联调指南
├── public/                      # 静态资源
├── scripts/                     # 脚本文件
│   └── dev.sh                  # 开发环境启动脚本
├── src/
│   ├── api/                    # API 请求模块
│   │   ├── request.ts          # Axios 配置
│   │   └── modules/            # API 模块
│   ├── assets/                 # 资源文件
│   ├── components/             # 公共组件
│   │   ├── common/             # 通用组件
│   │   └── layout/             # 布局组件
│   ├── composables/            # 组合式函数
│   ├── router/                 # 路由配置
│   ├── stores/                 # Pinia 状态管理
│   ├── types/                  # TypeScript 类型定义
│   ├── utils/                  # 工具函数
│   ├── views/                  # 页面组件
│   │   ├── dashboard/          # 仪表盘
│   │   ├── order/              # 订单管理
│   │   ├── payment/            # 支付管理
│   │   ├── currency/           # 货币管理
│   │   └── tenant/             # 租户管理
│   ├── App.vue                 # 根组件
│   └── main.ts                 # 入口文件
├── .env.development            # 开发环境变量
├── .env.production             # 生产环境变量
├── index.html                  # HTML 模板
├── package.json                # 项目配置
├── tsconfig.json               # TypeScript 配置
├── vite.config.ts              # Vite 配置
└── README.md                   # 项目说明
```

## 🔗 与后端联调

本项目需要配合后端 API 服务使用。详细的联调配置请参考：

📖 **[前后端联调指南](docs/INTEGRATION_GUIDE.md)**

### 快速配置

1. **确保后端服务运行**:
   ```bash
   # 在后端项目目录
   cd /Users/bobbowu/Happy/happy-billing
   go run cmd/api/main.go
   ```

2. **验证后端服务**:
   ```bash
   curl http://localhost:8080/health
   ```

3. **配置环境变量**:

   文件 `.env.development` 已配置：
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   ```

4. **启动前端**:
   ```bash
   ./scripts/dev.sh
   ```

## 📚 文档

- [快速开始](docs/frontend-quick-start.md) - 项目初始化和基础配置
- [技术规范](docs/frontend-tech-spec.md) - 架构设计和技术选型
- [API 参考](docs/frontend-api-reference.md) - API 接口文档
- [联调指南](docs/INTEGRATION_GUIDE.md) - 前后端联调配置

## 🎨 核心功能模块

### 1. 仪表盘 (`/dashboard`)
- 业务数据统计卡片
- 账户余额显示
- 最近订单列表
- 快捷操作入口

### 2. 订单管理 (`/order`)
- **创建订单** - 选择产品、币种、数量创建订单
- **订单列表** - 查看、筛选、分页显示订单
- **订单详情** - 查看订单详细信息、支付、取消

### 3. 支付管理 (`/payment`)
- **支付订单** - 多种支付方式、余额检查、汇率转换
- **余额管理** - 账户余额、充值、交易记录
- **支付记录** - 支付历史、筛选、关联订单

### 4. 货币管理 (`/currency`)
- **汇率管理** - 当前汇率、历史汇率、汇率查询
- **货币转换** - 实时转换计算、常用币种对

### 5. 租户管理 (`/tenant`)
- **租户列表** - 查看租户信息、认证状态

## 🔧 配置说明

### 环境变量

- `VITE_API_BASE_URL` - 后端 API 基础 URL
- `VITE_APP_TITLE` - 应用标题

### Vite 配置

- **端口**: 默认 5173，可在 `vite.config.ts` 修改
- **代理**: 已配置 `/api` 代理到后端服务
- **别名**: `@` 指向 `src` 目录

### Axios 配置

- 自动添加认证 token
- 自动添加租户 ID 头
- 统一错误处理
- 响应数据转换

## 🧪 开发规范

### 组件开发

- 使用 Composition API
- 优先使用 TypeScript
- 遵循单一职责原则
- 提取可复用逻辑到 composables

### API 调用

- 所有 API 请求通过 `src/api/modules` 模块
- 使用 TypeScript 类型定义
- 统一错误处理

### 样式规范

- 使用 SCSS 模块化
- 优先使用 Element Plus 组件样式
- 响应式设计，支持移动端

## 🔍 故障排查

### 端口占用

如果默认端口 5173 被占用，Vite 会自动切换到下一个可用端口，查看终端输出确认。

### CORS 错误

后端已配置 CORS，如仍有问题：
1. 确认后端服务运行正常
2. 检查 Vite 代理配置
3. 查看浏览器控制台详细错误

### API 404

1. 检查后端路由是否已实现
2. 对照 [API 路径对照表](docs/INTEGRATION_GUIDE.md#31-已验证可用的-api)
3. 确认前端 API 路径正确

## 📝 待办事项

- [ ] 将所有页面 mock 数据替换为真实 API
- [ ] 实现用户登录认证
- [ ] 添加单元测试
- [ ] 添加 E2E 测试
- [ ] 性能优化（代码分割、懒加载）
- [ ] 添加国际化支持
- [ ] 完善错误边界处理

## 🤝 贡献指南

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'feat: add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

MIT License

## 🙏 致谢

- [Vue.js](https://vuejs.org/)
- [Element Plus](https://element-plus.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)

---

**Happy Coding! 🎉**
