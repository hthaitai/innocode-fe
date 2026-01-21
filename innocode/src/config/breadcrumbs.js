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
  ACTIVITY_LOGS: ["Activity Logs"],
  ABOUT: ["About"],
  APPEAL: ["Appeal"],
  STUDENT_CERTIFICATE: ["Student Certificate"],
  SCHOOL_MANAGEMENT: ["School Management"],
  MY_SCHOOL_MANAGEMENT: ["My School Management"],
  MY_MANAGED_SCHOOLS: ["My Managed Schools"],
  SCHOOL_REQUESTS: ["School Requests"],
  SCHOOL_CREATE_REQUEST: ["School Requests", "Create Request"],
  USER_MANAGEMENT: ["User Management"],
  // Sub-pages
  PROFILE_ABOUT: ["Profile", "Personal Information"],
  PROFILE_PASSWORD: ["Profile", "Change Password"],
  CONTEST_CREATE: ["Contests", "Create Contest"],
  CONTEST_EDIT: (contestTitle) => ["Contests", contestTitle, "Edit"],
  STUDENT_CERTIFICATE: ["Student Certificate"],
  SCHOOL_MANAGEMENT: ["School Management"],
  MY_SCHOOL_MANAGEMENT: ["My School Management"],
  SCHOOL_CREATE_REQUEST: ["School Management", "Create Request"],
  // Sub-pages
  PROFILE_ABOUT: ["Profile", "Personal Information"],
  PROFILE_PASSWORD: ["Profile", "Change Password"],
  CONTEST_CREATE: ["Contests", "Create Contest"],
  CONTEST_EDIT: (contestTitle) => ["Contests", contestTitle, "Edit"],
  TEAM_CREATE: ["Team", "Create Team"],
  TEAM_DETAIL: (teamName) => ["Team", teamName],
  POLICY: ["Policy and Rules"],
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
  MENTOR_DASHBOARD: ["Mentor", "Dashboard"],

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
  ORGANIZER_CONTEST_JUDGES: (contestName, judgesTitle) => [
    "Contests",
    contestName,
    judgesTitle,
  ],
  ORGANIZER_CONTEST_JUDGE_LIST: (
    contestName,
    judgesTitle,
    activeJudgesTitle,
  ) => ["Contests", contestName, judgesTitle, activeJudgesTitle],
  ORGANIZER_CONTEST_INVITE_JUDGE: (
    contestName,
    judgesTitle,
    inviteJudgeTitle,
  ) => ["Contests", contestName, judgesTitle, inviteJudgeTitle],
  ORGANIZER_CONTEST_JUDGE_INVITES: (
    contestName,
    judgesTitle,
    judgeInvitesTitle,
  ) => ["Contests", contestName, judgesTitle, judgeInvitesTitle],

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

  ORGANIZER_MANUAL_RESULT_DETAIL: (contestName, roundName, studentName) => [
    "Contests",
    contestName,
    roundName,
    "Manual results",
    studentName,
  ],

  // auto evaluation
  ORGANIZER_TEST_CASES: (contestName, roundName, testCasesLabel) => [
    "Contests",
    contestName,
    roundName,
    testCasesLabel,
  ],
  ORGANIZER_TEST_CASE_CREATE: (
    contestName,
    roundName,
    testCasesLabel,
    createLabel,
  ) => ["Contests", contestName, roundName, testCasesLabel, createLabel],
  ORGANIZER_TEST_CASE_EDIT: (
    contestName,
    roundName,
    testCaseName,
    testCasesLabel,
    editLabel,
  ) => ["Contests", contestName, roundName, testCasesLabel, editLabel],

  ORGANIZER_AUTO_RESULTS: (contestName, roundName) => [
    "Contests",
    contestName,
    roundName,
    "Auto results",
  ],

  ORGANIZER_AUTO_RESULT_DETAIL: (contestName, roundName, studentName) => [
    "Contests",
    contestName,
    roundName,
    "Auto results",
    studentName,
  ],

  //idk old prolem detail
  ORGANIZER_PROBLEM_DETAIL: (
    contestId,
    contestName,
    roundName,
    problemLabel,
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
  ORGANIZER_CERTIFICATE_TEMPLATES: (contestName) => [
    "Contests",
    contestName,
    "Certificates",
    "Certificate templates",
  ],
  ORGANIZER_CERTIFICATE_ISSUED: (contestName) => [
    "Contests",
    contestName,
    "Certificates",
    "Issued certificates",
  ],
  ORGANIZER_CERTIFICATE_ISSUED_STUDENT: (contestName) => [
    "Contests",
    contestName,
    "Certificates",
    "Issued student certificates",
  ],
  ORGANIZER_CERTIFICATE_ISSUED_TEAM: (contestName) => [
    "Contests",
    contestName,
    "Certificates",
    "Issued team certificates",
  ],
  ORGANIZER_CERTIFICATE_TEMPLATE_CREATE: (contestName) => [
    "Contests",
    contestName,
    "Certificates",
    "New Template",
  ],

  // Organizer appeals
  ORGANIZER_APPEALS: (contestName) => ["Contests", contestName, "Appeals"],
  ORGANIZER_APPEAL_DETAIL: (contestName, studentName) => [
    "Contests",
    contestName,
    "Appeals",
    studentName,
  ],

  // Organizer plagiarism
  ORGANIZER_PLAGIARISM: (contestName) => [
    "Contests",
    contestName,
    "Plagiarism",
  ],
  ORGANIZER_PLAGIARISM_DETAIL: (contestName, studentName) => [
    "Contests",
    contestName,
    "Plagiarism",
    studentName,
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
  ORGANIZER_DASHBOARD: ["Dashboard"],

  //Judge
  JUDGE_SUBMISSIONS: ["Submissions"],
  JUDGE_MANUAL_EVALUATION: ["Submissions", "Evaluation"],
  JUDGE_CONTESTS: ["Contests"],
  JUDGE_CONTEST_DETAIL: (contestName) => ["Contests", contestName],
  JUDGE_ROUND_SUBMISSIONS: (contestName, roundName) => [
    "Contests",
    contestName,
    roundName,
  ],
  JUDGE_ROUND_SUBMISSION_EVALUATION: (contestName, roundName) => [
    "Contests",
    contestName,
    roundName,
    "Evaluation",
  ],
  //Staff
  STAFF_PROVINCES: ["Provinces"],
  STAFF_SCHOOLS: ["Schools"],
  ROLE_REGISTRATIONS: ["Role Registrations"],
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
  MY_CONTESTS: ["/mycontest"],
  PRACTICE: ["/practice"],
  PRACTICE_DETAIL: (practiceId) => [
    "/practice",
    `/practice-detail/${practiceId}`,
  ],
  TEAM: ["/team"],
  LEADERBOARD: ["/leaderboard"],
  NOTIFICATIONS: ["/notifications"],
  HELP: ["/help"],
  PROFILE: ["/profile"],
  DASHBOARD: ["/dashboard"],
  ACTIVITY_LOGS: ["/activity-logs"],
  ABOUT: ["/about"],
  APPEAL: ["/appeal"],
  STUDENT_CERTIFICATE: ["/student-certificate"],
  SCHOOL_MANAGEMENT: ["/school-manager"],
  SCHOOL_CREATE_REQUEST: ["/school-requests", "/school-requests/create"],
  MY_SCHOOL_MANAGEMENT: ["/school-manager", "/schools"],
  POLICY: ["/policy"],
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
  MENTOR_DASHBOARD: ["/mentor/dashboard"],

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
  ORGANIZER_CONTEST_JUDGE_LIST: (contestId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/judges`,
    `/organizer/contests/${contestId}/judges/active`,
  ],
  ORGANIZER_CONTEST_INVITE_JUDGE: (contestId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/judges`,
    `/organizer/contests/${contestId}/judges/invite-new`,
  ],
  ORGANIZER_CONTEST_JUDGE_INVITES: (contestId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/judges`,
    `/organizer/contests/${contestId}/judges/invites`,
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

  ORGANIZER_MANUAL_RESULT_DETAIL: (contestId, roundId, submissionId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/rounds/${roundId}`,
    `/organizer/contests/${contestId}/rounds/${roundId}/manual/results`,
    `/organizer/contests/${contestId}/rounds/${roundId}/manual-test/results/${submissionId}`,
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

  ORGANIZER_AUTO_RESULT_DETAIL: (contestId, roundId, submissionId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/rounds/${roundId}`,
    `/organizer/contests/${contestId}/rounds/${roundId}/auto-evaluation/results`,
    `/organizer/contests/${contestId}/rounds/${roundId}/auto-evaluation/results/${submissionId}`,
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
  ORGANIZER_CERTIFICATE_TEMPLATES: (contestId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/certificates`,
    `/organizer/contests/${contestId}/certificates/templates`,
  ],
  ORGANIZER_CERTIFICATE_ISSUED: (contestId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/certificates`,
    `/organizer/contests/${contestId}/certificates/issued`,
  ],
  ORGANIZER_CERTIFICATE_ISSUED_STUDENT: (contestId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/certificates`,
    `/organizer/contests/${contestId}/certificates/issued/students`,
  ],
  ORGANIZER_CERTIFICATE_ISSUED_TEAM: (contestId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/certificates`,
    `/organizer/contests/${contestId}/certificates/issued/teams`,
  ],
  ORGANIZER_CERTIFICATE_TEMPLATE_CREATE: (contestId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/certificates`,
    `/organizer/contests/${contestId}/certificates/templates/new`,
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

  ORGANIZER_PLAGIARISM: (contestId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/plagiarism`,
  ],
  ORGANIZER_PLAGIARISM_DETAIL: (contestId, submissionId) => [
    "/organizer/contests",
    `/organizer/contests/${contestId}`,
    `/organizer/contests/${contestId}/plagiarism`,
    `/organizer/contests/${contestId}/plagiarism/${submissionId}`,
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
  ORGANIZER_DASHBOARD: ["/organizer/dashboard"],
  //Staff
  STAFF_PROVINCES: ["/province-staff"],
  STAFF_SCHOOLS: ["/school-staff"],
  //Judge
  JUDGE_SUBMISSIONS: ["Submissions"],
  JUDGE_MANUAL_EVALUATION: (submissionId) => [
    "/judge/manual-submissions",
    `/judge/manual-submissions/${submissionId}/rubric-evaluation`,
  ],
  JUDGE_CONTESTS: ["/judge/contests"],
  JUDGE_CONTEST_DETAIL: (contestId) => [
    "/judge/contests",
    `/judge/contests/${contestId}`,
  ],
  JUDGE_ROUND_SUBMISSIONS: (contestId, roundId) => [
    "/judge/contests",
    `/judge/contests/${contestId}`,
    `/judge/contests/${contestId}/rounds/${roundId}/submissions`,
  ],
  JUDGE_ROUND_SUBMISSION_EVALUATION: (contestId, roundId, submissionId) => [
    "/judge/contests",
    `/judge/contests/${contestId}`,
    `/judge/contests/${contestId}/rounds/${roundId}/submissions`,
    `/judge/contests/${contestId}/rounds/${roundId}/submissions/${submissionId}/evaluation`,
  ],

  //Staff
  STAFF_PROVINCES: ["/province-staff"],
  STAFF_SCHOOLS: ["/school-staff"],
  POLICY: ["/policy"],
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
