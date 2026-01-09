import React from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"

const AboutCTA = () => {
  const { t } = useTranslation("about")
  const navigate = useNavigate()

  return (
    <section className="relative w-full py-16 overflow-hidden isolate">
      {/* Full Width Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#E05307] via-[#FF7F00] to-[#E05307] -z-10" />

      {/* Decorative Floating Elements (Static) */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10 opacity-[0.1]" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-yellow-400 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 -z-10 opacity-[0.2]" />

      <div className="container mx-auto px-4 text-center">
        <AnimatedSection direction="bottom">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-large-title font-bold text-white mb-4 tracking-tight">
              {t("cta.title")}
            </h2>
            <p className="text-subtitle-2 text-orange-50 mb-8 max-w-lg mx-auto leading-relaxed">
              {t("cta.description")}
            </p>
            <button
              onClick={() => navigate("/contests")}
              className="relative bg-white text-[#E05307] px-8 py-4 rounded-full text-body-1-strong font-bold hover:bg-orange-50 transition-all shadow-lg hover:shadow-xl hover:scale-105 active:scale-95"
            >
              {t("cta.button")}
            </button>
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}

export default AboutCTA
