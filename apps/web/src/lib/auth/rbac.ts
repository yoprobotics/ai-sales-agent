import { UserRole } from '@prisma/client';

// Permission types
export type Permission =
  | 'view_dashboard'
  | 'manage_prospects'
  | 'manage_icps'
  | 'manage_sequences'
  | 'manage_campaigns'
  | 'view_reports'
  | 'manage_subscription'
  | 'manage_team'
  | 'view_admin'
  | 'manage_users'
  | 'manage_system'
  | 'view_audit_logs';

// Role permissions mapping
const rolePermissions: Record<UserRole, Permission[]> = {
  CLIENT: [
    'view_dashboard',
    'manage_prospects',
    'manage_icps',
    'manage_sequences',
    'manage_campaigns',
    'view_reports',
    'manage_subscription',
  ],
  TEAM_MEMBER: [
    'view_dashboard',
    'manage_prospects',
    'manage_icps',
    'manage_sequences',
    'manage_campaigns',
    'view_reports',
  ],
  TEAM_OWNER: [
    'view_dashboard',
    'manage_prospects',
    'manage_icps',
    'manage_sequences',
    'manage_campaigns',
    'view_reports',
    'manage_subscription',
    'manage_team',
  ],
  ADMIN: [
    'view_dashboard',
    'manage_prospects',
    'manage_icps',
    'manage_sequences',
    'manage_campaigns',
    'view_reports',
    'manage_subscription',
    'manage_team',
    'view_admin',
    'manage_users',
    'manage_system',
    'view_audit_logs',
  ],
};

// Check if a role has a specific permission
export function hasPermission(role: UserRole, permission: Permission): boolean {
  const permissions = rolePermissions[role];
  return permissions ? permissions.includes(permission) : false;
}

// Get all permissions for a role
export function getRolePermissions(role: UserRole): Permission[] {
  return rolePermissions[role] || [];
}

// Check if a role can access another role's data
export function canAccessRole(currentRole: UserRole, targetRole: UserRole): boolean {
  // Admin can access all
  if (currentRole === 'ADMIN') return true;
  
  // Team owner can access team members
  if (currentRole === 'TEAM_OWNER' && targetRole === 'TEAM_MEMBER') return true;
  
  // Users can only access their own data
  return currentRole === targetRole;
}

// Check if a role can perform an action on a resource
export function canPerformAction(
  role: UserRole,
  action: 'create' | 'read' | 'update' | 'delete',
  resource: 'prospect' | 'icp' | 'sequence' | 'campaign' | 'user' | 'subscription'
): boolean {
  // Admin can do everything
  if (role === 'ADMIN') return true;

  // Resource-specific rules
  switch (resource) {
    case 'user':
      // Only admin can manage users
      return false;
      
    case 'subscription':
      // CLIENT and TEAM_OWNER can manage subscriptions
      return role === 'CLIENT' || role === 'TEAM_OWNER';
      
    case 'prospect':
    case 'icp':
    case 'sequence':
    case 'campaign':
      // All non-admin roles can manage business resources
      // Since we already checked for ADMIN above, all roles here can manage these resources
      return true;
      
    default:
      return false;
  }
}

// Role hierarchy (for comparisons)
const roleHierarchy: Record<UserRole, number> = {
  CLIENT: 1,
  TEAM_MEMBER: 2,
  TEAM_OWNER: 3,
  ADMIN: 4,
};

// Check if one role is higher than another
export function isHigherRole(role1: UserRole, role2: UserRole): boolean {
  return roleHierarchy[role1] > roleHierarchy[role2];
}

// Get the highest role from a list
export function getHighestRole(roles: UserRole[]): UserRole {
  return roles.reduce((highest, current) => {
    return roleHierarchy[current] > roleHierarchy[highest] ? current : highest;
  });
}