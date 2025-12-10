import { Outlet, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import Navbar from '../navbar/Navbar';
import './layout.css';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);

  return null;
}

export default function HomeLayout() {
  return (
    <div className="home-layout">
      <Navbar />
      <ScrollToTop />
      <div className="home-content">
        <Outlet />
      </div>
    </div>
  );
}

