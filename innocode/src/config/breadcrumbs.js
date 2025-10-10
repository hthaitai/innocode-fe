// Breadcrumb configuration for the entire project
export const BREADCRUMBS = {
  // Main pages
  HOME: ['Home'],
  CONTESTS: ['Contests'],
  CONTEST_DETAIL: (contestTitle) => ['Contests', contestTitle],
  PRACTICE: ['Practice'],
  TEAM: ['Team'],
  LEADERBOARD: ['Leaderboard'],
  ANNOUNCEMENTS: ['Announcements'],
  HELP: ['Help'],
  PROFILE: ['Profile'],
  DASHBOARD: ['Dashboard'],
  ABOUT: ['About'],
  
  // Sub-pages
  PROFILE_ABOUT: ['Profile', 'Personal Information'],
  PROFILE_PASSWORD: ['Profile', 'Change Password'],
  CONTEST_CREATE: ['Contests', 'Create Contest'],
  CONTEST_EDIT: (contestTitle) => ['Contests', contestTitle, 'Edit'],
  TEAM_CREATE: ['Team', 'Create Team'],
  TEAM_DETAIL: (teamName) => ['Team', teamName],
  
  // Admin pages
  ADMIN_DASHBOARD: ['Admin', 'Dashboard'],
  ADMIN_CONTESTS: ['Admin', 'Contests'],
  ADMIN_USERS: ['Admin', 'Users'],
  ADMIN_TEAMS: ['Admin', 'Teams'],
  ADMIN_ANNOUNCEMENTS: ['Admin', 'Announcements'],
  
  // Error pages
  NOT_FOUND: ['Not Found'],
  UNAUTHORIZED: ['Unauthorized'],
};

// Helper function to create dynamic breadcrumb
export const createBreadcrumb = (type, ...params) => {
  if (typeof BREADCRUMBS[type] === 'function') {
    return BREADCRUMBS[type](...params);
  }
  return BREADCRUMBS[type] || ['Home'];
};
