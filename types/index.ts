export type Plan = 'trial' | 'starter' | 'professional' | 'enterprise'
export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid'
export type UserRole = 'admin' | 'auditor' | 'contributor' | 'viewer'
export type FrameworkType = 'SOC2' | 'ISO27001' | 'HIPAA' | 'GDPR' | 'PCI_DSS' | 'NIST'
export type ControlStatus = 'not_started' | 'in_progress' | 'implemented' | 'not_applicable'
export type EvidenceType = 'document' | 'screenshot' | 'link' | 'policy' | 'procedure' | 'test_result'
export type EvidenceStatus = 'draft' | 'submitted' | 'approved' | 'rejected'
export type RiskStatus = 'open' | 'mitigating' | 'accepted' | 'closed'
export type AuditType = 'internal' | 'external' | 'gap_analysis'
export type AuditStatus = 'planned' | 'in_progress' | 'completed' | 'archived'
export type FindingSeverity = 'critical' | 'high' | 'medium' | 'low' | 'informational'

export interface Organization {
  id: string
  name: string
  slug: string
  plan: Plan
  stripe_customer_id?: string
  stripe_subscription_id?: string
  subscription_status: SubscriptionStatus
  trial_ends_at: string
  max_users: number
  max_frameworks: number
  created_at: string
  updated_at: string
}

export interface Profile {
  id: string
  organization_id: string
  email: string
  full_name?: string
  avatar_url?: string
  role: UserRole
  is_active: boolean
  last_seen_at?: string
  created_at: string
  updated_at: string
}

export interface Framework {
  id: string
  organization_id: string
  framework_type: FrameworkType
  name: string
  version?: string
  status: 'not_started' | 'in_progress' | 'under_review' | 'certified'
  target_date?: string
  compliance_score: number
  created_by?: string
  created_at: string
  updated_at: string
}

export interface Control {
  id: string
  framework_id: string
  organization_id: string
  control_id: string
  title: string
  description?: string
  category?: string
  status: ControlStatus
  owner_id?: string
  due_date?: string
  created_at: string
  updated_at: string
}

export interface Evidence {
  id: string
  control_id: string
  organization_id: string
  title: string
  description?: string
  evidence_type: EvidenceType
  file_url?: string
  external_url?: string
  status: EvidenceStatus
  uploaded_by?: string
  reviewed_by?: string
  reviewed_at?: string
  expires_at?: string
  created_at: string
  updated_at: string
}

export interface Risk {
  id: string
  organization_id: string
  title: string
  description?: string
  category?: string
  likelihood?: number
  impact?: number
  risk_score?: number
  status: RiskStatus
  owner_id?: string
  mitigation_plan?: string
  due_date?: string
  created_by?: string
  created_at: string
  updated_at: string
}

export interface Audit {
  id: string
  organization_id: string
  framework_id?: string
  title: string
  audit_type: AuditType
  status: AuditStatus
  start_date?: string
  end_date?: string
  auditor_id?: string
  notes?: string
  created_by?: string
  created_at: string
  updated_at: string
}

export interface AuditFinding {
  id: string
  audit_id: string
  organization_id: string
  control_id?: string
  title: string
  description?: string
  severity: FindingSeverity
  status: 'open' | 'remediated' | 'accepted' | 'in_progress'
  due_date?: string
  assigned_to?: string
  created_at: string
  updated_at: string
}

export interface ActivityLog {
  id: string
  organization_id: string
  user_id?: string
  action: string
  resource_type?: string
  resource_id?: string
  metadata?: Record<string, unknown>
  ip_address?: string
  user_agent?: string
  created_at: string
}
