import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import "./i18n/config" // Initialize i18n
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import MainLayout from "./shared/components/layout/MainLayout"
import AuthLayout from "./shared/components/layout/AuthLayout"
import HomeLayout from "./shared/components/layout/HomeLayout"
import { Provider } from "react-redux"
import { store } from "./store/store"
// Common pages
import Home from "./features/common/pages/Home"
import About from "./features/common/pages/About"
import Policy from "./features/common/pages/Policy"
import Profile from "./features/common/profile/pages/Profile"
import Dashboard from "./features/common/pages/Dashboard"
import ActivityLogs from "./features/common/pages/ActivityLogs"
import Notifications from "./features/common/pages/Notifications"
import TeamInviteNotification from "./features/notification/pages/TeamInviteNotification"
import Unauthorized from "./features/common/pages/Unauthorized"
// Student pages
import Contests from "./features/contest/student/Contests"
import ContestDetail from "./features/contest/student/ContestDetail"
import ContestProcessing from "./features/contest/student/ContestProcessing"
import Practice from "./features/contest/student/Practice"
import PracticeDetail from "./features/contest/student/PracticeDetail"
import PracticeStart from "./features/contest/student/PracticeStart"
import Team from "./features/contest/student/Team"
import Help from "./features/contest/student/Help"
import MCQTest from "./features/quiz/student/MCQTest"
import FinishQuiz from "./features/quiz/student/FinishQuiz"
import StudentManualResult from "./features/problem/pages/student/StudentManualResult"
// Auth
import ManualRubricPage from "./features/problems/manual/pages/ManualRubricPage"
import ManualResultsPage from "./features/problems/manual/pages/ManualResultsPage"
import ManualResultDetailPage from "./features/problems/manual/pages/ManualResultDetailPage"
import AutoEvaluationPage from "./features/problems/auto-evaluation/pages/AutoEvaluationPage"
import AutoTestResultsPage from "./features/problems/auto-evaluation/pages/AutoTestResultsPage"
import AutoResultDetail from "./features/problems/auto-evaluation/pages/AutoResultDetail"
import Login from "./features/auth/pages/Login"
import Register from "./features/auth/components/Register"
import RoleRegistration from "./features/auth/components/RoleRegistration"
import { ModalProvider } from "./context/ModalContext"
import { AuthProvider, ROLES } from "./context/AuthContext"
import OrganizerContests from "./features/contest/pages/organizer/OrganizerContests"
import OrganizerContestDetail from "./features/contest/pages/organizer/OrganizerContestDetail"
import ContestJudgeInvitesPage from "./features/invite-judge/pages/ContestJudgeInvitesPage"
import ActiveJudgesList from "./features/invite-judge/pages/ActiveJudgesList"
import OrganizerRoundDetail from "./features/round/pages/organizer/OrganizerRoundDetail"
import CreateRound from "./features/round/pages/organizer/CreateRound"
import EditRound from "./features/round/pages/organizer/EditRound"
import OrganizerProblemDetail from "./features/problem/pages/organizer/OrganizerProblemDetail"
import OrganizerTeams from "./features/team/pages/organizer/OrganizerTeams"
import OrganizerTeamDetail from "./features/team/pages/organizer/OrganizerTeamDetail"
import OrganizerLeaderboard from "./features/leaderboard/pages/organizer/OrganizerLeaderboard"
import OrganizerCertificateTemplateCreate from "./features/certificate/pages/organizer/OrganizerCertificateTemplateCreate"
import OrganizerCertificateTemplateEdit from "./features/certificate/pages/organizer/OrganizerCertificateTemplateEdit"
import OrganizerCertificateTemplates from "./features/certificate/pages/organizer/OrganizerCertificateTemplates"
import OrganizerIssuedStudentCertificates from "./features/certificate/pages/organizer/OrganizerIssuedStudentCertificates"
import OrganizerIssuedTeamCertificates from "./features/certificate/pages/organizer/OrganizerIssuedTeamCertificates"
import OrganizerAppeals from "./features/appeal/pages/organizer/OrganizerAppeals"
import OrganizerAppealDetail from "./features/appeal/pages/organizer/OrganizerAppealDetail"
import OrganizerCertificates from "./features/certificate/pages/organizer/OrganizerCertificates"
import OrganizerPlagiarismQueue from "./features/plagiarism/pages/organizer/OrganizerPlagiarismQueue"
import OrganizerPlagiarismDetail from "./features/plagiarism/pages/organizer/OrganizerPlagiarismDetail"
import OrganizerProvinces from "./features/province/pages/organizer/OrganizerProvinces"
import OrganizerSchools from "./features/school/pages/organizer/OrganizerSchools"
import OrganizerNotifications from "./features/notification/pages/organizer/OrganizerNotifications"
import ProtectedRoute from "./shared/components/auth/ProtectedRoute"
import { Toaster } from "react-hot-toast"
import PublicRoute from "./shared/components/auth/PublicRoute"
import OrganizerMcq from "./features/mcq/pages/OrganizerMcq"
import OrganizerMcqCreate from "./features/mcq/pages/OrganizerMcqCreate"
import OrganizerMcqAttempts from "./features/mcq/pages/OrganizerMcqAttempts"
import OrganizerMcqAttemptDetail from "./features/mcq/pages/OrganizerMcqAttemptDetail"
import StudentAutoEvaluation from "./features/problem/pages/student/StudentAutoEvaluation"
import StudentMockTest from "./features/problem/pages/student/StudentMockTest"
import StudentManualProblem from "./features/problem/pages/student/StudentManualProblem"
import AutoTestResult from "./features/problem/pages/student/AutoTestResult"
import CreateContest from "./features/contest/pages/organizer/CreateContest"
import EditContest from "./features/contest/pages/organizer/EditContest"
import MentorTeam from "./features/team/pages/mentor/MentorTeam"
import { initEmailJs } from "./shared/services/emailService"
import TeamInviteResponse from "./features/team/pages/student/TeamInviteResponse"
import VerifyEmail from "./features/auth/components/VerifyEmail"
import ForgotPassword from "./features/auth/components/ForgotPassword"
import ResetPassword from "./features/auth/components/ResetPassword"
import MyContest from "./features/contest/student/MyContest"
//Mentor pages
import MentorAppeal from "./features/appeal/pages/mentor/mentorAppeal"
// Organizer pages
import AddTestCase from "./features/problems/auto-evaluation/pages/AddTestCase"
import EditTestCase from "./features/problems/auto-evaluation/pages/EditTestCase"
import OrganizerDashboard from "./features/dashboard/pages/organizer/OrganizerDashboard"

// Judge pages
import JudgeManualSubmissionsPage from "./features/submission/pages/judge/JudgeManualSubmissionsPage" // new page for pending submissions list
import JudgeManualEvaluationsPage from "./features/submission/pages/judge/JudgeManualEvaluationsPage"
import JudgeContestListPage from "./features/contest/pages/judge/JudgeContestListPage"
import JudgeContestDetailPage from "./features/contest/pages/judge/JudgeContestDetailPage"

import Leaderboard from "./features/leaderboard/pages/student/Leaderboard"
import OrganizerLeaderboardTeam from "./features/leaderboard/pages/organizer/OrganizerLeaderboardTeam"
import OrganizerLeaderboardMember from "./features/leaderboard/pages/organizer/OrganizerLeaderboardMember"
import NotFound from "./pages/NotFound"
import StaffProvinces from "./features/province/pages/staff/StaffProvinces"
import StaffSchools from "./features/school/pages/staff/StaffSchools"
import StaffSchoolsManagement from "./features/school/pages/staff/StaffSchoolsManagement"
import StaffSchoolCreationRequestDetail from "./features/school/pages/staff/StaffSchoolCreationRequestDetail"
import StaffRoleRegistrations from "./features/role-registration/pages/staff/StaffRoleRegistrations"
import StaffRoleRegistrationDetail from "./features/role-registration/pages/staff/StaffRoleRegistrationDetail"
import StudentCertificate from "./features/certificate/pages/student/StudentCertificate"
import JudgeInvitations from "./features/invite-judge/pages/JudgeInvitations"
import JudgeInviteAccept from "./features/invite-judge/pages/JudgeInviteAccept"
import JudgeInviteDecline from "./features/invite-judge/pages/JudgeInviteDecline"
import JudgeInviteResponse from "./features/invite-judge/pages/JudgeInviteResponse"
import SchoolManager from "./features/school/pages/school-manager/SchoolManager"
import CreateSchoolRequest from "./features/school/pages/school-manager/CreateSchoolRequest"
import SchoolCreationRequestDetail from "./features/school/pages/school-manager/SchoolCreationRequestDetail"
import MyManageSchool from "./features/school/pages/school-manager/MyManageSchool"
import SchoolDetail from "./features/school/pages/school-manager/SchoolDetail"
import UserManagement from "./features/user/pages/UserManagement"

// Initialize EmailJS when app starts
initEmailJs()
const router = createBrowserRouter([
  {
    element: <AuthLayout />, // Auth layout wrapper
    children: [
      {
        path: "login",
        element: (
          <PublicRoute>
            <Login />
          </PublicRoute>
        ),
      },
      {
        path: "register",
        element: (
          <PublicRoute>
            <Register />
          </PublicRoute>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <PublicRoute>
            <ForgotPassword />
          </PublicRoute>
        ),
      },
      {
        path: "role-registration",
        element: (
          <PublicRoute>
            <RoleRegistration />
          </PublicRoute>
        ),
      },
    ],
  },

  {
    path: "judge/invite",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.JUDGE]}>
        <JudgeInviteResponse />
      </ProtectedRoute>
    ),
  },
  {
    path: "judge/accept",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.JUDGE]}>
        <JudgeInviteAccept />
      </ProtectedRoute>
    ),
  },
  {
    path: "judge/decline",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.JUDGE]}>
        <JudgeInviteDecline />
      </ProtectedRoute>
    ),
  },

  { path: "unauthorized", element: <Unauthorized /> },
  {
    path: "verify-email",
    element: (
      <PublicRoute>
        <VerifyEmail />
      </PublicRoute>
    ),
  },
  {
    path: "reset-password",
    element: (
      <PublicRoute>
        <ResetPassword />
      </PublicRoute>
    ),
  },
  // Full-screen certificate template create page (outside MainLayout)
  {
    path: "organizer/contests/:contestId/certificates/templates/new",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
        <OrganizerCertificateTemplateCreate />
      </ProtectedRoute>
    ),
  },
  {
    path: "auto-evaluation/:contestId/:roundId",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
        <StudentAutoEvaluation />
      </ProtectedRoute>
    ),
  },
  {
    path: "mock-test/:contestId/:roundId",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
        <StudentMockTest />
      </ProtectedRoute>
    ),
  },
  // Full-screen certificate template edit page (outside MainLayout)
  {
    path: "organizer/contests/:contestId/certificates/templates/:templateId/edit",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
        <OrganizerCertificateTemplateEdit />
      </ProtectedRoute>
    ),
  },
  {
    element: <MainLayout />, // layout wrapper
    children: [
      { path: "/", element: <Home /> },
      { path: "about", element: <About /> },
      { path: "policy", element: <Policy /> },
      {
        path: "contests",
        element: <Contests />,
      },
      {
        path: "leaderboard",
        element: <Leaderboard />,
      },
      {
        path: "leaderboard/:contestId",
        element: <Leaderboard />,
      },
      {
        path: "mycontest",
        element: (
          <ProtectedRoute>
            <MyContest />
          </ProtectedRoute>
        ),
      },
      {
        path: "practice",
        element: (
          <ProtectedRoute>
            <Practice />
          </ProtectedRoute>
        ),
      },
      {
        path: "practice-detail/:practiceId",
        element: (
          <ProtectedRoute>
            <PracticeDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "practice-start/:practiceId",
        element: (
          <ProtectedRoute>
            <PracticeStart />
          </ProtectedRoute>
        ),
      },
      {
        path: "team",
        element: (
          <ProtectedRoute>
            <Team />
          </ProtectedRoute>
        ),
      },
      {
        path: "notifications",
        element: (
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        ),
      },
      {
        path: "notifications/team-invite/:notificationId",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <TeamInviteNotification />
          </ProtectedRoute>
        ),
      },
      {
        path: "help",
        element: (
          <ProtectedRoute>
            <Help />
          </ProtectedRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <ProtectedRoute>
            {" "}
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "appeal",
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute>
                <MentorAppeal />
              </ProtectedRoute>
            ),
          },
          {
            path: ":contestId",
            element: (
              <ProtectedRoute>
                <MentorAppeal />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "activity-logs",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <ActivityLogs />
          </ProtectedRoute>
        ),
      },
      {
        path: "user-management",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
            <UserManagement />
          </ProtectedRoute>
        ),
      },
      //staff routes
      {
        path: "province-staff",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.STAFF]}>
            <StaffProvinces />
          </ProtectedRoute>
        ),
      },
      {
        path: "school-staff",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.STAFF]}>
            <StaffSchools />
          </ProtectedRoute>
        ),
      },
      {
        path: "school-staff/:id",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.STAFF]}>
            <StaffSchoolCreationRequestDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "role-registrations-staff/:id",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.STAFF]}>
            <StaffRoleRegistrationDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "role-registrations-staff",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.STAFF]}>
            <StaffRoleRegistrations />
          </ProtectedRoute>
        ),
      },
      {
        path: "schools",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.STAFF]}>
            <StaffSchoolsManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: "contest-detail/:contestId",
        element: <ContestDetail />,
      },
      //Teams
      {
        path: "mentor-team/:contestId",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.MENTOR]}>
            <MentorTeam />
          </ProtectedRoute>
        ),
      },
      {
        path: "team-invite",
        element: <TeamInviteResponse />,
      },
      {
        path: "mcq-test/:contestId/:roundId",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <MCQTest />
          </ProtectedRoute>
        ),
      },
      {
        path: "manual-problem/:contestId/:roundId",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <StudentManualProblem />
          </ProtectedRoute>
        ),
      },
      {
        path: "manual-result/:contestId/:roundId",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <StudentManualResult />
          </ProtectedRoute>
        ),
      },

      {
        path: "auto-test-result/:contestId/:roundId",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <AutoTestResult />
          </ProtectedRoute>
        ),
      },
      {
        path: "contest-processing/:contestId",
        element: (
          <ProtectedRoute>
            <ContestProcessing />
          </ProtectedRoute>
        ),
      },

      //organizer routes
      {
        path: "organizer/dashboard",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
            <OrganizerDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "organizer/contests",
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <OrganizerContests />
              </ProtectedRoute>
            ),
          },
          {
            path: ":contestId",
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <OrganizerContestDetail />
              </ProtectedRoute>
            ),
          },
          // Judge invites (table)
          // {
          //   path: ":contestId/judges/invites",
          //   element: (
          //     <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
          //       <ContestJudgeInvitesPage />
          //     </ProtectedRoute>
          //   ),
          // },
          {
            path: "new",
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <CreateContest />
              </ProtectedRoute>
            ),
          },
          {
            path: ":contestId/edit",
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <EditContest />
              </ProtectedRoute>
            ),
          },

          // ROUNDS
          {
            path: ":contestId/rounds/new",
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <CreateRound />
              </ProtectedRoute>
            ),
          },
          {
            path: ":contestId/rounds/:roundId/edit",
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <EditRound />
              </ProtectedRoute>
            ),
          },
          {
            path: ":contestId/rounds/:roundId",
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <OrganizerRoundDetail />
              </ProtectedRoute>
            ),
          },

          //Multiple choice questions
          {
            path: ":contestId/rounds/:roundId/mcqs",
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <OrganizerMcq />
              </ProtectedRoute>
            ),
          },
          {
            path: ":contestId/rounds/:roundId/mcqs/new",
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <OrganizerMcqCreate />
              </ProtectedRoute>
            ),
          },
          {
            path: ":contestId/rounds/:roundId/attempts",
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <OrganizerMcqAttempts />
              </ProtectedRoute>
            ),
          },
          {
            path: ":contestId/rounds/:roundId/attempts/:attemptId",
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <OrganizerMcqAttemptDetail />
              </ProtectedRoute>
            ),
          },

          //Manual test flow
          {
            path: ":contestId/rounds/:roundId/manual/rubric",
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <ManualRubricPage />
              </ProtectedRoute>
            ),
          },
          {
            path: ":contestId/rounds/:roundId/manual/results",
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <ManualResultsPage />
              </ProtectedRoute>
            ),
          },
          {
            path: ":contestId/rounds/:roundId/manual-test/results/:submissionId",
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <ManualResultDetailPage />
              </ProtectedRoute>
            ),
          },

          {
            path: ":contestId/rounds/:roundId/problems/:problemId",
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <OrganizerProblemDetail />
              </ProtectedRoute>
            ),
          },

          // Auto evaluation
          {
            path: ":contestId/rounds/:roundId/auto-evaluation",
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <AutoEvaluationPage />
              </ProtectedRoute>
            ),
          },
          {
            path: ":contestId/rounds/:roundId/auto-evaluation/new",
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <AddTestCase />
              </ProtectedRoute>
            ),
          },
          {
            path: ":contestId/rounds/:roundId/auto-evaluation/:testCaseId/edit",
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <EditTestCase />
              </ProtectedRoute>
            ),
          },
          {
            path: ":contestId/rounds/:roundId/auto-evaluation/results",
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <AutoTestResultsPage />
              </ProtectedRoute>
            ),
          },
          {
            path: ":contestId/rounds/:roundId/auto-evaluation/results/:submissionId",
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <AutoResultDetail />
              </ProtectedRoute>
            ),
          },

          // Contest judges
          {
            path: ":contestId/judges",
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <JudgeInvitations />
              </ProtectedRoute>
            ),
          },
          {
            path: ":contestId/judges/active",
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <ActiveJudgesList />
              </ProtectedRoute>
            ),
          },
          {
            path: ":contestId/judges/invites",
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <ContestJudgeInvitesPage />
              </ProtectedRoute>
            ),
          },

          // Contest teams
          {
            path: ":contestId/teams",
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <OrganizerTeams />
              </ProtectedRoute>
            ),
          },
          {
            path: ":contestId/teams/:teamId",
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <OrganizerTeamDetail />
              </ProtectedRoute>
            ),
          },

          // Contest leaderboard
          {
            path: ":contestId/leaderboard",
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <OrganizerLeaderboard />
              </ProtectedRoute>
            ),
          },
          {
            path: ":contestId/leaderboard/teams/:teamId",
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <OrganizerLeaderboardTeam />
              </ProtectedRoute>
            ),
          },
          {
            path: ":contestId/leaderboard/teams/:teamId/members/:memberId",
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <OrganizerLeaderboardMember />
              </ProtectedRoute>
            ),
          },

          {
            path: ":contestId/certificates",
            children: [
              {
                index: true,
                element: (
                  <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                    <OrganizerCertificates />
                  </ProtectedRoute>
                ),
              },
              {
                path: "templates",
                element: (
                  <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                    <OrganizerCertificateTemplates />
                  </ProtectedRoute>
                ),
              },
              {
                path: "issued/students",
                element: (
                  <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                    <OrganizerIssuedStudentCertificates />
                  </ProtectedRoute>
                ),
              },
              {
                path: "issued/teams",
                element: (
                  <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                    <OrganizerIssuedTeamCertificates />
                  </ProtectedRoute>
                ),
              },
            ],
          },

          // Appeals
          {
            path: ":contestId/appeals",
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <OrganizerAppeals />
              </ProtectedRoute>
            ),
          },
          {
            path: ":contestId/appeals/:appealId",
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <OrganizerAppealDetail />
              </ProtectedRoute>
            ),
          },

          // Plagiarism
          {
            path: ":contestId/plagiarism",
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <OrganizerPlagiarismQueue />
              </ProtectedRoute>
            ),
          },
          {
            path: ":contestId/plagiarism/:submissionId",
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <OrganizerPlagiarismDetail />
              </ProtectedRoute>
            ),
          },

          // { path: ":contestId/activity", element: <OrganizerActivityLogs /> },
          // {
          //   path: ":contestId/notifications",
          //   element: (
          //     <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
          //       <OrganizerNotifications />
          //     </ProtectedRoute>
          //   ),
          // },
        ],
      },
      // {
      //   path: "organizer/provinces",
      //   element: (
      //     <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
      //       <OrganizerProvinces />
      //     </ProtectedRoute>
      //   ),
      // },
      // {
      //   path: "organizer/schools",
      //   element: (
      //     <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
      //       <OrganizerSchools />
      //     </ProtectedRoute>
      //   ),
      // },
      {
        path: "organizer/notifications",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
            <OrganizerNotifications />
          </ProtectedRoute>
        ),
      },

      //judge routes
      {
        path: "judge/manual-submissions",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.JUDGE]}>
            <JudgeManualSubmissionsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "judge/contests",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.JUDGE]}>
            <JudgeContestListPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "judge/contests/:contestId",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.JUDGE]}>
            <JudgeContestDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "judge/contests/:contestId/rounds/:roundId/submissions",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.JUDGE]}>
            <JudgeManualSubmissionsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "judge/contests/:contestId/rounds/:roundId/submissions/:submissionId/evaluation",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.JUDGE]}>
            <JudgeManualEvaluationsPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "certificate",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.STUDENT, ROLES.MENTOR]}>
            <StudentCertificate />
          </ProtectedRoute>
        ),
      },
      {
        path: "/quiz/:roundId/finish",
        element: <FinishQuiz />,
      },
      //SchoolManager routes
      {
        path: "school-requests",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.SCHOOL_MANAGER]}>
            <SchoolManager />
          </ProtectedRoute>
        ),
      },
      {
        path: "school-manager",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.SCHOOL_MANAGER]}>
            <MyManageSchool />
          </ProtectedRoute>
        ),
      },
      {
        path: "school-requests/create",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.SCHOOL_MANAGER]}>
            <CreateSchoolRequest />
          </ProtectedRoute>
        ),
      },
      {
        path: "school-requests/:id",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.SCHOOL_MANAGER]}>
            <SchoolCreationRequestDetail />
          </ProtectedRoute>
        ),
      },
      {
        path: "schools/:id",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.SCHOOL_MANAGER]}>
            <SchoolDetail />
          </ProtectedRoute>
        ),
      },
    ],
  },

  // Not found route
  { path: "*", element: <NotFound /> },
])

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <ModalProvider>
          <RouterProvider router={router} />
          <Toaster
            position="top-right"
            reverseOrder={false}
            containerStyle={{
              top: "80px", // height of your navbar
              right: "16px",
            }}
          />
        </ModalProvider>
      </AuthProvider>
    </Provider>
  </StrictMode>,
)
