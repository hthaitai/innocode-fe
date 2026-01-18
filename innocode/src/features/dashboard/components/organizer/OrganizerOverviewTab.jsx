import React from "react"
import { useTranslation } from "react-i18next"
import { Trophy, TrendingUp, CheckCircle, FileText } from "lucide-react"
import DashboardTimeRangeFilter from "./DashboardTimeRangeFilter"
import MetricCard from "./MetricCard"
import ContestHighlightCard from "./ContestHighlightCard"
import ContestStatusPieChart from "./ContestStatusPieChart"
import StatusBadge from "@/shared/components/StatusBadge"

const OrganizerOverviewTab = ({
  metrics,
  timeRange,
  setTimeRange,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  refetch,
  isConnected,
}) => {
  const { t } = useTranslation(["dashboard", "common"])

  return (
    <div className="space-y-5">
      <div className="space-y-3">
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
          <div className="button-white px-3 py-1 flex justify-center">
            <StatusBadge
              status={isConnected ? "active" : "inactive"}
              label={isConnected ? t("status.live") : t("status.offline")}
            />
          </div>
        </div>

        {/* Top Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <MetricCard
            icon={Trophy}
            iconBgColor="bg-orange-50"
            iconColor="text-orange-500"
            label={t("overview.totalContestsCreated", "Total contests")}
            value={metrics?.totalContestsCreated}
          />
          <MetricCard
            icon={TrendingUp}
            iconBgColor="bg-green-50"
            iconColor="text-green-500"
            label={t("overview.activeContests", "Active contests")}
            value={metrics?.activeContests}
          />
          <MetricCard
            icon={CheckCircle}
            iconBgColor="bg-blue-50"
            iconColor="text-blue-500"
            label={t("overview.completedContests", "Completed contests")}
            value={metrics?.completedContests}
          />
          <MetricCard
            icon={FileText}
            iconBgColor="bg-gray-50"
            iconColor="text-gray-500"
            label={t("overview.draftContests", "Draft contests")}
            value={metrics?.draftContests}
          />
        </div>
      </div>

      {/* Contest Status Distribution */}
      <div>
        <div className="text-sm leading-5 font-semibold pt-3 pb-2">
          {t(
            "overview.contestStatusDistribution",
            "Contest status distribution",
          )}
        </div>
        <ContestStatusPieChart metrics={metrics} />
      </div>

      {/* Contest Highlights */}
      <div>
        <div className="text-sm leading-5 font-semibold pt-3 pb-2">
          {t("overview.contestHighlights", "Contest highlights")}
        </div>
        <div className="space-y-1">
          <ContestHighlightCard
            title={t("overview.mostActiveContest", "Most active contest")}
            contestData={metrics?.mostActiveContest}
          />
          <ContestHighlightCard
            title={t(
              "overview.contestWithMostAppeals",
              "Contest with most appeals",
            )}
            contestData={metrics?.contestWithMostAppeals}
          />
        </div>
      </div>
    </div>
  )
}

export default OrganizerOverviewTab
