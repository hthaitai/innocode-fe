import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import { useAuth } from '@/context/AuthContext';
import './layout.css';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    const content = document.querySelector('.page-content');
    if (content) {
      content.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [pathname]);

  return null;
}

export default function MainLayout() {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Define public routes that should not show sidebar
  const publicRoutes = ['/', '/about'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  // Hide sidebar if not authenticated OR on public routes
  const hideSidebar = !isAuthenticated || isPublicRoute;

  return (
    <div>
      <Navbar />
      <div className={`main-content ${hideSidebar ? 'no-sidebar' : ''}`}>
        {!hideSidebar && (
          <div className="page-sidebar">
            <Sidebar />
          </div>
        )}

        <div className="page-content">
          {/* 👇 This ensures scroll resets on every route change */}
          <ScrollToTop />

          <div className="content-wrapper">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
