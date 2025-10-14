import { Outlet, useLocation } from "react-router-dom"
import Navbar from "../navbar/Navbar"
import Sidebar from "../sidebar/Sidebar"
import "./layout.css"
export default function MainLayout() {
  const location = useLocation()
  const isLoggedIn = !!localStorage.getItem("token") // hoặc state context nếu có

  // Ẩn sidebar nếu chưa đăng nhập, hoặc đang ở trang home
  const hideSidebar = !isLoggedIn

  return (
    <div>
      <Navbar />
      <div className="main-content">
        {!hideSidebar && (
          <div className="page-sidebar">
            <Sidebar />
          </div>
        )}
        <div className="page-content">
          <div className="content-wrapper">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
