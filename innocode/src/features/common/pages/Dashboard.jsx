import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { AnimatePresence, motion } from "framer-motion"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS } from "@/config/breadcrumbs"
import TabNavigation from "@/shared/components/TabNavigation"
import OverviewTab from "../dashboard/OverviewTab"
import ContestAnalyticsTab from "../dashboard/ContestAnalyticsTab"
import TopPerformanceTab from "../dashboard/TopPerformanceTab"
import SchoolMetricTab from "../dashboard/SchoolMetricTab"

const Dashboard = () => {
  const { t } = useTranslation(["pages", "common"])
  const [activeTab, setActiveTab] = useState("overview")

  const tabs = [
    { id: "overview", label: t("dashboard.tabs.overview") },
    { id: "contestAnalytics", label: t("dashboard.tabs.contestAnalytics") },
    { id: "topPerformance", label: t("dashboard.tabs.topPerformance") },
    { id: "schoolMetric", label: t("dashboard.tabs.schoolMetric") },
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return <OverviewTab />
      case "contestAnalytics":
        return <ContestAnalyticsTab />
      case "topPerformance":
        return <TopPerformanceTab />
      case "schoolMetric":
        return <SchoolMetricTab />
      default:
        return <OverviewTab />
    }
  }

  return (
    <PageContainer breadcrumb={BREADCRUMBS.DASHBOARD}>
      <div className="space-y-4">
        {/* Header */}
        <div className="bg-white border border-[#E5E5E5] rounded-[5px] p-5">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {t("dashboard.description")}
          </h1>
          <p className="text-sm text-gray-600"></p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white border border-[#E5E5E5] rounded-[5px] p-5">
          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* Tab Content */}
          <div className="mt-4 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

export default Dashboard
