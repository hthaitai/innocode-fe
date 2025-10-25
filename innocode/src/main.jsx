import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import MainLayout from "./components/layout/MainLayout"
// Common pages
import Home from "./pages/common/Home"
import About from "./pages/common/About"
import Profile from "./pages/common/Profile"
import Dashboard from "./pages/common/Dashboard"
import Announcements from "./pages/common/Announcements"
// Student pages
import Contests from "./pages/student/Contests"
import ContestDetail from "./pages/student/ContestDetail"
import ContestProcessing from "./pages/student/ContestProcessing"
import Practice from "./pages/student/Practice"
import Team from "./pages/student/Team"
import Leaderboard from "./pages/student/Leaderboard"
import Help from "./pages/student/Help"
// Organizer pages
import OrganizerContests from "./pages/organizer/OrganizerContests"
import OrganizerContestDetail from "./pages/organizer/OrganizerContestDetail"
// Auth
import Login from "./components/authenticate/Login"
import OrganizerTeams from "./pages/organizer/OrganizerTeams"
import OrganizerLeaderboard from "./pages/organizer/OrganizerLeaderboard"
import OrganizerCertificates from "./pages/organizer/OrganizerCertificates"
import OrganizerAppeals from "./pages/organizer/OrganizerAppeals"
import OrganizerActivityLogs from "./pages/organizer/OrganizerActivityLogs"
import OrganizerNotifications from "./pages/organizer/OrganizerNotifications"
import OrganizerRoundDetail from "./pages/organizer/OrganizerRoundDetail"
import OrganizerProblemDetail from "./pages/organizer/OrganizerProblemDetail"
import { ModalProvider } from "./context/ModalContext"
import OrganizerProvinces from "./pages/organizer/OrganizerProvinces"
import OrganizerSchools from "./pages/organizer/OrganizerSchools"

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
          { path: ":contestId/leaderboard", element: <OrganizerLeaderboard /> },
          {
            path: ":contestId/certificates",
            element: <OrganizerCertificates />,
          },
          { path: ":contestId/appeals", element: <OrganizerAppeals /> },
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
        element: <OrganizerSchools />
      }
    ],
  },
])

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ModalProvider>
      <RouterProvider router={router} />
    </ModalProvider>
  </StrictMode>
)
