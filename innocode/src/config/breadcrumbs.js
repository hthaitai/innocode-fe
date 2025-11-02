// Breadcrumb configuration for the entire project
export const BREADCRUMBS = {
  // Main pages
  HOME: ["Home"],
  CONTESTS: ["Contests"],
  CONTEST_DETAIL: (contestTitle) => ["Contests", contestTitle],
  PROVINCES: ["Provinces"],
  SCHOOLS: ["Schools"],
  NOTIFICATIONS: ["Notifications"],
  PRACTICE: ["Practice"],
  TEAM: ["Team"],
  LEADERBOARD: ["Leaderboard"],
  ANNOUNCEMENTS: ["Announcements"],
  HELP: ["Help"],
  PROFILE: ["Profile"],
  DASHBOARD: ["Dashboard"],
  ABOUT: ["About"],

  // Sub-pages
  PROFILE_ABOUT: ["Profile", "Personal Information"],
  PROFILE_PASSWORD: ["Profile", "Change Password"],
  CONTEST_CREATE: ["Contests", "Create Contest"],
  CONTEST_EDIT: (contestTitle) => ["Contests", contestTitle, "Edit"],
  TEAM_CREATE: ["Team", "Create Team"],
  TEAM_DETAIL: (teamName) => ["Team", teamName],
  CONTEST_PROCESSING: (contestTitle) => [
    "Contests",
    contestTitle,
    "Processing",
  ],
  CONTEST_RESULTS: (contestTitle) => ["Contests", contestTitle, "Results"],
  CONTEST_LEADERBOARD: (contestTitle) => [
    "Contests",
    contestTitle,
    "Leaderboard",
  ],
  CONTEST_SUBMISSIONS: (contestTitle) => [
    "Contests",
    contestTitle,
    "Submissions",
  ],

  // Admin pages
  ADMIN_DASHBOARD: ["Admin", "Dashboard"],
  ADMIN_CONTESTS: ["Admin", "Contests"],
  ADMIN_USERS: ["Admin", "Users"],
  ADMIN_TEAMS: ["Admin", "Teams"],
  ADMIN_ANNOUNCEMENTS: ["Admin", "Announcements"],

  // Organizer pages
  ORGANIZER_CONTESTS: ["Contests"],
  ORGANIZER_CONTEST_DETAIL: (contestName) => ["Contests", contestName],
  ORGANIZER_ROUND_DETAIL: (contestName, roundName) => [
    "Contests",
    contestName,
    roundName,
  ],
  ORGANIZER_PROBLEM_DETAIL: (contestName, roundName, problemLabel) => [
    "Contests",
    contestName,
    roundName,
    problemLabel,
  ],

  ORGANIZER_TEAMS: (contestName) => ["Contests", contestName, "Teams"],
  ORGANIZER_TEAM_DETAIL: (contestName, teamName) => [
    "Contests",
    contestName,
    "Teams",
    teamName,
  ],

  ORGANIZER_LEADERBOARD: (contestName) => [
    "Contests",
    contestName,
    "Leaderboard",
  ],
  ORGANIZER_CERTIFICATES: (contestName) => [
    "Contests",
    contestName,
    "Certificates",
  ],

  ORGANIZER_APPEALS: (contestName) => ["Contests", contestName, "Appeals"],
  ORGANIZER_APPEAL_DETAIL: (contestName, appealId) => [
    "Contests",
    contestName,
    "Appeals",
    `Appeal #${appealId}`,
  ],

  ORGANIZER_ACTIVITY: (contestName) => [
    "Contests",
    contestName,
    "Activity Logs",
  ],
  ORGANIZER_NOTIFICATIONS: (contestName) => [
    "Contests",
    contestName,
    "Notifications",
  ],

  ORGANIZER_PROVINCES: ["Provinces"],
  ORGANIZER_SCHOOLS: ["Schools"],

  // Error pages
  NOT_FOUND: ["Not Found"],
  UNAUTHORIZED: ["Unauthorized"],
}

// Breadcrumb paths configuration for navigation
export const BREADCRUMB_PATHS = {
  // Main pages
  HOME: ["/"],
  CONTESTS: ["/contests"],
  CONTEST_DETAIL: (contestId) => ["/contests", `/contest-detail/${contestId}`],
  PRACTICE: ["/practice"],
  TEAM: ["/team"],
  LEADERBOARD: ["/leaderboard"],
  ANNOUNCEMENTS: ["/announcements"],
  HELP: ["/help"],
  PROFILE: ["/profile"],
  DASHBOARD: ["/dashboard"],
  ABOUT: ["/about"],

  // Sub-pages
  PROFILE_ABOUT: ["/profile"],
  PROFILE_PASSWORD: ["/profile"],
  CONTEST_CREATE: ["/contests"],
  CONTEST_EDIT: (contestId) => ["/contests", `/contest-detail/${contestId}`],
  TEAM_CREATE: ["/team"],
  TEAM_DETAIL: (teamId) => ["/team", `/team/${teamId}`],
  CONTEST_PROCESSING: (contestId) => [
    "/contests",
    `/contest-detail/${contestId}`,
    `/contest-processing/${contestId}`,
  ],
  CONTEST_RESULTS: (contestId) => [
    "/contests",
    `/contest-detail/${contestId}`,
    `/contest-results/${contestId}`,
  ],
  CONTEST_LEADERBOARD: (contestId) => [
    "/contests",
    `/contest-detail/${contestId}`,
    `/contest-leaderboard/${contestId}`,
  ],
  CONTEST_SUBMISSIONS: (contestId) => [
    "/contests",
    `/contest-detail/${contestId}`,
    `/contest-submissions/${contestId}`,
  ],

  // Admin pages
  ADMIN_DASHBOARD: ["/admin", "/admin/dashboard"],
  ADMIN_CONTESTS: ["/admin", "/admin/contests"],
  ADMIN_USERS: ["/admin", "/admin/users"],
  ADMIN_TEAMS: ["/admin", "/admin/teams"],
  ADMIN_ANNOUNCEMENTS: ["/admin", "/admin/announcements"],

  // Organizer paths
  ORGANIZER_CONTESTS: ["/organizer", "/organizer/contests"],
  ORGANIZER_CONTEST_DETAIL: (contestId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
  ],
  ORGANIZER_ROUND_DETAIL: (contestId, roundId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/rounds/${roundId}`,
  ],
  ORGANIZER_PROBLEM_DETAIL: (contestId, roundId, problemId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/rounds/${roundId}`,
    `/organizer/contests/${contestId}/rounds/${roundId}/problems/${problemId}`,
  ],
  ORGANIZER_TEAMS: (contestId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/teams`,
  ],
  ORGANIZER_TEAM_DETAIL: (contestId, teamId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/teams`,
    `/organizer/contests/${contestId}/teams/${teamId}`,
  ],
  ORGANIZER_LEADERBOARD: (contestId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/leaderboard`,
  ],
  ORGANIZER_CERTIFICATES: (contestId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/certificates`,
  ],
  ORGANIZER_APPEALS: (contestId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/appeals`,
  ],
  ORGANIZER_APPEAL_DETAIL: (contestId, appealId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/appeals`,
    `/organizer/contests/${contestId}/appeals/${appealId}`,
  ],
  ORGANIZER_ACTIVITY: (contestId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/activity`,
  ],
  ORGANIZER_NOTIFICATIONS: (contestId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/notifications`,
  ],

  ORGANIZER_PROVINCES: ["/organizer", "/organizer/provinces"],
  ORGANIZER_SCHOOLS: ["/organizer", "/organizer/schools"],

  // Error pages
  NOT_FOUND: ["/"],
  UNAUTHORIZED: ["/"],
}

// Helper function to create dynamic breadcrumb
export const createBreadcrumb = (type, ...params) => {
  if (typeof BREADCRUMBS[type] === "function") {
    return BREADCRUMBS[type](...params)
  }
  return BREADCRUMBS[type] || ["Home"]
}

// Helper function to create breadcrumb with paths for navigation
export const createBreadcrumbWithPaths = (type, ...params) => {
  const items =
    typeof BREADCRUMBS[type] === "function"
      ? BREADCRUMBS[type](...params)
      : BREADCRUMBS[type] || ["Home"]

  const paths =
    typeof BREADCRUMB_PATHS[type] === "function"
      ? BREADCRUMB_PATHS[type](...params)
      : BREADCRUMB_PATHS[type] || ["/"]

  return { items, paths }
}
