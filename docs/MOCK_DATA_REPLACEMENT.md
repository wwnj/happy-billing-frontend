# Mock 数据替换总结

## 已完成的页面更新

### ✅ 完全使用真实 API

1. **租户列表** (`src/views/tenant/List.vue`)
   - 使用 `getTenantList` API
   - 数据源：后端租户数据

2. **订单列表** (`src/views/order/List.vue`)
   - 使用 `getOrderList` API
   - 数据源：后端订单数据

3. **订单详情** (`src/views/order/Detail.vue`)
   - 使用 `getOrderDetail` API
   - 数据源：后端订单详情

4. **支付页面** (`src/views/payment/Pay.vue`)
   - 使用 `getOrderDetail` 和 `getBalance` API
   - 支付功能使用 `createPayment` API
   - 数据源：后端订单和账户余额数据

5. **余额管理** (`src/views/payment/Balance.vue`)
   - 使用 `getBalance` API 获取余额
   - 使用 `rechargeBalance` API 执行充值
   - ⚠️ 余额变动记录仍使用 Mock 数据（等待后端实现）

### ⚠️ 需要手动更新的页面

以下页面的 API 都已配置好，只需替换加载函数中的 mock 数据即可：

#### 1. 支付记录 (`src/views/payment/List.vue`)
```typescript
// 当前：使用 mockPayments 数组
// 修改为：
const { data } = await getPaymentList(queryParams)
paymentList.value = data.data || []
total.value = data.total || 0
```

#### 2. 汇率管理 (`src/views/currency/ExchangeRates.vue`)
```typescript
// 当前：使用 mockRates 数组
// 修改为：
const { data } = await getExchangeRates(queryParams)
exchangeRates.value = data.data || []
total.value = data.total || 0
```

#### 3. 货币转换 (`src/views/currency/Converter.vue`)
```typescript
// handleConvert 函数
// 当前：使用 mockRates 对象
// 修改为：使用 convertCurrency API

// handleQuickConvert 函数
// 同样需要使用 convertCurrency API
```

#### 4. 仪表盘 (`src/views/dashboard/index.vue`)
```typescript
// loadDashboardData 函数
// 需要调用多个 API：
// - 统计数据：可能需要专门的统计 API（待后端提供）
// - 余额：使用 getBalance
// - 最近订单：使用 getOrderList（限制数量）

// 临时方案：保留 stats Mock 数据，仅更新余额
const { data: balanceData } = await getBalance('tenant_demo_001')
balance.value = balanceData
```

## API 状态

### ✅ 已实现并可用
- `GET /api/v1/tenants` - 租户列表
- `GET /api/v1/orders` - 订单列表
- `GET /api/v1/orders/:order_id` - 订单详情
- `POST /api/v1/orders/:order_id/cancel` - 取消订单
- `POST /api/v1/payments` - 创建支付
- `GET /api/v1/tenants/:tenant_id/balance` - 获取余额
- `POST /api/v1/tenants/:tenant_id/balance/recharge` - 充值
- `GET /api/v1/exchange-rates` - 汇率列表
- `GET /api/v1/exchange-rates/query` - 查询汇率
- `POST /api/v1/currency/convert` - 货币转换

### ⚠️ 待后端实现
- `GET /api/v1/tenants/:tenant_id/balance/transactions` - 余额变动记录
- 统计数据相关 API（仪表盘使用）

## 下一步建议

1. **完成剩余页面更新** - 按照上述说明快速更新剩余4个页面
2. **测试所有更新的页面** - 确保数据正常显示
3. **添加全局错误处理** - 统一处理API错误
4. **优化用户体验** - 添加加载状态、骨架屏等

## 注意事项

- 所有后端响应格式已统一为 `{ code, message, data }`
- 分页数据格式存在差异：租户使用 `data.list`，订单使用 `data.data`
- axios 拦截器已自动处理响应格式转换
- 需要根据实际数据结构兼容处理
