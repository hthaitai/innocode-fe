import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Contests from './pages/Contests';
import Leaderboard from './pages/Leaderboard';
import About from './pages/About';
import Practice from './pages/Practice';
import Team from './pages/Team';
import Announcements from './pages/Announcements';
import Help from './pages/Help';
import Login from './components/authenticate/Login';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import ContestDetail from './pages/ContestDetail';
const router = createBrowserRouter([
  { path: 'login', element: <Login /> },
  {
    element: <MainLayout />, // layout wrapper
    children: [
      { index: true, element: <Home /> },
      { path: 'contests', element: <Contests /> },
      { path: 'leaderboard', element: <Leaderboard /> },
      { path: 'about', element: <About /> },
      { path: 'practice', element: <Practice /> },
      { path: 'team', element: <Team /> },
      { path: 'announcements', element: <Announcements /> },
      { path: 'help', element: <Help /> },
      { path: 'profile', element: <Profile /> },
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'contest-detail/:contestId', element: <ContestDetail /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
