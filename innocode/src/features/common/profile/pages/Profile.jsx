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
      <AnimatedSection>
        <div className="space-y-6">
          <ProfileHeader user={userMe} role={role} />

          <div>
            <TabNavigation
              tabs={tabs}
              activeTab={tab}
              onTabChange={setTab}
              className="mb-4"
            />

            <div className="bg-white rounded-[5px] border border-[#E5E5E5] min-h-[400px] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={tab}
                  initial={{ opacity: 0, x: tab === "about" ? -10 : 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: tab === "about" ? 10 : -10 }}
                  transition={{ duration: 0.2, ease: "easeInOut" }}
                  className="p-6"
                >
                  {tab === "about" && <AboutTab user={userMe} />}
                  {tab === "password" && <PasswordTab />}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </AnimatedSection>
    </PageContainer>
  )
}
