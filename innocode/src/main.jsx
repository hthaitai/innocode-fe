import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import MainLayout from "./shared/components/layout/MainLayout"
// Common pages
import Home from "./features/common/pages/Home"
import About from "./features/common/pages/About"
import Profile from "./features/common/pages/Profile"
import Dashboard from "./features/common/pages/Dashboard"
import Announcements from "./features/common/pages/Announcements"
// Student pages
import Contests from "./features/student/pages/Contests"
import ContestDetail from "./features/student/pages/ContestDetail"
import ContestProcessing from "./features/student/pages/ContestProcessing"
import Practice from "./features/student/pages/Practice"
import Team from "./features/student/pages/Team"
import Leaderboard from "./features/student/pages/Leaderboard"
import Help from "./features/student/pages/Help"
// Auth
import Login from "./features/auth/components/Login"
import { ModalProvider } from "./context/ModalContext"
import { AuthProvider } from "./context/AuthContext"
// Organizer pages
import OrganizerContests from "./features/organizer/contest/pages/OrganizerContests"
import OrganizerContestDetail from "./features/organizer/contest/pages/OrganizerContestDetail"
import OrganizerRoundDetail from "./features/organizer/contest/subfeatures/rounds/pages/OrganizerRoundDetail"
import OrganizerProblemDetail from "./features/organizer/contest/subfeatures/problems/pages/OrganizerProblemDetail"
import OrganizerTeams from "./features/organizer/contest/subfeatures/teams/pages/OrganizerTeams"
import OrganizerTeamDetail from "./features/organizer/contest/subfeatures/teams/pages/OrganizerTeamDetail"
import OrganizerLeaderboard from "./features/organizer/contest/subfeatures/leaderboard/pages/OrganizerLeaderboard"
import OrganizerCertificates from "./features/organizer/contest/subfeatures/certificates/pages/OrganizerCertificates"
import OrganizerAppeals from "./features/organizer/contest/subfeatures/appeals/pages/OrganizerAppeals"
import OrganizerAppealDetail from "./features/organizer/contest/subfeatures/appeals/pages/OrganizerAppealDetail"
import OrganizerActivityLogs from "./features/organizer/contest/subfeatures/activity-logs/pages/OrganizerActivityLogs"
import OrganizerNotifications from "./features/organizer/contest/subfeatures/notifications/pages/OrganizerNotifications"
import OrganizerProvinces from "./features/organizer/province/pages/OrganizerProvinces"
import OrganizerSchools from "./features/organizer/school/pages/OrganizerSchools"
import { Provider } from "react-redux"
import { store } from "./store/store"

const router = createBrowserRouter([
  { path: "login", element: <Login /> },
  {
    element: <MainLayout />, // layout wrapper
    children: [
      { index: true, element: <Home /> },
      { path: "contests", element: <Contests /> },
      { path: "leaderboard", element: <Leaderboard /> },
      { path: "about", element: <About /> },
      { path: "practice", element: <Practice /> },
      { path: "team", element: <Team /> },
      { path: "announcements", element: <Announcements /> },
      { path: "help", element: <Help /> },
      { path: "profile", element: <Profile /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "contest-detail/:contestId", element: <ContestDetail /> },
      { path: "contest-processing/:contestId", element: <ContestProcessing /> },
      {
        path: "organizer/contests",
        children: [
          { index: true, element: <OrganizerContests /> },
          { path: ":contestId", element: <OrganizerContestDetail /> },

          {
            path: ":contestId/rounds/:roundId",
            element: <OrganizerRoundDetail />,
          },
          {
            path: ":contestId/rounds/:roundId/problems/:problemId",
            element: <OrganizerProblemDetail />,
          },

          { path: ":contestId/teams", element: <OrganizerTeams /> },
          {
            path: ":contestId/teams/:teamId",
            element: <OrganizerTeamDetail />,
          },

          { path: ":contestId/leaderboard", element: <OrganizerLeaderboard /> },
          {
            path: ":contestId/certificates",
            element: <OrganizerCertificates />,
          },

          { path: ":contestId/appeals", element: <OrganizerAppeals /> },
          {
            path: ":contestId/appeals/:appealId",
            element: <OrganizerAppealDetail />,
          },

          { path: ":contestId/activity", element: <OrganizerActivityLogs /> },
          {
            path: ":contestId/notifications",
            element: <OrganizerNotifications />,
          },
        ],
      },
      {
        path: "organizer/provinces",
        element: <OrganizerProvinces />,
      },
      {
        path: "organizer/schools",
        element: <OrganizerSchools />,
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
