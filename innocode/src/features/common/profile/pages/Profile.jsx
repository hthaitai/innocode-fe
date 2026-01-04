import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { AnimatePresence, motion } from "framer-motion"
import PageContainer from "@/shared/components/PageContainer"
import TabNavigation from "@/shared/components/TabNavigation"
import { BREADCRUMBS } from "@/config/breadcrumbs"
import { useAuth } from "../../../../context/AuthContext"
import ProfileHeader from "../components/ProfileHeader"
import AboutTab from "../components/AboutTab"
import PasswordTab from "../components/PasswordTab"
import { useGetUserMeQuery } from "../../../../services/userApi"
import { AnimatedSection } from "@/shared/components/ui/AnimatedSection"

export default function Profile() {
  const { t } = useTranslation("pages")
  const [tab, setTab] = useState("about")
  const { data: userMe, isLoading: isLoadingUserMe } = useGetUserMeQuery()
  const role = userMe?.role || "student"

  const tabs = [
    { id: "about", label: t("profile.tabs.about") },
    { id: "password", label: t("profile.tabs.changePassword") },
  ]

  return (
    <PageContainer breadcrumb={BREADCRUMBS.PROFILE}>
      <div className="max-w-4xl mx-auto">
        <ProfileHeader user={userMe} role={role} />

        <div className="mb-6">
          <TabNavigation tabs={tabs} activeTab={tab} onTabChange={setTab} />
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden relative min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, x: tab === "about" ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: tab === "about" ? 20 : -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {tab === "about" && <AboutTab user={userMe} />}
              {tab === "password" && <PasswordTab />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </PageContainer>
  )
}
