import React from "react"
import { useTranslation } from "react-i18next"
import { Check, Clock } from "lucide-react"

/**
 * RoundTimeline Component - Simple horizontal timeline with circles and lines
 * @param {object} timeline - Timeline data from API
 * @param {boolean} loading - Loading state
 */
const RoundTimeline = ({ timeline, loading }) => {
  const { t, i18n } = useTranslation("pages")

  // Format date function similar to ContestDetail
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const isVietnamese = i18n.language === "vi"

    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()
    const hours = date.getHours()
    const minutes = date.getMinutes()

    // Month names
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

    // Format time
    const period =
      hours >= 12 ? (isVietnamese ? "CH" : "PM") : isVietnamese ? "SA" : "AM"
    const displayHours = hours % 12 || 12
    const displayMinutes = minutes.toString().padStart(2, "0")

    // Format: "Thg 1 5, 2026, 10:30 SA" (Vietnamese) or "Jan 5, 2026, 10:30 AM" (English)
    return `${monthName} ${day}, ${year}, ${displayHours}:${displayMinutes} ${period}`
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-gray-400 mt-3 pt-3 border-t border-gray-200">
        <Clock size={12} className="animate-spin" />
        <span>{t("common:common.loading")}...</span>
      </div>
    )
  }

  if (!timeline) {
    return null
  }

  const now = new Date()

  // Define timeline phases in correct order:
  // Round Start → Round End → Judge Time → Submit Appeal → Review Appeal → Judge Rescore
  const phases = [
    {
      key: "round",
      label: t("contest.roundPeriod"),
      start: timeline.start,
      end: timeline.end,
    },
    timeline.judgeDeadline && {
      key: "judge",
      label: t("contest.judgeDeadline"),
      deadline: timeline.judgeDeadline,
    },
    timeline.appealSubmitDeadline && {
      key: "appealSubmit",
      label: t("contest.appealSubmit"),
      deadline: timeline.appealSubmitDeadline,
    },
    timeline.appealReviewDeadline && {
      key: "appealReview",
      label: t("contest.appealReview"),
      deadline: timeline.appealReviewDeadline,
    },
    timeline.judgeRescoreDeadline && {
      key: "judgeRescore",
      label: t("contest.judgeRescoreDeadline"),
      deadline: timeline.judgeRescoreDeadline,
    },
  ].filter(Boolean)

  // Determine current phase
  const getCurrentPhaseIndex = () => {
    const roundStart = new Date(timeline.start)
    const roundEnd = new Date(timeline.end)

    if (now < roundStart) {
      return -1 // Not started
    }

    if (now >= roundStart && now <= roundEnd) {
      return 0 // Round period
    }

    // Check judge period (only for Manual rounds)
    if (timeline.judgeDeadline) {
      const judgeEnd = new Date(timeline.judgeDeadline)
      if (now <= judgeEnd) {
        return phases.findIndex((p) => p.key === "judge")
      }
    }

    // Check appeal submit period
    if (timeline.appealSubmitDeadline) {
      const appealSubmitEnd = new Date(timeline.appealSubmitDeadline)
      if (now <= appealSubmitEnd) {
        return phases.findIndex((p) => p.key === "appealSubmit")
      }
    }

    // Check appeal review period
    if (timeline.appealReviewDeadline) {
      const appealReviewEnd = new Date(timeline.appealReviewDeadline)
      if (now <= appealReviewEnd) {
        return phases.findIndex((p) => p.key === "appealReview")
      }
    }

    // Check judge rescore period (only for Manual rounds)
    if (timeline.judgeRescoreDeadline) {
      const judgeRescoreEnd = new Date(timeline.judgeRescoreDeadline)
      if (now <= judgeRescoreEnd) {
        return phases.findIndex((p) => p.key === "judgeRescore")
      }
    }

    return phases.length // All completed
  }

  const currentPhaseIndex = getCurrentPhaseIndex()

  return (
    <div className="mt-3 pt-3 border-t border-gray-200">
      {/* Timeline - Scrollable horizontal */}
      <div className="overflow-x-auto pb-4">
        <div className="flex items-center min-w-max">
          {phases.map((phase, index) => {
            const isCompleted = index < currentPhaseIndex
            const isActive = index === currentPhaseIndex
            const isFuture = index > currentPhaseIndex
            const isLast = index === phases.length - 1

            return (
              <React.Fragment key={phase.key}>
                {/* Phase Circle and Label */}
                <div className="flex flex-col items-center gap-1.5 flex-shrink-0">
                  {/* Circle */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                      isCompleted
                        ? "bg-[#ff6b35] ring-4 ring-orange-50"
                        : isActive
                          ? "bg-white border-2 border-[#ff6b35] ring-4 ring-orange-100"
                          : "bg-white border-2 border-gray-200"
                    }`}
                  >
                    {isCompleted && (
                      <Check size={12} className="text-white" strokeWidth={4} />
                    )}
                    {isActive && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#ff6b35] animate-pulse"></div>
                    )}
                  </div>

                  {/* Label */}
                  <div
                    className={`text-[10px] font-medium text-center max-w-[140px] leading-tight ${
                      isCompleted || isActive
                        ? "text-gray-900"
                        : "text-gray-400"
                    }`}
                  >
                    <div className="whitespace-nowrap">{phase.label}</div>

                    {/* Show start and end time for round period */}
                    {phase.key === "round" && phase.start && phase.end && (
                      <div className="text-[9px] text-gray-500 mt-0.5 leading-tight">
                        <div>{formatDate(phase.start)}</div>
                        <div className="text-center my-0.5">-</div>
                        <div>{formatDate(phase.end)}</div>
                      </div>
                    )}

                    {/* Show deadline time for other phases */}
                    {phase.key !== "round" && phase.deadline && (
                      <div className="text-[9px] text-gray-500 mt-0.5 leading-tight">
                        <div>{formatDate(phase.deadline)}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Connecting Line */}
                {!isLast && (
                  <div className="flex-1 h-0.5 mx-1.5 min-w-[40px] max-w-[80px] relative">
                    <div
                      className={`h-full transition-all duration-300 ${
                        index < currentPhaseIndex
                          ? "bg-[#ff6b35]"
                          : index === currentPhaseIndex
                            ? "bg-gradient-to-r from-[#ff6b35] to-gray-300"
                            : "bg-gray-300"
                      }`}
                      style={
                        index === currentPhaseIndex
                          ? {
                              backgroundSize: "200% 100%",
                              animation: "shimmer 5s infinite",
                            }
                          : {}
                      }
                    />
                  </div>
                )}
              </React.Fragment>
            )
          })}
        </div>
      </div>

      {/* Add shimmer animation */}
      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }
      `}</style>
    </div>
  )
}

export default RoundTimeline
