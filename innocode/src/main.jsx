import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import MainLayout from "./shared/components/layout/MainLayout"
import AuthLayout from "./shared/components/layout/AuthLayout"
import { Provider } from "react-redux"
import { store } from "./store/store"
// Common pages
import Home from "./features/common/pages/Home"
import About from "./features/common/pages/About"
import Profile from "./features/common/pages/Profile"
import Dashboard from "./features/common/pages/Dashboard"
import Announcements from "./features/common/pages/Announcements"
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
// Auth
import ManualRubricPage from "./features/problems/manual/pages/ManualRubricPage"
import ManualResultsPage from "./features/problems/manual/pages/ManualResultsPage"
import AutoEvaluationPage from "./features/problems/auto-evaluation/pages/AutoEvaluationPage"
import AutoTestResultsPage from "./features/problems/auto-evaluation/pages/AutoTestResultsPage"
import Login from "./features/auth/components/Login"
import Register from "./features/auth/components/Register"
import { ModalProvider } from "./context/ModalContext"
import { AuthProvider, ROLES } from "./context/AuthContext"
import OrganizerContests from "./features/contest/pages/organizer/OrganizerContests"
import OrganizerContestDetail from "./features/contest/pages/organizer/OrganizerContestDetail"
import ContestJudgeInvitesPage from "./features/invite-judge/pages/ContestJudgeInvitesPage"
import OrganizerRoundDetail from "./features/round/pages/organizer/OrganizerRoundDetail"
import CreateRound from "./features/round/pages/organizer/CreateRound"
import EditRound from "./features/round/pages/organizer/EditRound"
import OrganizerProblemDetail from "./features/problem/pages/organizer/OrganizerProblemDetail"
import OrganizerTeams from "./features/team/pages/organizer/OrganizerTeams"
import OrganizerTeamDetail from "./features/team/pages/organizer/OrganizerTeamDetail"
import OrganizerLeaderboard from "./features/leaderboard/pages/organizer/OrganizerLeaderboard"
import OrganizerCertificates from "./features/certificate/pages/organizer/OrganizerCertificates"
import OrganizerCertificateTemplateCreate from "./features/certificate/pages/organizer/OrganizerCertificateTemplateCreate"
import OrganizerAppeals from "./features/appeal/pages/organizer/OrganizerAppeals"
import OrganizerAppealDetail from "./features/appeal/pages/organizer/OrganizerAppealDetail"
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
import EditTestCasePage from "./features/problems/auto-evaluation/pages/EditTestCasePage"

// Judge pages
import JudgeManualRubricPage from "./features/submission/pages/judge/JudgeManualRubricPage"
import JudgeManualResultsPage from "./features/submission/pages/judge/JudgeManualResultsPage"
import JudgeManualSubmissionsPage from "./features/submission/pages/judge/JudgeManualSubmissionsPage" // new page for pending submissions list
import JudgeManualEvaluationsPage from "./features/submission/pages/judge/JudgeManualEvaluationsPage"

import Leaderboard from "./features/leaderboard/pages/student/Leaderboard"
import OrganizerLeaderboardDetail from "./features/leaderboard/pages/organizer/OrganizerLeaderboardDetail"
import OrganizerLeaderboardMemberDetail from "./features/leaderboard/pages/organizer/OrganizerLeaderboardMemberDetail"
import NotFound from "./pages/NotFound"
import StaffProvinces from "./features/province/pages/staff/StaffProvinces"
import StaffSchools from "./features/school/pages/staff/StaffSchools"
import ContestJudgesPage from "./features/contest/pages/organizer/ContestJudgesPage"
import StudentCertificate from "./features/certificate/pages/student/StudentCertificate"
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
    ],
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
    element: <MainLayout />, // layout wrapper
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
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
        path: "announcements",
        element: (
          <ProtectedRoute>
            <Announcements />
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
        element: (
          <ProtectedRoute>
            <MentorAppeal />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
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
        path: "auto-evaluation/:contestId/:roundId",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <StudentAutoEvaluation />
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
          {
            path: ":contestId/judges/invites",
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <ContestJudgeInvitesPage />
              </ProtectedRoute>
            ),
          },
          {
            path: "add",
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
                <EditTestCasePage />
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

          // Contest judges
          {
            path: ":contestId/judges",
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <ContestJudgesPage />
              </ProtectedRoute>
            ),
          },
          {
            path: ":contestId/judges",
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <ContestJudgeInvitesPage />
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
                <OrganizerLeaderboardDetail />
              </ProtectedRoute>
            ),
          },
          {
            path: ":contestId/leaderboard/teams/:teamId/members/:memberId",
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <OrganizerLeaderboardMemberDetail />
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
              // {
              //   path: "templates/new",
              //   element: (
              //     <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
              //       <OrganizerCertificateTemplateCreate />
              //     </ProtectedRoute>
              //   ),
              // },
            ],
          },

          // Appeals
          {
            path: ":contestId/rounds/:roundId/appeals",
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <OrganizerAppeals />
              </ProtectedRoute>
            ),
          },
          {
            path: ":contestId/rounds/:roundId/appeals/:appealId",
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <OrganizerAppealDetail />
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
      {
        path: "organizer/provinces",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
            <OrganizerProvinces />
          </ProtectedRoute>
        ),
      },
      {
        path: "organizer/schools",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
            <OrganizerSchools />
          </ProtectedRoute>
        ),
      },
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
        path: "judge/manual-submissions/:submissionId/rubric-evaluation",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.JUDGE]}>
            <JudgeManualEvaluationsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "judge/manual-submissions/:submissionId/results",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.JUDGE]}>
            <JudgeManualResultsPage />
          </ProtectedRoute>
        ),
      },

      {
        path: "certificate",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <StudentCertificate />
          </ProtectedRoute>
        ),
      },
      {
        path: "/quiz/:roundId/finish",
        element: <FinishQuiz />,
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
          <Toaster position="top-right" reverseOrder={false} />
        </ModalProvider>
      </AuthProvider>
    </Provider>
  </StrictMode>
)
