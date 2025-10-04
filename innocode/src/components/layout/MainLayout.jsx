import { Outlet } from 'react-router-dom';
import Navbar from '../navbar/Navbar';
import Sidebar from '../sidebar/sidebar';
import './layout.css';
export default function MainLayout() {
  return (
    <div>
      <div className="layout ">
        <Navbar />
        <div className="main-content ">
          <div className="flex">
            <div className="w-64">
              <Sidebar />
            </div>
            <div className="page-content ">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
