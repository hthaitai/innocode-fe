import React from "react"
import { useTranslation } from "react-i18next"
import { ArrowRight, Trophy } from "lucide-react"
import bannerImage from "../../../../assets/banner.jpg"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"

const HomeHero = ({ onViewAllContests, onViewLeaderboard }) => {
  const { t } = useTranslation("home")

  return (
    <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${bannerImage})`,
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
      </div>

      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl text-white">
            <AnimatedSection direction="bottom">
              <h1 className="text-large-title md:text-display mb-6 leading-tight">
                {t("title")}
                <span className="block text-[#ff6b35]">{t("subtitle")}</span>
              </h1>
              <p className="text-subtitle-1 mb-8 text-gray-200 leading-relaxed">
                {t("description")}
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={onViewAllContests}
                  className="px-6 py-3 bg-[#ff6b35] hover:bg-[#ff8c5a] text-white text-body-1-strong rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  {t("viewContests")}
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={onViewLeaderboard}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white text-body-1-strong rounded-lg transition-colors duration-200 backdrop-blur-sm flex items-center gap-2"
                >
                  <Trophy className="w-5 h-5" />
                  {t("leaderboard")}
                </button>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HomeHero
