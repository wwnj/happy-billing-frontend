import type { Status } from '../global'
import type { Currency } from './currency'

export type TenantType = 'INDIVIDUAL' | 'ENTERPRISE'
export type VerifyType = 'INDIVIDUAL' | 'ENTERPRISE'
export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface Tenant {
  tenant_id: string
  tenant_code: string
  name: string
  tenant_type: TenantType
  preferred_currency: Currency
  verified: boolean
  verified_type?: VerifyType
  verified_at?: string
  status: Status
  created_at: string
  updated_at: string
}

export interface Organization {
  organization_id: string
  tenant_id: string
  parent_organization_id?: string
  org_code: string
  name: string
  org_type?: string
  level: number
  status: Status
  created_at: string
  updated_at: string
}

export interface Project {
  project_id: string
  tenant_id: string
  organization_id: string
  project_code: string
  name: string
  description?: string
  status: Status
  created_at: string
  updated_at: string
}

export interface User {
  user_id: string
  tenant_id: string
  is_primary: boolean
  username?: string
  real_name?: string
  email?: string
  phone?: string
  status: Status
  created_at: string
  updated_at: string
}
