import React from "react"
import { useTranslation } from "react-i18next"
import { Check, Clock } from "lucide-react"

/**
 * RoundTimeline Component - Simple horizontal timeline with circles and lines
 * @param {object} timeline - Timeline data from API
 * @param {boolean} loading - Loading state
 */
const RoundTimeline = ({ timeline, loading }) => {
  const { t } = useTranslation("pages")

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

  // Define timeline phases
  const phases = [
    {
      key: "round",
      label: t("contest.roundPeriod"),
      start: timeline.start,
      end: timeline.end,
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
    timeline.judgeDeadline && {
      key: "judge",
      label: t("contest.judgeDeadline"),
      deadline: timeline.judgeDeadline,
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

    // Check judge period
    if (timeline.judgeDeadline) {
      const judgeEnd = new Date(timeline.judgeDeadline)
      if (now <= judgeEnd) {
        return phases.findIndex((p) => p.key === "judge")
      }
    }

    return phases.length // All completed
  }

  const currentPhaseIndex = getCurrentPhaseIndex()

  return (
    <div className="mt-3 pt-3 border-t border-gray-200">
      {/* Timeline - Centered */}
      <div className="flex items-center justify-center">
        <div className="flex items-center max-w-2xl">
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
                        ? "bg-[#ff6b35] text-white"
                        : isActive
                        ? "bg-[#ff6b35] text-white ring-3 ring-orange-200"
                        : "bg-white border-3 border-gray-300"
                    }`}
                  >
                    {isCompleted || isActive ? (
                      <Check size={14} strokeWidth={3} />
                    ) : null}
                  </div>

                  {/* Label */}
                  <div
                    className={`text-[10px] font-medium text-center max-w-[70px] leading-tight whitespace-nowrap ${
                      isCompleted || isActive
                        ? "text-gray-900"
                        : "text-gray-400"
                    }`}
                  >
                    {phase.label}
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
