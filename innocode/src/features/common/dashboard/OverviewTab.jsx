import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Trophy, Users, UsersRound, TrendingUp, Calendar } from "lucide-react"
import { useGetDashboardMetricsQuery } from "@/services/dashboardApi"
import { useDashboardSignalR } from "@/shared/hooks/useDashboardSignalR"
import { TimeRangePredefined } from "./TimeRangeFilter"
import DashboardTimeRangeFilter from "@/features/dashboard/components/organizer/DashboardTimeRangeFilter"
import toast from "react-hot-toast"
import "@/styles/typography.css"

const OverviewTab = () => {
  const { t } = useTranslation(["pages", "common"])

  // Time range state
  const [timeRange, setTimeRange] = useState(TimeRangePredefined.AllTime)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  // Tooltip state
  const [hoveredStatus, setHoveredStatus] = useState(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  // Fetch data with time range parameters
  const {
    data: metrics,
    isLoading,
    error,
    refetch,
  } = useGetDashboardMetricsQuery({
    timeRangePredefined: timeRange,
    startDate: timeRange === TimeRangePredefined.Custom ? startDate : undefined,
    endDate: timeRange === TimeRangePredefined.Custom ? endDate : undefined,
  })

  // Debug logging
  React.useEffect(() => {
    console.log("📊 Dashboard API Request:", {
      timeRangePredefined: timeRange,
      startDate:
        timeRange === TimeRangePredefined.Custom ? startDate : undefined,
      endDate: timeRange === TimeRangePredefined.Custom ? endDate : undefined,
    })
    if (error) {
      console.error("❌ Dashboard API Error:", error)
    }
  }, [timeRange, startDate, endDate, error])

  // SignalR Handler
  const handleSignalRUpdate = (eventName, data) => {
    // Refresh data
    refetch()

    // Show notification based on event
    // The user's log shows lowercase keys: {message: '...', timestamp: '...'}
    const message = data?.message || data?.Message
    const timestamp = data?.timestamp || data?.Timestamp

    if (import.meta.env.VITE_ENV === "development" && timestamp) {
      console.log(`🕒 Event timestamp: ${new Date(timestamp).toLocaleString()}`)
    }

    switch (eventName) {
      case "ContestCreated":
        toast.success(message || t("dashboard.notifications.contestCreated"), {
          icon: "🎉",
        })
        break
      case "TeamRegistered":
        toast.success(message || t("dashboard.notifications.teamRegistered"), {
          icon: "👥",
        })
        break
      case "ContestStatusChanged":
        // Correcting toast.info -> toast() as react-hot-toast doesn't have .info
        toast(message || t("dashboard.notifications.statusChanged"), {
          icon: "📝",
        })
        break
      case "CertificateIssued":
        toast.success(
          message || t("dashboard.notifications.certificateIssued"),
          {
            icon: "🏆",
          },
        )
        break
      default:
        break
    }
  }

  // SignalR for real-time updates
  const { isConnected } = useDashboardSignalR(handleSignalRUpdate)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-body-1 text-gray-600">
          {t("common.loading", "Loading...")}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-body-1 text-red-600">
          {t("common.error", "Error loading dashboard metrics")}
        </div>
      </div>
    )
  }

  // Handle statusBreakdown - convert object to array if needed
  let statusBreakdown = []
  if (metrics?.statusBreakdown) {
    if (Array.isArray(metrics.statusBreakdown)) {
      statusBreakdown = metrics.statusBreakdown
    } else if (typeof metrics.statusBreakdown === "object") {
      // Convert object to array format: { "Ongoing": 5, "Draft": 3 } => [{ status: "Ongoing", count: 5 }, ...]
      statusBreakdown = Object.entries(metrics.statusBreakdown).map(
        ([status, count]) => ({
          status,
          count,
        }),
      )
    }
  }

  // Filter out totalValidContests as it's a summary metric, not a specific status
  statusBreakdown = statusBreakdown.filter(
    (item) => item.status.toLowerCase() !== "totalvalidcontests",
  )

  const totalStatuses = statusBreakdown.reduce(
    (sum, item) => sum + item.count,
    0,
  )

  // Calculate growth rate percentage
  const growthRate = metrics?.contestGrowthRate || 0
  const isPositiveGrowth = growthRate >= 0

  // Function to translate status
  const translateStatus = (status) => {
    const statusKey = status.toLowerCase().replace(/\s+/g, "")
    return t(`contest.statusLabels.${statusKey}`, status)
  }

  // Handle mouse move for tooltip positioning
  const handleMouseMove = (e, status) => {
    const rect = e.currentTarget.getBoundingClientRect()
    setTooltipPosition({
      x: e.clientX,
      y: rect.top - 10,
    })
    setHoveredStatus(status)
  }

  return (
    <div className="space-y-6">
      {/* Time Range Filter & Hub Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <DashboardTimeRangeFilter
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />

        {/* Hub Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E5E5E5] rounded-[5px]">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-500 animate-pulse" : "bg-gray-300"
            }`}
          />
          <span className="text-caption-1 text-gray-600">
            {isConnected
              ? t("dashboard.status.live", "Live Updates")
              : t("dashboard.status.offline", "Offline")}
          </span>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Total Contests Card */}
        <div className="bg-white border border-[#E5E5E5] rounded-[5px] p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
              <Trophy className="w-5 h-5 text-orange-500" />
            </div>
            <span className="text-caption-1 text-gray-600">
              {t("dashboard.overview.totalContests", "Total Contests")}
            </span>
          </div>
          <div className="text-title-2 text-gray-800">
            {metrics?.totalContests || 0}
          </div>
        </div>

        {/* Total Teams Card */}
        <div className="bg-white border border-[#E5E5E5] rounded-[5px] p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
              <UsersRound className="w-5 h-5 text-blue-500" />
            </div>
            <span className="text-caption-1 text-gray-600">
              {t("dashboard.overview.totalTeams", "Total Teams")}
            </span>
          </div>
          <div className="text-title-2 text-gray-800">
            {metrics?.totalTeams || 0}
          </div>
        </div>

        {/* Total Students Card */}
        <div className="bg-white border border-[#E5E5E5] rounded-[5px] p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-500" />
            </div>
            <span className="text-caption-1 text-gray-600">
              {t("dashboard.overview.totalStudents", "Total Students")}
            </span>
          </div>
          <div className="text-title-2 text-gray-800">
            {metrics?.totalStudents || 0}
          </div>
        </div>
      </div>

      {/* Contest Growth Rate Section */}
      <div className="bg-white border border-[#E5E5E5] rounded-[5px] p-5">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-gray-700" />
          <h3 className="text-subtitle-2 text-gray-800">
            {t("dashboard.overview.contestGrowthRate", "Contest Growth Rate")}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Growth Rate Card */}
          <div className="border border-gray-200 rounded-[5px] p-4">
            <div className="text-caption-1 text-gray-600 mb-2">
              {t("dashboard.overview.growthComparison", "vs 2 months ago")}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-title-1 text-gray-800">
                {Math.abs(growthRate).toFixed(1)}%
              </span>
              <span
                className={`text-body-1-strong ${
                  isPositiveGrowth ? "text-green-600" : "text-red-600"
                }`}
              >
                {isPositiveGrowth ? "↑" : "↓"}
              </span>
            </div>
            <div className="text-caption-1 text-gray-500 mt-1">
              {isPositiveGrowth
                ? t("dashboard.overview.increase", "Increase")
                : t("dashboard.overview.decrease", "Decrease")}
            </div>
          </div>

          {/* New Contests Last Month Card */}
          <div className="border border-gray-200 rounded-[5px] p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-gray-600" />
              <div className="text-caption-1 text-gray-600">
                {t(
                  "dashboard.overview.newContestsLastMonth",
                  "New Contests Last Month",
                )}
              </div>
            </div>
            <div className="text-title-1 text-gray-800">
              {metrics?.newContestsLastMonth || 0}
            </div>
            <div className="text-caption-1 text-gray-500 mt-1">
              {t("dashboard.overview.contests", "contests")}
            </div>
          </div>
        </div>
      </div>

      {/* Contest Status Breakdown */}
      <div className="bg-white border border-[#E5E5E5] rounded-[5px] p-5">
        <h3 className="text-subtitle-2 text-gray-800 mb-4">
          {t(
            "dashboard.overview.contestStatusBreakdown",
            "Contest Status Breakdown",
          )}
        </h3>

        {/* Horizontal Stacked Bar Chart */}
        <div className="space-y-4">
          <div className="relative flex items-center h-8 rounded-[5px] overflow-hidden">
            {statusBreakdown.map((status, index) => {
              const percentage =
                totalStatuses > 0 ? (status.count / totalStatuses) * 100 : 0

              // Color mapping for different statuses - exact match for unique colors
              const getStatusColor = (statusName) => {
                const name = statusName.toLowerCase()
                if (name === "published") return "bg-purple-500"
                if (name === "registrationopen") return "bg-cyan-500"
                if (name === "registrationclosed") return "bg-slate-500"
                if (name === "ongoing") return "bg-green-500"
                if (name === "paused") return "bg-yellow-500"
                if (name === "completed") return "bg-blue-500"
                if (name === "delayed") return "bg-orange-500"
                if (name === "draft") return "bg-gray-400"
                if (name === "cancelled") return "bg-red-500"
                if (name === "totalvalidcontests") return "bg-indigo-500"
                return "bg-pink-500" // fallback
              }

              return (
                <div
                  key={index}
                  className={`h-full ${getStatusColor(
                    status.status,
                  )} transition-all hover:opacity-80 cursor-pointer`}
                  style={{ width: `${percentage}%` }}
                  onMouseMove={(e) => handleMouseMove(e, status)}
                  onMouseLeave={() => setHoveredStatus(null)}
                />
              )
            })}

            {/* Custom Tooltip */}
            {hoveredStatus && (
              <div
                className="fixed bg-white border border-gray-200 rounded-[5px] p-3 shadow-lg z-50 pointer-events-none"
                style={{
                  left: `${tooltipPosition.x}px`,
                  top: `${tooltipPosition.y}px`,
                  transform: "translate(-50%, -100%)",
                }}
              >
                <p className="text-caption-1-strong text-gray-800 mb-1 whitespace-nowrap">
                  {translateStatus(hoveredStatus.status)}
                </p>
                <p className="text-caption-1 text-gray-600 whitespace-nowrap">
                  {hoveredStatus.count}{" "}
                  {t("dashboard.overview.contests", "contests")}
                </p>
              </div>
            )}
          </div>

          {/* Legend */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {statusBreakdown.map((status, index) => {
              const getStatusColor = (statusName) => {
                const name = statusName.toLowerCase()
                if (name === "published") return "bg-purple-500"
                if (name === "registrationopen") return "bg-cyan-500"
                if (name === "registrationclosed") return "bg-slate-500"
                if (name === "ongoing") return "bg-green-500"
                if (name === "paused") return "bg-yellow-500"
                if (name === "completed") return "bg-blue-500"
                if (name === "delayed") return "bg-orange-500"
                if (name === "draft") return "bg-gray-400"
                if (name === "cancelled") return "bg-red-500"
                if (name === "totalvalidcontests") return "bg-indigo-500"
                return "bg-pink-500"
              }

              return (
                <div key={index} className="flex items-center gap-2">
                  <div
                    className={`w-3 h-3 rounded-sm ${getStatusColor(
                      status.status,
                    )}`}
                  />
                  <div className="flex gap-2">
                    <span className="text-caption-1-strong text-gray-800">
                      {translateStatus(status.status)} :
                    </span>
                    <span className="text-caption-1 text-gray-600">
                      {status.count}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OverviewTab
