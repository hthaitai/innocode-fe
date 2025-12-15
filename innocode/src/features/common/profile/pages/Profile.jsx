import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PageContainer from "@/shared/components/PageContainer";
import TabNavigation from "@/shared/components/TabNavigation";
import { BREADCRUMBS } from "@/config/breadcrumbs";
import { useAuth } from "../../../../context/AuthContext";
import ProfileHeader from "../components/ProfileHeader";
import AboutTab from "../components/AboutTab";
import PasswordTab from "../components/PasswordTab";
import { useGetUserMeQuery } from "../../../../services/userApi";

export default function Profile() {
  const [tab, setTab] = useState("about");
  const { data: userMe, isLoading: isLoadingUserMe } = useGetUserMeQuery();
  const role = userMe?.role || "student";

  const tabs = [
    { id: "about", label: "About" },
    { id: "password", label: "Change Password" },
  ];

  // Animation variants for tab content
  const tabVariants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.16, 1, 0.3, 1], // Fluent design motion curve
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: {
        duration: 0.2,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <PageContainer breadcrumb={BREADCRUMBS.PROFILE}>
      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12">
          <ProfileHeader user={userMe} role={role} />

          <div className="mb-6">
            <TabNavigation tabs={tabs} activeTab={tab} onTabChange={setTab} />
          </div>
        </div>

        <div className="col-span-12">
          <div className="bg-white rounded-xl overflow-hidden relative">
            <AnimatePresence mode="wait">
              {tab === "about" && (
                <motion.div
                  key="about"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <AboutTab user={userMe} />
                </motion.div>
              )}
              {tab === "password" && (
                <motion.div
                  key="password"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <PasswordTab />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
