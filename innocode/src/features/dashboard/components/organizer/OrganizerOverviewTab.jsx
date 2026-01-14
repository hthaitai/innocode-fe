import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Trophy, TrendingUp } from "lucide-react"
import { useGetOrganizerDashboardMetricsQuery } from "@/services/dashboardApi"
import { TimeRangePredefined } from "@/features/common/dashboard/TimeRangeFilter"
import DashboardTimeRangeFilter from "./DashboardTimeRangeFilter"
import MetricCard from "./MetricCard"
import ContestHighlightCard from "./ContestHighlightCard"
import ContestStatusPieChart from "./ContestStatusPieChart"
import { useOrganizerDashboardSignalR } from "@/shared/hooks/useOrganizerDashboardSignalR"
import toast from "react-hot-toast"

const OrganizerOverviewTab = () => {
  const { t } = useTranslation(["pages", "common"])

  // Time range state
  const [timeRange, setTimeRange] = useState(TimeRangePredefined.AllTime)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  const {
    data: metrics,
    isLoading,
    error,
    refetch,
  } = useGetOrganizerDashboardMetricsQuery({
    timeRangePredefined: timeRange,
    startDate: timeRange === TimeRangePredefined.Custom ? startDate : undefined,
    endDate: timeRange === TimeRangePredefined.Custom ? endDate : undefined,
  })

  // SignalR Handler
  const handleSignalRUpdate = (data) => {
    // Refresh data
    refetch()

    // Show notification
    const message = data?.message || data?.Message
    if (message) {
      toast(message, {
        icon: "🔔",
      })
    }
  }

  // Connect to SignalR
  const { isConnected } = useOrganizerDashboardSignalR(handleSignalRUpdate)

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

  return (
    <div className="space-y-5">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Time Range Filter */}
        <DashboardTimeRangeFilter
          timeRange={timeRange}
          setTimeRange={setTimeRange}
          startDate={startDate}
          setStartDate={setStartDate}
          endDate={endDate}
          setEndDate={setEndDate}
        />

        {/* Hub Status Indicator */}
        <div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#E5E5E5] rounded-[5px] w-fit self-end md:self-auto">
          <div
            className={`w-2 h-2 rounded-full ${
              isConnected ? "bg-green-500 animate-pulse" : "bg-gray-300"
            }`}
          />
          <span className="text-caption-1 text-gray-600">
            {isConnected
              ? t("dashboard.status.live", "Live updates")
              : t("dashboard.status.offline", "Offline")}
          </span>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard
          icon={Trophy}
          iconBgColor="bg-orange-50"
          iconColor="text-orange-500"
          label={t("dashboard.overview.totalContestsCreated", "Total contests")}
          value={metrics?.totalContestsCreated}
        />
        <MetricCard
          icon={TrendingUp}
          iconBgColor="bg-green-50"
          iconColor="text-green-500"
          label={t("dashboard.overview.activeContests", "Active contests")}
          value={metrics?.activeContests}
        />
        <MetricCard
          icon={Trophy}
          iconBgColor="bg-blue-50"
          iconColor="text-blue-500"
          label={t(
            "dashboard.overview.completedContests",
            "Completed contests"
          )}
          value={metrics?.completedContests}
        />
        <MetricCard
          icon={Trophy}
          iconBgColor="bg-gray-50"
          iconColor="text-gray-500"
          label={t("dashboard.overview.draftContests", "Draft contests")}
          value={metrics?.draftContests}
        />
      </div>

      {/* Contest Status Distribution */}
      <div>
        <div className="text-sm leading-5 font-semibold pt-3 pb-2">
          {t(
            "dashboard.overview.contestStatusDistribution",
            "Contest status distribution"
          )}
        </div>
        <ContestStatusPieChart metrics={metrics} />
      </div>

      {/* Contest Highlights */}
      <div>
        <div className="text-sm leading-5 font-semibold pt-3 pb-2">
          {t("dashboard.overview.contestHighlights", "Contest highlights")}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <ContestHighlightCard
            title={t(
              "dashboard.overview.mostActiveContest",
              "Most active contest"
            )}
            contestData={metrics?.mostActiveContest}
          />
          <ContestHighlightCard
            title={t(
              "dashboard.overview.contestWithMostAppeals",
              "Contest with most appeals"
            )}
            contestData={metrics?.contestWithMostAppeals}
          />
        </div>
      </div>
    </div>
  )
}

export default OrganizerOverviewTab
