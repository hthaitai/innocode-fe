import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Contests from './pages/Contests';
import Leaderboard from './pages/Leaderboard';
import About from './pages/About';
import Login from './components/authenticate/Login';
const router = createBrowserRouter([
  {
    element: <MainLayout />, // layout wrapper
    children: [
      { index: true, element: <Home /> },
      { path: 'contests', element: <Contests /> },
      { path: 'leaderboard', element: <Leaderboard /> },
      { path: 'about', element: <About /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
