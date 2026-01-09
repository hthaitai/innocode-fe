import React from "react"
import { Icon } from "@iconify/react"
import { useTranslation } from "react-i18next"
import PageContainer from "../../../shared/components/PageContainer"
import { AnimatedSection } from "../../../shared/components/ui/AnimatedSection"

import Footer from "../../../shared/components/footer/Footer"

const Policy = () => {
  const { t } = useTranslation("policy")

  const policySections = [
    {
      id: 1,
      key: "teamParticipation",
      icon: "mdi:account-group",
    },
    {
      id: 2,
      key: "contestTime",
      icon: "mdi:clock-outline",
    },
    {
      id: 3,
      key: "submissionAndScoring",
      icon: "mdi:file-send",
    },
    {
      id: 4,
      key: "teamScoring",
      icon: "mdi:trophy",
    },
    {
      id: 5,
      key: "leaderboard",
      icon: "mdi:view-dashboard",
    },
    {
      id: 6,
      key: "appeals",
      icon: "mdi:file-document-edit",
    },
    {
      id: 7,
      key: "fairness",
      icon: "mdi:shield-check",
    },
    {
      id: 8,
      key: "finalizing",
      icon: "mdi:lock-check",
    },
  ]

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <AnimatedSection direction="bottom">
        <div className="border-b border-gray-300 ">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-title-1 md:text-large-title text-gray-900 mb-4">
              {t("title")}
            </h1>
            <p className="text-body-1 text-gray-600 leading-relaxed max-w-3xl">
              {t("description")}
            </p>
          </div>
        </div>
        {/* Main Content - Grid Layout */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex-grow">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {policySections.map((section) => (
              <div key={section.id} className="   rounded-lg p-6 ">
                <div className="flex items-start mb-4">
                  <div className="flex-shrink-0 mr-4">
                    <Icon
                      icon={section.icon}
                      className="text-orange-600"
                      width="32"
                      height="32"
                    />
                  </div>
                  <h2 className="text-subtitle-1 text-gray-900">
                    {section.id}. {t(`sections.${section.key}.title`)}
                  </h2>
                </div>
                <p className="text-body-1 text-gray-600 leading-relaxed mb-4">
                  {t(`sections.${section.key}.description`)}
                </p>
                <ul className="space-y-2 text-gray-700 text-body-1">
                  {t(`sections.${section.key}.details`, {
                    returnObjects: true,
                  }).map((detail, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-orange-600 mr-2 mt-1 flex-shrink-0">
                        •
                      </span>
                      <span className="leading-relaxed">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>
      <div className="mt-auto">
        <Footer />
      </div>
    </div>
  )
}

export default Policy
