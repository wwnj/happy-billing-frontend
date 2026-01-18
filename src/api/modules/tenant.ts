import request from '@/api/request'
import type { PageResult } from '@/types/global'
import type { Tenant } from '@/types/api/tenant'

/**
 * 获取租户列表
 */
export const getTenantList = (params: any) => {
  return request.get<PageResult<Tenant>>('/api/v1/tenants', params)
}

/**
 * 获取租户详情
 */
export const getTenantDetail = (tenantId: string) => {
  return request.get<Tenant>(`/api/v1/tenants/${tenantId}`)
}

/**
 * 个人注册
 */
export const registerIndividual = (data: any) => {
  return request.post<any>('/api/v1/tenants/register/individual', data)
}

/**
 * 企业注册
 */
export const registerEnterprise = (data: any) => {
  return request.post<any>('/api/v1/tenants/register/enterprise', data)
}
