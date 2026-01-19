import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import {
  BarChart3,
  TrendingUp,
  PieChart as PieChartIcon,
  LayoutPanelLeft,
} from "lucide-react"
import { useGetDashboardChartsQuery } from "@/services/dashboardApi"
import { useDashboardSignalR } from "@/shared/hooks/useDashboardSignalR"
import { TimeRangePredefined } from "./TimeRangeFilter"
import DashboardTimeRangeFilter from "@/features/dashboard/components/organizer/DashboardTimeRangeFilter"
import toast from "react-hot-toast"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import "@/styles/typography.css"

const ContestAnalyticsTab = () => {
  const { t } = useTranslation(["pages", "common"])

  // Filter state
  const [timeRange, setTimeRange] = useState(TimeRangePredefined.AllTime)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [isReady, setIsReady] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 150)
    return () => clearTimeout(timer)
  }, [])

  // Fetch data
  const {
    data: chartData,
    isLoading,
    error,
    refetch,
  } = useGetDashboardChartsQuery({
    timeRangePredefined: timeRange,
    startDate: timeRange === TimeRangePredefined.Custom ? startDate : undefined,
    endDate: timeRange === TimeRangePredefined.Custom ? endDate : undefined,
  })

  // SignalR Handler
  const handleSignalRUpdate = (eventName, data) => {
    // Refresh data
    refetch()

    // Show notification based on event
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

  const { isConnected } = useDashboardSignalR(handleSignalRUpdate)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-body-1 text-gray-500 animate-pulse">
          {t("common.loading", "Loading graph data...")}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-body-1 text-red-500">
          {t("common.error", "Failed to load contest analytics")}
        </div>
      </div>
    )
  }

  // Transform trend data
  const trendData =
    chartData?.labels?.map((label, index) => ({
      name: label,
      contests: chartData.contestCreationTrend?.[index] || 0,
      teams: chartData.teamRegistrationTrend?.[index] || 0,
    })) || []

  // Transform status data
  const statusData = chartData?.contestsByStatus
    ? Object.entries(chartData.contestsByStatus).map(([name, value]) => ({
        name,
        value,
      }))
    : []

  // Chart Colors
  const COLORS = {
    contests: "#F97316", // orange-500
    teams: "#3B82F6", // blue-500
    status: [
      "#3B82F6", // blue-500 (Completed)
      "#F97316", // orange-500 (Delayed)
      "#22C55E", // green-500 (Ongoing)
      "#EAB308", // yellow-500 (Paused)
      "#8B5CF6", // purple-500 (Published)
      "#64748B", // slate-500 (Closed)
    ],
  }

  const statusColorMap = {
    Ongoing: "#22C55E",
    Completed: "#3B82F6",
    Draft: "#94A3B8",
    Published: "#8B5CF6",
    Delayed: "#F97316",
    Paused: "#EAB308",
    RegistrationOpen: "#06B6D4",
    RegistrationClosed: "#64748B",
    Cancelled: "#EF4444",
  }

  const translateStatus = (status) => {
    const statusKey = status.toLowerCase().replace(/\s+/g, "")
    return t(`contest.statusLabels.${statusKey}`, status)
  }

  return (
    <div className="space-y-6">
      {/* Filters & Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <DashboardTimeRangeFilter
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />

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

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 gap-6">
        {/* Contest Creation Trend */}
        <div className="bg-white border border-[#E5E5E5] rounded-[5px] p-6">
          <div className="flex items-center gap-3 mb-6">
            <TrendingUp className="w-5 h-5 text-gray-700" />
            <h3 className="text-subtitle-2 text-gray-800">
              {t("dashboard.contestAnalytics.contestCreationTrend")}
            </h3>
          </div>
          <div className="h-[300px] w-full relative">
            {isReady && (
              <ResponsiveContainer
                width="100%"
                height="100%"
                minWidth={0}
                minHeight={0}
                debounce={50}
              >
                <LineChart data={trendData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={true}
                    horizontal={true}
                    stroke="#e1cbcbff"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64748B" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64748B" }}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="contests"
                    stroke={COLORS.contests}
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: COLORS.contests,
                      strokeWidth: 2,
                      stroke: "#fff",
                    }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                    name={t("dashboard.overview.contests")}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
          <p className="text-caption-1 text-gray-500 mt-4 text-center">
            {t(
              "dashboard.contestAnalytics.showsContestCreation",
              "Shows how many contests were created each month",
            )}
          </p>
        </div>

        {/* Team Registration Trend */}
        <div className="bg-white border border-[#E5E5E5] rounded-[5px] p-6">
          <div className="flex items-center gap-3 mb-6">
            <BarChart3 className="w-5 h-5 text-gray-700" />
            <h3 className="text-subtitle-2 text-gray-800">
              {t("dashboard.contestAnalytics.teamRegistrationTrend")}
            </h3>
          </div>
          <div className="h-[300px] w-full relative">
            {isReady && (
              <ResponsiveContainer
                width="100%"
                height="100%"
                minWidth={0}
                minHeight={0}
                debounce={50}
              >
                <BarChart data={trendData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={true}
                    horizontal={true}
                    stroke="#CBD5E1"
                  />
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64748B" }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: "#64748B" }}
                  />
                  <Tooltip
                    cursor={false}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "none",
                      boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                    }}
                  />
                  <Bar
                    dataKey="teams"
                    fill={COLORS.teams}
                    radius={[4, 4, 0, 0]}
                    barSize={40}
                    name={t("dashboard.overview.totalTeams")}
                    activeBar={{ fillOpacity: 0.8 }}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
          <p className="text-caption-1 text-gray-500 mt-4 text-center">
            {t(
              "dashboard.contestAnalytics.showsTeamRegistration",
              "Shows how many teams registered each month",
            )}
          </p>
        </div>

        {/* Contest Status Distribution */}
        <div className="bg-white border border-[#E5E5E5] rounded-[5px] p-6">
          <div className="flex items-center gap-3 mb-6">
            <PieChartIcon className="w-5 h-5 text-gray-700" />
            <h3 className="text-subtitle-2 text-gray-800">
              {t("dashboard.contestAnalytics.contestStatusDistribution")}
            </h3>
          </div>
          <div className="flex flex-col lg:flex-row items-center gap-8">
            <div className="h-[300px] w-full lg:w-1/2 relative">
              {isReady && (
                <ResponsiveContainer
                  width="100%"
                  height="100%"
                  minWidth={0}
                  minHeight={0}
                  debounce={50}
                >
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={
                            statusColorMap[entry.name] ||
                            COLORS.status[index % COLORS.status.length]
                          }
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Legend Grid */}
            <div className="w-full lg:w-1/2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {statusData.map((entry, index) => {
                  const total = statusData.reduce(
                    (sum, item) => sum + item.value,
                    0,
                  )
                  const percentage =
                    total > 0 ? ((entry.value / total) * 100).toFixed(1) : 0

                  return (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 rounded-[5px] border border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <div
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{
                          backgroundColor:
                            statusColorMap[entry.name] ||
                            COLORS.status[index % COLORS.status.length],
                        }}
                      />
                      <div className="flex flex-col">
                        <span className="text-caption-1-strong text-gray-800">
                          {translateStatus(entry.name)}: {entry.value}
                        </span>
                        <span className="text-[10px] text-gray-500">
                          ({percentage}%)
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
              <p className="text-[10px] text-gray-400 mt-6 italic">
                {t(
                  "dashboard.contestAnalytics.note",
                  "Note: Draft and Cancelled contests excluded for clarity",
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContestAnalyticsTab
