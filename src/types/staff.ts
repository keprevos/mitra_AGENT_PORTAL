export interface Staff {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: 'active' | 'inactive';
  bankId?: string;
  agentId?: string;
  lastLogin?: Date;
  permissions: string[];
  department?: string;
  phone?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface StaffRequest {
  id: string;
  type: 'staff' | 'agent';
  requestedBy: string;
  bankId: string;
  status: 'pending' | 'approved' | 'rejected';
  details: {
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    department?: string;
    phone?: string;
    region?: string; // For agents
    responsibilities?: string; // For agents
  };
  reason?: string;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const STAFF_ROLES = {
  BANK_ADMIN: 'bank_admin',
  TELLER: 'teller',
  LOAN_OFFICER: 'loan_officer',
  MANAGER: 'manager',
  AGENT: 'agent',
  AGENT_MANAGER: 'agent_manager',
} as const;

export const ROLE_PERMISSIONS = {
  [STAFF_ROLES.BANK_ADMIN]: [
    'manage_staff',
    'manage_roles',
    'view_reports',
    'approve_transactions',
  ],
  [STAFF_ROLES.TELLER]: [
    'process_transactions',
    'view_customer_info',
  ],
  [STAFF_ROLES.LOAN_OFFICER]: [
    'manage_loans',
    'view_customer_info',
    'process_applications',
  ],
  [STAFF_ROLES.MANAGER]: [
    'manage_staff',
    'view_reports',
    'approve_transactions',
    'manage_settings',
  ],
  [STAFF_ROLES.AGENT]: [
    'manage_customers',
    'process_transactions',
    'view_reports',
  ],
  [STAFF_ROLES.AGENT_MANAGER]: [
    'manage_agents',
    'view_reports',
    'approve_transactions',
    'manage_settings',
  ],
} as const;