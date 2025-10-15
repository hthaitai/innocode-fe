import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
// Common pages
import Home from './pages/common/Home';
import About from './pages/common/About';
import Profile from './pages/common/Profile';
import Dashboard from './pages/common/Dashboard';
import Announcements from './pages/common/Announcements';
// Student pages
import Contests from './pages/student/Contests';
import ContestDetail from './pages/student/ContestDetail';
import ContestProcessing from './pages/student/ContestProcessing';
import Practice from './pages/student/Practice';
import Team from './pages/student/Team';
import Leaderboard from './pages/student/Leaderboard';
import Help from './pages/student/Help';
// Organizer pages
import OrganizerContests from './pages/organizer/OrganizerContests';
// Auth
import Login from './components/authenticate/Login';
const router = createBrowserRouter([
  { path: 'login', element: <Login /> },
  {
    element: <MainLayout />, // layout wrapper
    children: [
      { index: true, element: <Home /> },
      { path: 'contests', element: <Contests /> },
      { path: 'organizer/contests', element: <OrganizerContests /> },
      { path: 'leaderboard', element: <Leaderboard /> },
      { path: 'about', element: <About /> },
      { path: 'practice', element: <Practice /> },
      { path: 'team', element: <Team /> },
      { path: 'announcements', element: <Announcements /> },
      { path: 'help', element: <Help /> },
      { path: 'profile', element: <Profile /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'contest-detail/:contestId', element: <ContestDetail /> },
      { path: 'contest-processing/:contestId', element: <ContestProcessing /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
