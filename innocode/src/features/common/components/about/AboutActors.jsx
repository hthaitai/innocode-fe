import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { motion, AnimatePresence } from "framer-motion"
import {
  Users,
  GraduationCap,
  Calendar,
  Gavel,
  Shield,
  Building2,
  UserCog,
} from "lucide-react"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"

const AboutActors = () => {
  const { t } = useTranslation("about")
  const [activeId, setActiveId] = useState("student")

  const ACTORS = [
    {
      id: "admin",
      icon: Shield,
      color: "text-red-500",
      ring: "border-red-500",
    },
    {
      id: "schoolManager",
      icon: Building2,
      color: "text-indigo-500",
      ring: "border-indigo-500",
    },
    {
      id: "staff",
      icon: UserCog,
      color: "text-teal-500",
      ring: "border-teal-500",
    },
    {
      id: "organizer",
      icon: Calendar,
      color: "text-purple-500",
      ring: "border-purple-500",
    },
    {
      id: "student",
      icon: Users,
      color: "text-blue-500",
      ring: "border-blue-500",
    },
    {
      id: "mentor",
      icon: GraduationCap,
      color: "text-green-500",
      ring: "border-green-500",
    },
    {
      id: "judge",
      icon: Gavel,
      color: "text-orange-500",
      ring: "border-orange-500",
    },
  ]

  const activeActor = ACTORS.find((a) => a.id === activeId)
  const RADIUS = 280

  return (
    <section className="relative py-12 lg:py-20 overflow-hidden">
      <AnimatedSection direction="bottom">
        <div className="text-center mb-12 relative z-10">
          <h2 className="text-display font-bold text-gray-900 mb-4 tracking-tight">
            {t("actors.title")}
          </h2>
          <p className="text-subtitle-1 text-gray-500 max-w-2xl mx-auto">
            {t("actors.subtitle")}
          </p>
        </div>

        <div className="relative w-full max-w-6xl mx-auto min-h-[500px] lg:h-[600px] flex flex-col items-center justify-center">
          {/* --- DESKTOP: Connected Wheel --- */}
          <div className="hidden lg:block relative w-full h-full">
            {/* Outer Orbit Ring */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[560px] h-[560px] border-2 border-dashed border-gray-200 rounded-full opacity-50 pointer-events-none" />

            {/* Connection Lines (Spokes) */}
            {ACTORS.map((actor, index) => {
              const isActive = activeId === actor.id

              return (
                <motion.div
                  key={`spoke-${actor.id}`}
                  className="absolute top-1/2 left-1/2 h-0.5 origin-left"
                  style={{
                    width: RADIUS,
                    rotate: `${index * (360 / ACTORS.length) - 90}deg`,
                    zIndex: 10,
                  }}
                >
                  <motion.div
                    className={`h-full w-full bg-gradient-to-r from-transparent to-current ${actor.color}`}
                    animate={{
                      opacity: isActive ? 1 : 0.1,
                      scaleX: isActive ? 1 : 0.5,
                    }}
                    style={{ backgroundColor: "currentColor" }}
                  />
                </motion.div>
              )
            })}

            {/* Central Hub */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-white rounded-full shadow-2xl flex flex-col items-center justify-center p-8 text-center z-20 border-[6px] border-gray-50/50 backdrop-blur-sm">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeActor.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center justify-center h-full"
                >
                  <div className="flex flex-col items-center justify-center h-full">
                    <div
                      className={`w-20 h-20 rounded-2xl ${actorColorToBg(
                        activeActor.color
                      )} ${
                        activeActor.color
                      } flex items-center justify-center mb-4`}
                    >
                      <activeActor.icon size={36} />
                    </div>
                    <h3 className="text-title-1 font-bold text-gray-900 mb-2">
                      {t(`actors.${activeActor.id}.title`)}
                    </h3>
                    <p className="text-body-1 text-gray-600 leading-relaxed font-medium">
                      {t(`actors.${activeActor.id}.description`)}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Orbiting Nodes (Planets) */}
            {ACTORS.map((actor, index) => {
              const angle =
                index * (360 / ACTORS.length) * (Math.PI / 180) - Math.PI / 2
              const x = Math.cos(angle) * RADIUS
              const y = Math.sin(angle) * RADIUS
              const isActive = activeId === actor.id

              return (
                <motion.button
                  key={actor.id}
                  onClick={() => setActiveId(actor.id)}
                  onMouseEnter={() => setActiveId(actor.id)}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    scale: isActive ? 1.2 : 1,
                    backgroundColor: isActive ? "#ffffff" : "#f9fafb",
                  }}
                  className={`
                                absolute -ml-7 -mt-7 w-14 h-14 rounded-full
                                flex items-center justify-center z-30 cursor-pointer
                                border-4 transition-colors duration-300 shadow-lg
                                ${
                                  isActive
                                    ? `${actor.ring} ${actor.color}`
                                    : "border-gray-100 text-gray-400 hover:border-gray-200 hover:text-gray-600"
                                }
                            `}
                  style={{
                    left: `calc(50% + ${x}px)`,
                    top: `calc(50% + ${y}px)`,
                  }}
                >
                  <actor.icon size={24} strokeWidth={2} />
                </motion.button>
              )
            })}
          </div>

          {/* --- MOBILE: Cards Grid --- */}
          <div className="lg:hidden w-full px-4 grid grid-cols-1 gap-4">
            {ACTORS.map((actor) => (
              <div
                key={actor.id}
                className={`p-6 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5`}
              >
                <div
                  className={`w-14 h-14 shrink-0 rounded-2xl ${actorColorToBg(
                    actor.color
                  )} flex items-center justify-center ${actor.color}`}
                >
                  <actor.icon size={28} />
                </div>
                <div>
                  <h3 className="text-title-3 font-bold text-gray-900">
                    {t(`actors.${actor.id}.title`)}
                  </h3>
                  <p className="text-body-1 text-gray-600 mt-1">
                    {t(`actors.${actor.id}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>
    </section>
  )
}

// Helper to convert text color class to bg color class (e.g. text-red-500 -> bg-red-50)
const actorColorToBg = (textColorClass) => {
  return textColorClass
    .replace("text-", "bg-")
    .replace("500", "50")
    .replace("600", "50")
}

export default AboutActors
