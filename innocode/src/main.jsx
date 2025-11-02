import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import MainLayout from "./shared/components/layout/MainLayout"
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
import Team from "./features/contest/student/Team"
import Leaderboard from "./features/contest/student/Leaderboard"
import Help from "./features/contest/student/Help"
// Auth
import Login from "./features/auth/components/Login"
import { ModalProvider } from "./context/ModalContext"
import { AuthProvider, ROLES } from "./context/AuthContext"
import OrganizerContests from "./features/contest/pages/organizer/OrganizerContests"
import OrganizerContestDetail from "./features/contest/pages/organizer/OrganizerContestDetail"
import OrganizerRoundDetail from "./features/round/pages/organizer/OrganizerRoundDetail"
import OrganizerProblemDetail from "./features/problem/pages/organizer/OrganizerProblemDetail"
import OrganizerTeams from "./features/team/pages/organizer/OrganizerTeams"
import OrganizerTeamDetail from "./features/team/pages/organizer/OrganizerTeamDetail"
import OrganizerLeaderboard from "./features/leaderboard/pages/organizer/OrganizerLeaderboard"
import OrganizerCertificates from "./features/certificate/pages/organizer/OrganizerCertificates"
import OrganizerAppeals from "./features/appeal/pages/organizer/OrganizerAppeals"
import OrganizerAppealDetail from "./features/appeal/pages/organizer/OrganizerAppealDetail"
import OrganizerProvinces from "./features/province/pages/organizer/OrganizerProvinces"
import OrganizerSchools from "./features/school/pages/organizer/OrganizerSchools"
import OrganizerNotifications from "./features/notification/pages/organizer/OrganizerNotifications"
import ProtectedRoute from "./shared/components/auth/ProtectedRoute"
// Organizer pages

const router = createBrowserRouter([
  { path: "login", element: <Login /> },
  { path: "unauthorized", element: <Unauthorized /> },
  {
    element: <MainLayout />, // layout wrapper
    children: [
      { index: true, element: <Home /> },
      { path: "about", element: <About /> },
      {
        path: "contests",
        element: (
          <ProtectedRoute>
            <Contests />
          </ProtectedRoute>
        ),
      },
      {
        path: "leaderboard",
        element: (
          <ProtectedRoute>
            <Leaderboard />
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
        path: "dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },

      {
        path: "contest-detail/:contestId",
        element: (
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <ContestDetail />
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

          {
            path: ":contestId/rounds/:roundId",
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <OrganizerRoundDetail />
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

          {
            path: ":contestId/leaderboard",
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <OrganizerLeaderboard />
              </ProtectedRoute>
            ),
          },
          {
            path: ":contestId/certificates",
            element: (
              <ProtectedRoute allowedRoles={[ROLES.ORGANIZER]}>
                <OrganizerCertificates />
              </ProtectedRoute>
            ),
          },

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
    ],
  },
])

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <ModalProvider>
          <RouterProvider router={router} />
        </ModalProvider>
      </AuthProvider>
    </Provider>
  </StrictMode>
)
