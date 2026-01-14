import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import TabNavigation from "@/shared/components/TabNavigation"
import { AnimatedSection } from "@/shared/components/ui/AnimatedSection"
import OrganizerOverviewTab from "../../components/organizer/OrganizerOverviewTab"
import OrganizerContestsTab from "../../components/organizer/OrganizerContestsTab"
import OrganizerContestDetailsTab from "../../components/organizer/OrganizerContestDetailsTab"

const OrganizerDashboard = () => {
  const { t } = useTranslation(["pages", "common"])
  const [activeTab, setActiveTab] = useState("overview")

  const tabs = [
    { id: "overview", label: t("dashboard.tabs.overview", "Overview") },
    { id: "contests", label: t("dashboard.tabs.myContests", "My Contests") },
    {
      id: "contestDetails",
      label: t("dashboard.tabs.contestDetails", "Contest Details"),
    },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OrganizerOverviewTab />
      case "contests":
        return <OrganizerContestsTab />
      case "contestDetails":
        return <OrganizerContestDetailsTab />
      default:
        return <OrganizerOverviewTab />
    }
  }

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_DASHBOARD
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_DASHBOARD

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
