/**
 * Checks if a user has the required permissions based on their role
 * 
 * @param {string} userRole - The user's role (e.g., 'Admin', 'Counselor')
 * @param {Array<string>} requiredRoles - Array of roles that have access
 * @returns {boolean} Whether the user has permission
 */
export const checkPermission = (userRole, requiredRoles = []) => {
  if (!userRole) return false;
  if (requiredRoles.length === 0) return true; // No specific roles required
  
  // Admin can access everything
  if (userRole === 'Admin') return true;
  
  return requiredRoles.includes(userRole);
};

/**
 * Gets navigation items based on user role
 * 
 * @param {Object} user - The user object with role and other properties
 * @returns {Array} Navigation items available to the user
 */
export const getNavItems = (user) => {
  if (!user) return [];

  // Base navigation available to all authenticated users
  const baseNav = [
    { name: 'Dashboard', href: '/dashboard', icon: 'HomeIcon' }
  ];

  // Role-specific navigation
  if (user.role === 'Admin') {
    return [
      ...baseNav,
      { name: 'Users', href: '/users', icon: 'UsersIcon' },
      { name: 'Units', href: '/units', icon: 'FolderIcon' },
      { name: 'Bunks', href: '/bunks', icon: 'HomeIcon' },
      { name: 'Settings', href: '/settings', icon: 'CogIcon' }
    ];
  }

  if (user.role === 'Unit Head') {
    return [
      ...baseNav,
      { name: 'My Units', href: '/units', icon: 'FolderIcon' },
      { name: 'Reports', href: '/reports', icon: 'ChartBarIcon' }
    ];
  }

  if (user.role === 'Counselor') {
    return [
      ...baseNav,
      { name: 'My Bunks', href: '/mybunks', icon: 'HomeIcon' },
      { name: 'Campers', href: '/campers', icon: 'UsersIcon' }
    ];
  }

  if (user.role === 'Camper Care') {
    return [
      ...baseNav,
      { name: 'All Campers', href: '/campers', icon: 'UsersIcon' },
      { name: 'Reports', href: '/reports', icon: 'ChartBarIcon' },
      { name: 'Help Requests', href: '/help-requests', icon: 'SupportIcon' }
    ];
  }

  // Default navigation
  return baseNav;
};

/**
 * Maps route paths to required user roles
 */
export const routePermissions = {
  '/dashboard': [],  // Everyone with authentication
  '/users': ['Admin'],
  '/units': ['Admin', 'Unit Head'],
  '/bunks': ['Admin', 'Unit Head', 'Counselor'],
  '/mybunks': ['Admin', 'Unit Head', 'Counselor'],
  '/campers': ['Admin', 'Unit Head', 'Counselor', 'Camper Care'],
  '/reports': ['Admin', 'Unit Head', 'Camper Care'],
  '/help-requests': ['Admin', 'Camper Care'],
  '/settings': ['Admin']
};

/**
 * Check if the current user can access a specific route
 * 
 * @param {string} routePath - The route path to check
 * @param {string} userRole - The user's role
 * @returns {boolean} Whether the user can access the route
 */
export const canAccessRoute = (routePath, userRole) => {
  // Extract base route for checking permissions
  // For routes like '/bunk/123', we'll check permissions for '/bunk'
  const baseRoute = '/' + routePath.split('/')[1];
  
  // Find the required roles for this route
  const requiredRoles = routePermissions[baseRoute] || [];
  
  return checkPermission(userRole, requiredRoles);
};