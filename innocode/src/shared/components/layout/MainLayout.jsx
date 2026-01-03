import { Outlet, useLocation } from "react-router-dom"
import { useEffect } from "react"
import Navbar from "../navbar/Navbar"
import Sidebar from "../sidebar/Sidebar"
import { useAuth } from "@/context/AuthContext"

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" })
  }, [pathname])

  return null
}

export default function MainLayout() {
  const location = useLocation()
  const { user, isAuthenticated } = useAuth()

  // Define public routes that should not show sidebar
  const publicRoutes = ["/", "/about", "/leaderboard", "/policy"]
  const isPublicRoute = publicRoutes.includes(location.pathname)

  // Define routes that should hide sidebar (like auto-evaluation)
  const hideSidebarRoutes = ["/auto-evaluation"]
  const shouldHideSidebar = hideSidebarRoutes.some(
    (route) => location.pathname.includes(route) && user?.role !== "organizer"
  )

  // Hide sidebar if not authenticated OR on public routes OR on specific routes
  const hideSidebar = !isAuthenticated || isPublicRoute || shouldHideSidebar

  return (
    <div>
      <Navbar />
      <div
        className={`flex mt-16 min-h-[calc(100vh-64px)] ${
          hideSidebar ? "ml-0" : "ml-[312px]"
        }`}
      >
        {!hideSidebar && (
          <div className="z-25 bg-[#F3F3F3] fixed top-16 left-0 w-[312px] h-[calc(100vh-64px)] p-4 box-border">
            <Sidebar />
          </div>
        )}

        <div className="flex-1 px-5 pb-5 relative">
          {/* 👇 This ensures scroll resets on every route change */}
          <ScrollToTop />

          <div>
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
