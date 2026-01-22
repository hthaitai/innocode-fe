import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import TabNavigation from "@/shared/components/TabNavigation"
import { AnimatedSection } from "@/shared/components/ui/AnimatedSection"
import { LoadingState } from "@/shared/components/ui/LoadingState"
import { ErrorState } from "@/shared/components/ui/ErrorState"
import OrganizerOverviewTab from "../../components/organizer/OrganizerOverviewTab"
import OrganizerContestsTab from "../../components/organizer/OrganizerContestsTab"
import OrganizerContestDetailsTab from "../../components/organizer/OrganizerContestDetailsTab"
import {
  useGetOrganizerDashboardMetricsQuery,
  useGetOrganizerDashboardContestsQuery,
  useGetOrganizerContestDetailsQuery,
} from "@/services/dashboardApi"
import { TimeRangePredefined } from "@/features/common/dashboard/TimeRangeFilter"
import { useOrganizerDashboardSignalR } from "@/shared/hooks/useOrganizerDashboardSignalR"
import toast from "react-hot-toast"

const OrganizerDashboard = () => {
  const { t } = useTranslation(["pages", "common", "dashboard"])
  const [activeTab, setActiveTab] = useState("overview")

  // Overview Tab State
  const [timeRange, setTimeRange] = useState(TimeRangePredefined.AllTime)
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")

  // Contests Tab State
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(8)

  // Contest Details Tab State
  const [selectedContestId, setSelectedContestId] = useState("")

  // Fetch Overview Metrics
  const {
    data: metrics,
    isLoading: metricsLoading,
    error: metricsError,
    refetch: refetchMetrics,
  } = useGetOrganizerDashboardMetricsQuery({
    timeRangePredefined: timeRange,
    startDate: timeRange === TimeRangePredefined.Custom ? startDate : undefined,
    endDate: timeRange === TimeRangePredefined.Custom ? endDate : undefined,
  })

  // Fetch Contests List

  const {
    data: contestsData,
    isLoading: contestsLoading,
    error: contestsError,
    refetch: refetchContests,
  } = useGetOrganizerDashboardContestsQuery({
    page: page,
    size: pageSize,
  })

  const contests = contestsData?.data ?? []
  const pagination = contestsData?.additionalData ?? {}

  // Fetch Contest Details (conditional)
  const {
    data: contestDetails,
    isLoading: detailsLoading,
    error: detailsError,
  } = useGetOrganizerContestDetailsQuery(selectedContestId, {
    skip: !selectedContestId,
  })

  // SignalR for real-time updates
  const handleSignalRUpdate = (data) => {
    refetchMetrics()
    refetchContests()

    // Show notification
    const message = data?.message || data?.Message

    if (data?.reconnected) {
      toast.success(t("dashboard:notifications.reconnected"), {
        icon: "🔄",
      })
      return
    }

    if (message) {
      toast.success(
        message || t("dashboard:notifications.organizerDashboardUpdated"),
        {
          icon: "📊",
        },
      )
    }
  }

  const { isConnected } = useOrganizerDashboardSignalR(handleSignalRUpdate)

  const tabs = [
    { id: "overview", label: t("dashboard:tabs.overview", "Overview") },
    { id: "contests", label: t("dashboard:tabs.myContests", "My Contests") },
    // {
    //   id: "contestDetails",
    //   label: t("dashboard:tabs.contestDetails", "Contest Details"),
    // },
  ]

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_DASHBOARD
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_DASHBOARD

  // Centralized loading state
  const isLoading = metricsLoading || contestsLoading

  if (isLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <LoadingState />
      </PageContainer>
    )
  }

  // Centralized error handling
  const hasError = metricsError || contestsError
  if (hasError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName="dashboard data" />
      </PageContainer>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <OrganizerOverviewTab
            metrics={metrics}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            refetch={refetchMetrics}
            isConnected={isConnected}
          />
        )
      case "contests":
        return (
          <OrganizerContestsTab
            contests={contests}
            pagination={pagination}
            setPage={setPage}
            refetch={refetchContests}
            isConnected={isConnected}
          />
        )
      // case "contestDetails":
      //   return (
      //     <OrganizerContestDetailsTab
      //       contestDetails={contestDetails}
      //       selectedContestId={selectedContestId}
      //       setSelectedContestId={setSelectedContestId}
      //       isLoading={detailsLoading}
      //       error={detailsError}
      //     />
      //   )
      default:
        return (
          <OrganizerOverviewTab
            metrics={metrics}
            timeRange={timeRange}
            setTimeRange={setTimeRange}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            refetch={refetchMetrics}
            isConnected={isConnected}
          />
        )
    }
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      {/* Tab Navigation */}
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Tab Content */}
      <AnimatedSection key={activeTab} direction="bottom">
        {renderTabContent()}
      </AnimatedSection>
    </PageContainer>
  )
}

export default OrganizerDashboard
