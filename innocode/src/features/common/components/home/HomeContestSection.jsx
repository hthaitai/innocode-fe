import React from "react"
import { ArrowRight } from "lucide-react"
import { useTranslation } from "react-i18next"
import ContestCard from "../../../../shared/components/contest/ContestCard"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"

const HomeContestSection = ({
  title,
  subtitle,
  contests,
  loading,
  indicatorColor,
  loadingColor,
  onViewAll,
  onContestClick,
}) => {
  const { t } = useTranslation("home")

  if (!loading && (!contests || contests.length === 0)) {
    return null
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <div className={`w-1 h-8 rounded-full ${indicatorColor}`}></div>
            {title}
          </h2>
          <p className="text-gray-600">{subtitle}</p>
        </div>
        <button
          onClick={onViewAll}
          className="text-[#ff6b35] hover:text-[#ff8c5a] font-semibold flex items-center gap-2 transition-colors text-sm"
        >
          {t("viewAll")}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div
            className={`animate-spin rounded-full h-12 w-12 border-4 border-gray-200 ${loadingColor}`}
          ></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contests.map((contest) => (
            <AnimatedSection key={contest.contestId} direction="bottom">
              <ContestCard
                contest={contest}
                onClick={() => onContestClick(contest)}
              />
            </AnimatedSection>
          ))}
        </div>
      )}
    </section>
  )
}

export default HomeContestSection
