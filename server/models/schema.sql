-- Database schema for mitra_agent_portal

-- Roles table
CREATE TABLE roles (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by VARCHAR(36)
);

-- Permissions table
CREATE TABLE permissions (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by VARCHAR(36)
);

-- Role permissions junction table
CREATE TABLE role_permissions (
  role_id VARCHAR(36),
  permission_id VARCHAR(36),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  created_by VARCHAR(36),
  PRIMARY KEY (role_id, permission_id),
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (permission_id) REFERENCES permissions(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Users table for authentication
CREATE TABLE users (
  id VARCHAR(36) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  role_id VARCHAR(36) NOT NULL,
  bank_id VARCHAR(36),
  agency_id VARCHAR(36),
  status ENUM('active', 'inactive', 'pending_password_reset') DEFAULT 'pending_password_reset',
  last_login DATETIME,
  password_reset_token VARCHAR(255),
  password_reset_expires DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by VARCHAR(36),
  FOREIGN KEY (role_id) REFERENCES roles(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Banks table
CREATE TABLE banks (
  id VARCHAR(36) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  registration_number VARCHAR(100) UNIQUE NOT NULL,
  address TEXT NOT NULL,
  can_register_agents BOOLEAN DEFAULT false,
  can_register_staff BOOLEAN DEFAULT false,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by VARCHAR(36),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Agencies table
CREATE TABLE agencies (
  id VARCHAR(36) PRIMARY KEY,
  bank_id VARCHAR(36) NOT NULL,
  name VARCHAR(255) NOT NULL,
  address TEXT NOT NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  created_by VARCHAR(36),
  FOREIGN KEY (bank_id) REFERENCES banks(id),
  FOREIGN KEY (created_by) REFERENCES users(id)
);

-- Audit logs table
CREATE TABLE audit_logs (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  action_type ENUM(
    'user_created',
    'user_updated',
    'user_deleted',
    'permission_changed',
    'password_reset',
    'login_attempt',
    'login_success',
    'login_failed'
  ) NOT NULL,
  entity_type ENUM('user', 'bank', 'agency', 'permission', 'role') NOT NULL,
  entity_id VARCHAR(36) NOT NULL,
  details JSON,
  ip_address VARCHAR(45),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Password reset history
CREATE TABLE password_reset_history (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  reset_type ENUM('first_time', 'forgot_password', 'forced_reset') NOT NULL,
  reset_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Failed login attempts
CREATE TABLE failed_login_attempts (
  id VARCHAR(36) PRIMARY KEY,
  user_id VARCHAR(36) NOT NULL,
  attempt_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  ip_address VARCHAR(45),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert default roles
INSERT INTO roles (id, name, description) VALUES
('role-001', 'super_admin', 'Super administrator with full system access'),
('role-002', 'bank_admin', 'Bank administrator with bank-level access'),
('role-003', 'agent', 'Bank agent with agency-level access'),
('role-004', 'agent_staff', 'Agent staff with limited access');

-- Insert default permissions
INSERT INTO permissions (id, name, description) VALUES
-- System-level permissions
('perm-001', 'system.manage_banks', 'Create and manage banks'),
('perm-002', 'system.manage_roles', 'Manage roles and permissions'),
('perm-003', 'system.view_audit_logs', 'View system audit logs'),

-- Bank-level permissions
('perm-004', 'bank.manage_agents', 'Create and manage agents'),
('perm-005', 'bank.manage_staff', 'Create and manage agent staff'),
('perm-006', 'bank.view_reports', 'View bank-level reports'),

-- Agency-level permissions
('perm-007', 'agency.manage_customers', 'Manage customer accounts'),
('perm-008', 'agency.process_transactions', 'Process customer transactions'),
('perm-009', 'agency.view_reports', 'View agency-level reports');

-- Assign permissions to roles
INSERT INTO role_permissions (role_id, permission_id) VALUES
-- Super Admin: All permissions
('role-001', 'perm-001'), ('role-001', 'perm-002'), ('role-001', 'perm-003'),
('role-001', 'perm-004'), ('role-001', 'perm-005'), ('role-001', 'perm-006'),
('role-001', 'perm-007'), ('role-001', 'perm-008'), ('role-001', 'perm-009'),

-- Bank Admin: Bank-level and below
('role-002', 'perm-004'), ('role-002', 'perm-005'), ('role-002', 'perm-006'),
('role-002', 'perm-007'), ('role-002', 'perm-008'), ('role-002', 'perm-009'),

-- Agent: Agency-level permissions
('role-003', 'perm-007'), ('role-003', 'perm-008'), ('role-003', 'perm-009'),

-- Agent Staff: Limited agency permissions
('role-004', 'perm-007'), ('role-004', 'perm-008');