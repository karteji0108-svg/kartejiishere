export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  KETUA: 'ketua',
  WAKIL_KETUA: 'wakil_ketua',
  BENDAHARA: 'bendahara',
  SEKRETARIS: 'sekretaris',
  ANGGOTA: 'anggota',
};

export const PERMISSIONS = {
  // General
  VIEW_DASHBOARD: 'view_dashboard',

  // Members
  MANAGE_MEMBERS: 'manage_members', // Create, Update, Delete, Approve
  VIEW_MEMBERS: 'view_members',

  // Finance
  MANAGE_FINANCE: 'manage_finance',
  VIEW_FINANCE: 'view_finance',
  EXPORT_FINANCE: 'export_finance',

  // Activities
  MANAGE_ACTIVITIES: 'manage_activities',
  APPROVE_ACTIVITIES: 'approve_activities',
  VIEW_ACTIVITIES: 'view_activities',
  PROPOSE_ACTIVITY: 'propose_activity',

  // Announcements
  MANAGE_ANNOUNCEMENTS: 'manage_announcements',

  // Gallery
  MANAGE_GALLERY: 'manage_gallery',

  // Hero Carousel
  MANAGE_HERO: 'manage_hero',

  // System
  MANAGE_ROLES: 'manage_roles',
  VIEW_LOGS: 'view_logs',
};

export const ROLE_PERMISSIONS = {
  [ROLES.SUPER_ADMIN]: Object.values(PERMISSIONS),

  [ROLES.KETUA]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_MEMBERS,
    PERMISSIONS.VIEW_FINANCE,
    PERMISSIONS.VIEW_ACTIVITIES,
    PERMISSIONS.APPROVE_ACTIVITIES,
    PERMISSIONS.MANAGE_ANNOUNCEMENTS,
    PERMISSIONS.MANAGE_HERO,
    PERMISSIONS.VIEW_LOGS,
    PERMISSIONS.MANAGE_ROLES, // Added per request
  ],

  [ROLES.WAKIL_KETUA]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_MEMBERS,
    PERMISSIONS.VIEW_FINANCE,
    PERMISSIONS.VIEW_ACTIVITIES,
    PERMISSIONS.APPROVE_ACTIVITIES, // Backup approval
    PERMISSIONS.MANAGE_ANNOUNCEMENTS,
    PERMISSIONS.MANAGE_HERO,
    PERMISSIONS.MANAGE_ROLES, // Added per request
  ],

  [ROLES.BENDAHARA]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.VIEW_MEMBERS,
    PERMISSIONS.MANAGE_FINANCE,
    PERMISSIONS.VIEW_FINANCE,
    PERMISSIONS.EXPORT_FINANCE,
    PERMISSIONS.VIEW_ACTIVITIES,
  ],

  [ROLES.SEKRETARIS]: [
    PERMISSIONS.VIEW_DASHBOARD,
    PERMISSIONS.MANAGE_MEMBERS,
    PERMISSIONS.VIEW_MEMBERS,
    PERMISSIONS.MANAGE_ACTIVITIES,
    PERMISSIONS.VIEW_ACTIVITIES,
    PERMISSIONS.MANAGE_ANNOUNCEMENTS,
    PERMISSIONS.MANAGE_GALLERY,
  ],

  [ROLES.ANGGOTA]: [
    PERMISSIONS.VIEW_ACTIVITIES,
    PERMISSIONS.PROPOSE_ACTIVITY,
    PERMISSIONS.VIEW_ANNOUNCEMENTS, // Implicit usually
  ],
};

export const hasPermission = (userRole, permission) => {
  if (!userRole) return false;
  const permissions = ROLE_PERMISSIONS[userRole] || [];
  return permissions.includes(permission);
};
