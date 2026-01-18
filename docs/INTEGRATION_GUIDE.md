# 前后端联调配置指南

本文档记录了 Happy Billing 前端与后端项目的联调配置过程和注意事项。

## 1. 环境配置

### 后端服务
- **项目位置**: `/Users/bobbowu/Happy/happy-billing`
- **API 地址**: `http://localhost:8080`
- **健康检查**: `http://localhost:8080/health`
- **API 版本**: v1 (`/api/v1`)

### 前端服务
- **项目位置**: `/Users/bobbowu/Happy/happy-billing-frontend`
- **开发服务器**: `http://localhost:5174` (默认 5173，如占用则自动切换)
- **API 基础 URL**: 通过环境变量配置

## 2. 配置文件

### 2.1 环境变量配置

**文件**: `.env.development`

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_APP_TITLE=Happy Billing (Dev)
```

### 2.2 Vite 代理配置

**文件**: `vite.config.ts`

```typescript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
    },
  },
}
```

**说明**: 虽然后端已经配置了 CORS，但代理配置可以避免某些浏览器的跨域限制。

### 2.3 Axios 请求配置

**文件**: `src/api/request.ts`

- 自动从环境变量读取 `VITE_API_BASE_URL`
- 请求拦截器自动添加认证 token 和租户 ID
- 响应拦截器统一处理错误和成功响应

## 3. API 路径对照

### 3.1 已验证可用的 API

| 模块 | 前端路径 | 后端路径 | 状态 |
|------|---------|---------|------|
| 租户列表 | `/api/v1/tenants` | `/api/v1/tenants` | ✅ |
| 租户详情 | `/api/v1/tenants/:id` | `/api/v1/tenants/:tenant_id` | ✅ |
| 订单列表 | `/api/v1/orders` | `/api/v1/orders` | ✅ |
| 订单详情 | `/api/v1/orders/:id` | `/api/v1/orders/:order_id` | ✅ |
| 取消订单 | `POST /api/v1/orders/:id/cancel` | `POST /api/v1/orders/:order_id/cancel` | ✅ |
| 账户余额 | `/api/v1/tenants/:id/balance` | `/api/v1/tenants/:tenant_id/balance` | ✅ |
| 充值 | `POST /api/v1/tenants/:id/balance/recharge` | `POST /api/v1/tenants/:tenant_id/balance/recharge` | ✅ |
| 汇率列表 | `/api/v1/exchange-rates` | `/api/v1/exchange-rates` | ✅ |
| 汇率查询 | `/api/v1/exchange-rates/query` | `/api/v1/exchange-rates/query` | ✅ |
| 货币转换 | `POST /api/v1/currency/convert` | `POST /api/v1/currency/convert` | ✅ |
| 支付记录 | `/api/v1/payments` | `/api/v1/payments` | ✅ |
| 创建支付 | `POST /api/v1/payments` | `POST /api/v1/payments` | ✅ |

### 3.2 需要注意的 API 差异

#### ⚠️ 支付订单功能
- **前端原设计**: `POST /api/v1/orders/:order_id/pay`
- **后端实际**: 无此端点
- **解决方案**: 通过 `POST /api/v1/payments` 创建支付记录实现
- **已修复**: `src/api/modules/order.ts` 中的 `payOrder` 方法

#### ⚠️ 余额变动记录
- **前端调用**: `GET /api/v1/tenants/:tenant_id/balance/transactions`
- **后端状态**: 路由中未定义
- **标记**: 已在代码中添加 TODO 注释，等待后端实现

## 4. 数据结构对接

### 4.1 统一响应格式

后端使用统一的响应格式：

```json
{
  "code": 0,
  "message": "success",
  "data": {
    // 实际数据
  }
}
```

前端响应拦截器已处理此格式，直接返回 `data` 字段。

### 4.2 分页数据格式

**后端返回** (以租户列表为例):
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "list": [...],
    "page": 1,
    "page_size": 10,
    "total": 2
  }
}
```

**后端返回** (以订单列表为例):
```json
{
  "code": 0,
  "message": "success",
  "data": {
    "data": [...],
    "page": 1,
    "page_size": 10,
    "total": 4
  }
}
```

**注意**: 不同模块的数据列表字段名不统一（`list` vs `data`），前端需要兼容处理。

### 4.3 状态字段

- **租户状态**: `status: 0 | 1` (0=禁用, 1=启用)
- **订单状态**: `status: 'PENDING' | 'PAID' | 'CANCELLED'`
- **支付状态**: `status: 'PENDING' | 'SUCCESS' | 'FAILED'`

## 5. 已更新的页面

### 5.1 使用真实 API 的页面

- ✅ **租户列表** (`src/views/tenant/List.vue`) - 已连接后端 API

### 5.2 仍使用 Mock 数据的页面

以下页面需要根据实际需求逐步切换到真实 API：

- 📋 **订单创建** (`src/views/order/Create.vue`)
- 📋 **订单列表** (`src/views/order/List.vue`)
- 📋 **订单详情** (`src/views/order/Detail.vue`)
- 📋 **支付页面** (`src/views/payment/Pay.vue`)
- 📋 **余额管理** (`src/views/payment/Balance.vue`)
- 📋 **支付记录** (`src/views/payment/List.vue`)
- 📋 **汇率管理** (`src/views/currency/ExchangeRates.vue`)
- 📋 **货币转换** (`src/views/currency/Converter.vue`)
- 📋 **仪表盘** (`src/views/dashboard/index.vue`)

**说明**: 这些页面的 API 方法已经正确配置，只需将 `loadXXXList` 等方法中的 mock 数据替换为真实 API 调用即可。

## 6. 启动流程

### 6.1 启动后端服务

```bash
cd /Users/bobbowu/Happy/happy-billing

# 方式一：使用 Docker Compose（推荐）
docker-compose up -d
go run cmd/api/main.go

# 方式二：直接运行
go run cmd/api/main.go

# 验证服务
curl http://localhost:8080/health
```

### 6.2 启动前端服务

```bash
cd /Users/bobbowu/Happy/happy-billing-frontend

# 安装依赖（首次运行）
npm install

# 启动开发服务器
npm run dev

# 访问地址
# http://localhost:5174
```

### 6.3 验证联调

1. **健康检查**:
   ```bash
   curl http://localhost:8080/health
   ```

2. **测试 API**:
   ```bash
   curl "http://localhost:8080/api/v1/tenants?page=1&page_size=10"
   ```

3. **浏览器访问**: 打开 `http://localhost:5174` 并测试租户列表页面

## 7. 常见问题

### 7.1 端口占用

**问题**: 前端默认端口 5173 被占用

**解决**: Vite 会自动切换到下一个可用端口（如 5174），查看终端输出确认实际端口

### 7.2 CORS 错误

**问题**: 浏览器提示跨域错误

**解决**:
- 后端已配置 CORS 中间件（`router/router.go:corsMiddleware`）
- 前端已配置 Vite 代理
- 如仍有问题，检查后端服务是否正常运行

### 7.3 API 404 错误

**问题**: 调用 API 返回 404

**解决**:
1. 检查后端路由是否已定义（参考 `internal/api/router/router.go`）
2. 确认前端 API 路径与后端匹配
3. 查看本文档第 3 节的 API 路径对照表

### 7.4 认证错误

**问题**: API 返回 401 未授权

**解决**:
- 当前后端尚未启用强制认证
- 如后续启用认证，需要在 `localStorage` 中设置 `token`
- axios 请求拦截器会自动添加 `Authorization` 头

## 8. 后续工作

### 8.1 待完成的功能

- [ ] 将所有页面的 mock 数据替换为真实 API 调用
- [ ] 实现用户登录和认证流程
- [ ] 添加错误边界和全局错误处理
- [ ] 实现数据缓存和状态管理优化

### 8.2 待后端实现的 API

- [ ] `GET /api/v1/tenants/:tenant_id/balance/transactions` - 余额变动记录
- [ ] 其他需要补充的端点（根据实际需求）

### 8.3 优化建议

1. **统一分页响应格式**: 建议后端统一使用 `data` 或 `list` 作为列表字段名
2. **错误码规范**: 建立统一的错误码体系
3. **接口文档**: 使用 Swagger 生成 API 文档
4. **E2E 测试**: 添加前后端集成测试

## 9. 技术支持

- **后端项目**: `/Users/bobbowu/Happy/happy-billing`
- **前端项目**: `/Users/bobbowu/Happy/happy-billing-frontend`
- **后端文档**: [happy-billing/docs/](../happy-billing/docs/)
- **前端文档**: [docs/](.)

---

**最后更新**: 2026-01-18
**状态**: ✅ 基础联调配置完成，可正常开发和测试
