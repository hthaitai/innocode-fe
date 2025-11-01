import { Outlet, useLocation } from "react-router-dom"
import { useEffect } from "react"
import Navbar from "../navbar/Navbar"
import Sidebar from "../sidebar/Sidebar"
import "./layout.css"

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    const content = document.querySelector(".page-content")
    if (content) {
      content.scrollTo({ top: 0, behavior: "instant" })
    }
  }, [pathname])

  return null
}

export default function MainLayout() {
  const location = useLocation()
  const isLoggedIn = !!localStorage.getItem("token")
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
          {/* 👇 This ensures scroll resets on every route change */}
          <ScrollToTop />

          <div className="content-wrapper">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
