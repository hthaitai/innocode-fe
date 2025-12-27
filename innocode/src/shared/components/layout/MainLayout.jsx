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
  const { user, isAuthenticated } = useAuth();

  // Define public routes that should not show sidebar
  const publicRoutes = ['/', '/about'];
  const isPublicRoute = publicRoutes.includes(location.pathname);

  // Define routes that should hide sidebar (like auto-evaluation)
  const hideSidebarRoutes = ['/auto-evaluation'];
  const shouldHideSidebar = hideSidebarRoutes.some(route => 
    location.pathname.includes(route) && user?.role !== 'organizer'
  );

  // Hide sidebar if not authenticated OR on public routes OR on specific routes
  const hideSidebar = !isAuthenticated || isPublicRoute || shouldHideSidebar;

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
