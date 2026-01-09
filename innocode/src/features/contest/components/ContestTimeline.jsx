import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { Check, Clock, ChevronDown } from "lucide-react"

/**
 * ContestTimeline Component - Complete timeline for contest
 * @param {object} timeline - Timeline data from API
 * @param {boolean} loading - Loading state
 */
const ContestTimeline = ({ timeline, loading }) => {
  const { t, i18n } = useTranslation("pages")
  const [isOpen, setIsOpen] = useState(false)

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    const isVietnamese = i18n.language === "vi"

    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()
    const hours = date.getHours()
    const minutes = date.getMinutes()

    const monthNamesEn = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ]
    const monthNamesVi = [
      "Thg 1",
      "Thg 2",
      "Thg 3",
      "Thg 4",
      "Thg 5",
      "Thg 6",
      "Thg 7",
      "Thg 8",
      "Thg 9",
      "Thg 10",
      "Thg 11",
      "Thg 12",
    ]

    const monthName = isVietnamese ? monthNamesVi[month] : monthNamesEn[month]
    const period =
      hours >= 12 ? (isVietnamese ? "CH" : "PM") : isVietnamese ? "SA" : "AM"
    const displayHours = hours % 12 || 12
    const displayMinutes = minutes.toString().padStart(2, "0")

    return `${monthName} ${day}, ${year}, ${displayHours}:${displayMinutes} ${period}`
  }

  if (loading) {
    return (
      <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-4 flex flex-col items-center justify-center gap-3">
        <Clock size={24} className="animate-spin text-[#ff6b35] opacity-50" />
        <span className="text-gray-500 font-medium text-sm">
          {t("common:common.loading")}...
        </span>
      </div>
    )
  }

  if (!timeline) {
    return null
  }

  const now = new Date()

  // Build complete timeline phases
  const buildPhases = () => {
    const phases = []

    // 1. Registration Start
    if (timeline.registrationStart) {
      phases.push({
        key: "registrationStart",
        label: t("contest.registrationStart"),
        deadline: timeline.registrationStart,
        type: "milestone",
      })
    }

    // 2. Registration End
    if (timeline.registrationEnd) {
      phases.push({
        key: "registrationEnd",
        label: t("contest.registrationEnd"),
        deadline: timeline.registrationEnd,
        type: "milestone",
      })
    }

    // 3. Contest Start
    if (timeline.contestStart) {
      phases.push({
        key: "contestStart",
        label: t("contest.contestStart"),
        deadline: timeline.contestStart,
        type: "milestone",
      })
    }

    // 4. All Rounds - interleaved start and end times
    if (timeline.rounds && Array.isArray(timeline.rounds)) {
      const sortedRounds = [...timeline.rounds].sort((a, b) => {
        const dateA = new Date(a.start)
        const dateB = new Date(b.start)
        return dateA - dateB
      })

      sortedRounds.forEach((round, index) => {
        // Round Start
        if (round.start) {
          phases.push({
            key: `roundStart-${round.roundId}`,
            label: `${t("contest.round")} ${index + 1} ${t("contest.start")}`,
            deadline: round.start,
            type: "milestone",
            roundNumber: index + 1,
          })
        }

        // Round End
        if (round.end) {
          phases.push({
            key: `roundEnd-${round.roundId}`,
            label: `${t("contest.round")} ${index + 1} ${t("contest.end")}`,
            deadline: round.end,
            type: "milestone",
            roundNumber: index + 1,
          })
        }
      })
    }

    // 5. Contest End
    if (timeline.contestEnd) {
      phases.push({
        key: "contestEnd",
        label: t("contest.contestEnd"),
        deadline: timeline.contestEnd,
        type: "milestone",
      })
    }

    // Sort all phases by deadline
    return phases.sort((a, b) => {
      const dateA = new Date(a.deadline)
      const dateB = new Date(b.deadline)
      return dateA - dateB
    })
  }

  const phases = buildPhases()

  const getCurrentPhaseIndex = () => {
    for (let i = 0; i < phases.length; i++) {
      const phase = phases[i]
      const deadline = new Date(phase.deadline)
      if (now < deadline) {
        return i > 0 ? i - 1 : -1
      }
    }
    return phases.length - 1
  }

  const currentPhaseIndex = getCurrentPhaseIndex()

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-[8px] overflow-hidden transition-all duration-300">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
              isOpen ? "bg-orange-100" : "bg-orange-50"
            }`}
          >
            <Clock className="text-[#ff6b35]" size={20} />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-bold text-[#2d3748]">
              {t("contest.contestTimeline")}
            </h3>
            {!isOpen && (
              <p className="text-sm text-[#7A7574] leading-none mt-0.5">
                {t("contest.timelineDescription")}
              </p>
            )}
          </div>
        </div>
        <ChevronDown
          className={`text-gray-400 transition-transform duration-300 ${
            isOpen ? "rotate-180" : ""
          }`}
          size={24}
        />
      </button>

      {/* Accordion Content */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isOpen
            ? "max-h-[2000px] opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="p-6 pt-2 border-t border-gray-100">
          <p className="text-sm text-[#7A7574] mb-8">
            {t("contest.timelineDescription")}
          </p>

          {/* Vertical Timeline */}
          <div className="relative pl-4 ml-2">
            {/* Main Vertical Track */}
            <div className="absolute left-[3px] top-2 bottom-2 w-[2px] bg-gray-100"></div>

            <div className="space-y-6">
              {phases.map((phase, index) => {
                const isCompleted = index < currentPhaseIndex
                const isActive = index === currentPhaseIndex
                const isFuture = index > currentPhaseIndex
                const isLast = index === phases.length - 1
                const nextPhase =
                  index < phases.length - 1 ? phases[index + 1] : null

                return (
                  <div key={phase.key} className="relative pl-10">
                    {/* Milestone Marker */}
                    <div
                      className={`absolute left-[-5px] top-1 w-5 h-5 rounded-full z-10 flex items-center justify-center transition-all duration-300 ${
                        isCompleted
                          ? "bg-[#ff6b35] ring-4 ring-orange-50"
                          : isActive
                          ? "bg-white border-2 border-[#ff6b35] ring-4 ring-orange-100"
                          : "bg-white border-2 border-gray-200"
                      }`}
                    >
                      {isCompleted && (
                        <Check
                          size={10}
                          className="text-white"
                          strokeWidth={4}
                        />
                      )}
                      {isActive && (
                        <div className="w-2 h-2 rounded-full bg-[#ff6b35] animate-pulse"></div>
                      )}
                    </div>

                    {/* Connecting Line Overlay - Only for active phase */}
                    {isActive && !isLast && (
                      <div className="absolute left-[-4px] top-6 w-[2px] bottom-[-24px] z-[5]">
                        <div
                          className="w-full h-full bg-gradient-to-b from-[#ff6b35] to-gray-100"
                          style={{
                            backgroundSize: "100% 200%",
                            animation: "shimmerVertical 5s infinite",
                          }}
                        />
                      </div>
                    )}

                    {/* Completed Line Overlay */}
                    {isCompleted && !isLast && (
                      <div className="absolute left-[-4px] top-6 w-[2px] bottom-[-24px] z-[5] bg-[#ff6b35]"></div>
                    )}

                    {/* Content */}
                    <div
                      className={`flex flex-col md:flex-row md:items-center justify-between gap-2 p-3 rounded-[8px] transition-all duration-300 ${
                        isActive
                          ? "bg-orange-50/50 border border-orange-100 shadow-sm"
                          : "border border-transparent"
                      }`}
                    >
                      <div className="flex flex-col">
                        <span
                          className={`font-bold transition-colors ${
                            isActive
                              ? "text-[#ff6b35]"
                              : isCompleted
                              ? "text-[#2d3748]"
                              : "text-[#7A7574]"
                          }`}
                        >
                          {phase.label}
                        </span>
                        {isActive && nextPhase && (
                          <span className="text-[11px] font-semibold text-orange-600 mt-1 flex items-center gap-1.5">
                            <span className="opacity-70">
                              {t("contest:nextProgress")}
                            </span>
                            <span className="opacity-50">→</span>
                            <span className="opacity-90">
                              {nextPhase.label}
                            </span>
                          </span>
                        )}
                      </div>

                      <div
                        className={`flex items-center gap-2 text-sm font-medium ${
                          isActive ? "text-[#ff6b35]" : "text-[#7A7574]"
                        }`}
                      >
                        <Clock size={16} />
                        <span className="whitespace-nowrap">
                          {formatDate(phase.deadline)}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Add shimmer animation for vertical */}
      <style jsx>{`
        @keyframes shimmerVertical {
          0% {
            background-position: 0 200%;
          }
          100% {
            background-position: 0 -200%;
          }
        }
      `}</style>
    </div>
  )
}

export default ContestTimeline
