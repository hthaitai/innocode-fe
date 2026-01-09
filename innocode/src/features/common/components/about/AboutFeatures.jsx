import React from "react"
import { useTranslation } from "react-i18next"
import { Terminal, Globe, Zap } from "lucide-react"

const AboutFeatures = () => {
  const { t } = useTranslation("about")

  const FEATURES = [
    {
      id: 1,
      title: t("features.realTimeExecution.title"),
      description: t("features.realTimeExecution.description"),
      icon: Terminal,
      bg: "bg-[#024FA0]", // Blue
      border: "border-[#024FA0]",
      isLarge: true,
    },
    {
      id: 2,
      title: t("features.globalLeaderboards.title"),
      description: t("features.globalLeaderboards.description"),
      icon: Globe,
      bg: "bg-[#50B846]", // Green
      border: "border-[#50B846]",
      isLarge: false,
    },
    {
      id: 3,
      title: t("features.instantFeedback.title"),
      description: t("features.instantFeedback.description"),
      icon: Zap,
      bg: "bg-[#F2721E]", // Orange
      border: "border-[#F2721E]",
      isLarge: false,
    },
  ]

  return (
    <section className="relative">
      <div className="text-center mb-16">
        <h2 className="text-title-1 font-bold text-gray-900 mb-4">
          {t("features.title")}
        </h2>
        <p className="text-subtitle-1 text-gray-500">
          {t("features.subtitle")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 leading-none">
        {FEATURES.map((item) => (
          <div
            key={item.id}
            className={`
              relative p-8 rounded-3xl border transition-all duration-300 hover:shadow-xl flex flex-col justify-between overflow-hidden group
              ${item.bg} ${item.border}
              ${item.isLarge ? "lg:row-span-2 lg:p-12" : ""}
            `}
          >
            {/* Decorative Background Icon (Faded) */}
            <item.icon
              className={`absolute -bottom-8 -right-8 w-48 h-48 text-white opacity-[0.1] pointer-events-none transform rotate-12 group-hover:scale-110 transition-transform duration-500`}
              strokeWidth={1}
            />

            <div className="relative z-10">
              <div
                className={`inline-flex items-center justify-center rounded-2xl ${
                  item.isLarge ? "w-16 h-16 mb-8" : "w-12 h-12 mb-6"
                } bg-white/20 text-white backdrop-blur-md shadow-sm`}
              >
                <item.icon size={item.isLarge ? 32 : 24} />
              </div>

              <h3
                className={`${
                  item.isLarge ? "text-title-2" : "text-title-3"
                } font-bold text-white mb-4`}
              >
                {item.title}
              </h3>
              <p className="text-body-1 text-white/90 leading-relaxed max-w-md">
                {item.description}
              </p>
            </div>

            {/* Optional Action/Arrow for the large card */}
            {item.isLarge && (
              <div className="mt-12 relative z-10">
                <div className="h-1 w-20 bg-white/40 rounded-full" />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export default AboutFeatures
