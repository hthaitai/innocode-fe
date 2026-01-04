import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { AnimatePresence } from "framer-motion"
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
      <AnimatedSection direction="bottom">
        <div>
          <ProfileHeader user={userMe} role={role} />
          <TabNavigation tabs={tabs} activeTab={tab} onTabChange={setTab} />
        </div>

        <div className="bg-white rounded-[5px] border border-[#E5E5E5] overflow-hidden relative">
          {tab === "about" && (
            <div key="about" direction="bottom">
              <AboutTab user={userMe} />
            </div>
          )}
          {tab === "password" && (
            <div key="password" direction="bottom">
              <PasswordTab />
            </div>
          )}
        </div>
      </AnimatedSection>
    </PageContainer>
  )
}
