// Breadcrumb configuration for the entire project
export const BREADCRUMBS = {
  // Main pages
  HOME: ["Home"],
  CONTESTS: ["Contests"],
  MY_CONTESTS: ["Your Contests"],
  CONTEST_DETAIL: (contestTitle) => ["Contests", contestTitle],
  PROVINCES: ["Provinces"],
  SCHOOLS: ["Schools"],
  NOTIFICATIONS: ["Notifications"],
  PRACTICE: ["Practice"],
  PRACTICE_DETAIL: (practiceTitle) => ["Practice", practiceTitle],
  TEAM: ["Team"],
  LEADERBOARD: ["Leaderboard"],
  ANNOUNCEMENTS: ["Announcements"],
  HELP: ["Help"],
  PROFILE: ["Profile"],
  DASHBOARD: ["Dashboard"],
  ABOUT: ["About"],
  APPEAL: ["Appeal"],
  STUDENT_CERTIFICATE: ["Student Certificate"],
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
  ORGANIZER_CONTEST_CREATE: ["Contests", "New contest"],
  ORGANIZER_CONTEST_DETAIL: (contestName) => ["Contests", contestName],
  ORGANIZER_CONTEST_EDIT: (contestName) => [
    "Contests",
    contestName,
    "Edit contest",
  ],

  // Organizer contest judges
  ORGANIZER_CONTEST_JUDGES: (contestName) => [
    "Contests",
    contestName,
    "Judges",
  ],

  // Organizer rounds
  ORGANIZER_ROUND_DETAIL: (contestName, roundName) => [
    "Contests",
    contestName,
    roundName,
  ],
  ORGANIZER_ROUND_CREATE: (contestName) => [
    "Contests",
    contestName,
    "New round",
  ],
  ORGANIZER_ROUND_EDIT: (contestName, roundName) => [
    "Contests",
    contestName,
    roundName,
    "Edit round",
  ],

  //Multiple choice questions breadcrumbs
  ORGANIZER_MCQ: (contestName, roundName) => [
    "Contests",
    contestName,
    roundName,
    "Questions",
  ],
  ORGANIZER_MCQ_NEW: (contestName, roundName) => [
    "Contests",
    contestName,
    roundName,
    "Questions",
    "New questions",
  ],
  ORGANIZER_MCQ_DETAIL: (contestName, roundName, displayId) => [
    "Contests",
    contestName,
    roundName,
    "Questions",
    displayId,
  ],
  ORGANIZER_MCQ_ATTEMPTS: (contestName, roundName) => [
    "Contests",
    contestName,
    roundName,
    "Quiz attempts",
  ],
  ORGANIZER_MCQ_ATTEMPT_DETAIL: (contestName, roundName, studentName) => [
    "Contests",
    contestName,
    roundName,
    "Quiz attempts",
    `${studentName}`,
  ],

  // mannual evaludation
  ORGANIZER_RUBRIC_EDITOR: (contestName, roundName) => [
    "Contests",
    contestName,
    roundName,
    "Rubric editor",
  ],

  ORGANIZER_MANUAL_RESULTS: (contestName, roundName) => [
    "Contests",
    contestName,
    roundName,
    "Manual results",
  ],

  // auto evaluation
  ORGANIZER_TEST_CASES: (contestName, roundName) => [
    "Contests",
    contestName,
    roundName,
    "Test cases",
  ],
  ORGANIZER_TEST_CASE_CREATE: (contestName, roundName) => [
    "Contests",
    contestName,
    roundName,
    "Test cases",
    "New test case",
  ],
  ORGANIZER_TEST_CASE_EDIT: (contestName, roundName, testCaseId) => [
    "Contests",
    contestName,
    roundName,
    "Test cases",
    `Edit test case #${testCaseId}`,
  ],

  ORGANIZER_AUTO_RESULTS: (contestName, roundName) => [
    "Contests",
    contestName,
    roundName,
    "Auto results",
  ],

  //idk old prolem detail
  ORGANIZER_PROBLEM_DETAIL: (
    contestId,
    contestName,
    roundName,
    problemLabel
  ) => ["Contests", contestName, roundName, problemLabel],

  ORGANIZER_TEAMS: (contestName) => ["Contests", contestName, "Teams"],
  ORGANIZER_TEAM_DETAIL: (contestName, teamName) => [
    "Contests",
    contestName,
    "Teams",
    teamName,
  ],

  // Organizer leaderboard
  ORGANIZER_LEADERBOARD: (contestName) => [
    "Contests",
    contestName,
    "Leaderboard",
  ],
  ORGANIZER_LEADERBOARD_DETAIL: (contestName, teamName) => [
    "Contests",
    contestName,
    "Leaderboard",
    teamName,
  ],
  ORGANIZER_LEADERBOARD_MEMBER: (contestName, teamName, memberName) => [
    "Contests",
    contestName,
    "Leaderboard",
    teamName,
    memberName,
  ],

  ORGANIZER_CERTIFICATES: (contestName) => [
    "Contests",
    contestName,
    "Certificates",
  ],
  ORGANIZER_CERTIFICATE_ISSUE: (contestName) => [
    "Contests",
    contestName,
    "Certificates",
    "Issue Certificate",
  ],
  ORGANIZER_CERTIFICATE_TEMPLATE_CREATE: (contestName) => [
    "Contests",
    contestName,
    "Certificates",
    "New Template",
  ],

  // Organizer appeals
  ORGANIZER_APPEALS: (contestName, roundName) => [
    "Contests",
    contestName,
    roundName,
    "Appeals",
  ],
  ORGANIZER_APPEAL_DETAIL: (contestName, roundName, appealId) => [
    "Contests",
    contestName,
    roundName,
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

  //Judge
  JUDGE_SUBMISSIONS: ["Submissions"],
  JUDGE_MANUAL_EVALUATION: ["Submissions", "Evaluation"],
  //Staff
  STAFF_PROVINCES: ["Provinces"],
  STAFF_SCHOOLS: ["Schools"],
  // Error pages
  NOT_FOUND: ["Not Found"],
  UNAUTHORIZED: ["Unauthorized"],
};

// Breadcrumb paths configuration for navigation
export const BREADCRUMB_PATHS = {
  // Main pages
  HOME: ["/"],
  CONTESTS: ["/contests"],
  CONTEST_DETAIL: (contestId) => ["/contests", `/contest-detail/${contestId}`],
  MY_CONTESTS: ["/mycontest"],
  PRACTICE: ["/practice"],
  PRACTICE_DETAIL: (practiceId) => [
    "/practice",
    `/practice-detail/${practiceId}`,
  ],
  TEAM: ["/team"],
  LEADERBOARD: ["/leaderboard"],
  ANNOUNCEMENTS: ["/announcements"],
  HELP: ["/help"],
  PROFILE: ["/profile"],
  DASHBOARD: ["/dashboard"],
  ABOUT: ["/about"],
  APPEAL: ["/appeal"],
  STUDENT_CERTIFICATE: ["/student-certificate"],
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
  // Organizer contests
  ORGANIZER_CONTESTS: ["/organizer", "/organizer/contests"],
  ORGANIZER_CONTEST_CREATE: ["/organizer/contests", "/organizer/contests/new"],
  ORGANIZER_CONTEST_DETAIL: (contestId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
  ],
  ORGANIZER_CONTEST_EDIT: (contestId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/edit`,
  ],

  // Organizer contest judges paths
  ORGANIZER_CONTEST_JUDGES: (contestId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/judges`,
  ],

  // Organizer rounds
  ORGANIZER_ROUND_DETAIL: (contestId, roundId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/rounds/${roundId}`,
  ],
  ORGANIZER_ROUND_CREATE: (contestId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/rounds/new`,
  ],
  ORGANIZER_ROUND_EDIT: (contestId, roundId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/rounds/${roundId}`,
    `/organizer/contests/${contestId}/rounds/${roundId}/edit`,
  ],

  //Multiple choice questions paths
  ORGANIZER_MCQ: (contestId, roundId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/rounds/${roundId}`,
    `/organizer/contests/${contestId}/rounds/${roundId}/mcqs`,
  ],
  ORGANIZER_MCQ_NEW: (contestId, roundId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/rounds/${roundId}`,
    `/organizer/contests/${contestId}/rounds/${roundId}/mcqs`,
    `/organizer/contests/${contestId}/rounds/${roundId}/mcqs/new`,
  ],
  ORGANIZER_MCQ_DETAIL: (contestId, roundId, questionId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/rounds/${roundId}`,
    `/organizer/contests/${contestId}/rounds/${roundId}/mcqs`,
    `/organizer/contests/${contestId}/rounds/${roundId}/mcqs/${questionId}`,
  ],
  ORGANIZER_MCQ_ATTEMPTS: (contestId, roundId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/rounds/${roundId}`,
    `/organizer/contests/${contestId}/rounds/${roundId}/attempts`,
  ],
  ORGANIZER_MCQ_ATTEMPT_DETAIL: (contestId, roundId, attemptId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/rounds/${roundId}`,
    `/organizer/contests/${contestId}/rounds/${roundId}/attempts`,
    `/organizer/contests/${contestId}/rounds/${roundId}/attempts/${attemptId}`,
  ],

  // manual evaludaiton
  ORGANIZER_RUBRIC_EDITOR: (contestId, roundId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/rounds/${roundId}`,
    `/organizer/contests/${contestId}/rounds/${roundId}/rubric`,
  ],

  ORGANIZER_MANUAL_RESULTS: (contestId, roundId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/rounds/${roundId}`,
    `/organizer/contests/${contestId}/rounds/${roundId}/manual-results`,
  ],

  // auto evaluation
  ORGANIZER_TEST_CASES: (contestId, roundId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/rounds/${roundId}`,
    `/organizer/contests/${contestId}/rounds/${roundId}/auto-evaluation`,
  ],
  ORGANIZER_TEST_CASE_CREATE: (contestId, roundId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/rounds/${roundId}`,
    `/organizer/contests/${contestId}/rounds/${roundId}/auto-evaluation`,
    `/organizer/contests/${contestId}/rounds/${roundId}/auto-evaluation/new`,
  ],
  ORGANIZER_TEST_CASE_EDIT: (contestId, roundId, testCaseId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/rounds/${roundId}`,
    `/organizer/contests/${contestId}/rounds/${roundId}/auto-evaluation`,
    `/organizer/contests/${contestId}/rounds/${roundId}/auto-evaluation/${testCaseId}/edit`,
  ],

  ORGANIZER_AUTO_RESULTS: (contestId, roundId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/rounds/${roundId}`,
    `/organizer/contests/${contestId}/rounds/${roundId}/auto-evaluation/results`,
  ],

  //old stuff
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

  // Organizer leaderboard
  ORGANIZER_LEADERBOARD: (contestId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/leaderboard`,
  ],
  ORGANIZER_LEADERBOARD_DETAIL: (contestId, teamId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/leaderboard`,
    `/organizer/contests/${contestId}/leaderboard/teams/${teamId}`,
  ],
  ORGANIZER_LEADERBOARD_MEMBER: (contestId, teamId, memberId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/leaderboard`,
    `/organizer/contests/${contestId}/leaderboard/teams/${teamId}`,
    `/organizer/contests/${contestId}/leaderboard/teams/${teamId}/members/${memberId}`,
  ],

  ORGANIZER_CERTIFICATES: (contestId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/certificates`,
  ],
  ORGANIZER_CERTIFICATE_ISSUE: (contestId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/certificates`,
    `/organizer/contests/${contestId}/certificates/issue`,
  ],
  ORGANIZER_CERTIFICATE_TEMPLATE_CREATE: (contestId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/certificates`,
    `/organizer/contests/${contestId}/certificates/templates/new`,
  ],

  ORGANIZER_APPEALS: (contestId, roundId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/rounds/${roundId}`,
    `/organizer/contests/${contestId}/rounds/${roundId}/appeals`,
  ],
  ORGANIZER_APPEAL_DETAIL: (contestId, roundId, appealId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/rounds/${roundId}/appeals`,
    `/organizer/contests/${contestId}/rounds/${roundId}/appeals/${appealId}`,
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
  //Staff
  STAFF_PROVINCES: ["/province-staff"],
  STAFF_SCHOOLS: ["/school-staff"],
  //Judge
  JUDGE_SUBMISSIONS: ["/judge/manual-submissions"],
  JUDGE_MANUAL_EVALUATION: (submissionId) => [
    "/judge/manual-submissions",
    `/judge/manual-submissions/${submissionId}/rubric-evaluation`,
  ],

  //Staff
  STAFF_PROVINCES: ["/province-staff"],
  STAFF_SCHOOLS: ["/school-staff"],

  // Error pages
  NOT_FOUND: ["/"],
  UNAUTHORIZED: ["/"],
};

// Helper function to create dynamic breadcrumb
export const createBreadcrumb = (type, ...params) => {
  if (typeof BREADCRUMBS[type] === "function") {
    return BREADCRUMBS[type](...params);
  }
  return BREADCRUMBS[type] || ["Home"];
};

// Helper function to create breadcrumb with paths for navigation
export const createBreadcrumbWithPaths = (type, ...params) => {
  const items =
    typeof BREADCRUMBS[type] === "function"
      ? BREADCRUMBS[type](...params)
      : BREADCRUMBS[type] || ["Home"];

  const paths =
    typeof BREADCRUMB_PATHS[type] === "function"
      ? BREADCRUMB_PATHS[type](...params)
      : BREADCRUMB_PATHS[type] || ["/"];

  return { items, paths };
};
