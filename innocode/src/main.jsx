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
import { AuthProvider } from "./context/AuthContext"
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
import OrganizerNotifications from "./features/notification/pages/organizer/OrganizerNotifications"
import OrganizerProvinces from "./features/province/pages/organizer/OrganizerProvinces"
import OrganizerSchools from "./features/school/pages/organizer/OrganizerSchools"
// Organizer pages


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

          // { path: ":contestId/activity", element: <OrganizerActivityLogs /> },
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
