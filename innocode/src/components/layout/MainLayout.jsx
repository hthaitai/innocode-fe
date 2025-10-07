import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import Sidebar from '../sidebar/Sidebar';
import './layout.css';
export default function MainLayout() {
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem('token'); // hoặc state context nếu có

  // Ẩn sidebar nếu chưa đăng nhập, hoặc đang ở trang home
  const hideSidebar = !isLoggedIn ;

  return (
    <div>
      <div className="layout ">
        <Navbar />
        <div className="main-content ">
          <div className="flex">
            {!hideSidebar && (
              <div className="w-64">
                <Sidebar />
              </div>
            )}
            <div className="page-content flex-1">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
