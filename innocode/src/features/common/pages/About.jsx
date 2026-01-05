import React from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { BREADCRUMBS } from "@/config/breadcrumbs"
import { Terminal, Globe, Zap } from "lucide-react"
import { AnimatedSection } from "../../../shared/components/ui/AnimatedSection"

const About = () => {
  const { t } = useTranslation("about")
  const navigate = useNavigate()

  // --- Data Constants (Scalable configuration) ---

  const FEATURES = [
    {
      title: t("features.realTimeExecution.title"),
      description: t("features.realTimeExecution.description"),
      icon: Terminal,
    },
    {
      title: t("features.globalLeaderboards.title"),
      description: t("features.globalLeaderboards.description"),
      icon: Globe,
    },
    {
      title: t("features.instantFeedback.title"),
      description: t("features.instantFeedback.description"),
      icon: Zap,
    },
  ]
  return (
    <AnimatedSection direction="bottom">
      <div className="space-y-20 pb-16">
        {/* 1. Hero Section */}
        <section className="relative text-center max-w-4xl mx-auto pt-8 md:pt-16 px-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-3xl opacity-10 pointer-events-none">
            {/* Abstract decorative gradient blob */}
            <div className="w-full h-full bg-gradient-to-r from-[#E05307] to-orange-300 blur-3xl rounded-full" />
          </div>

          <h1 className="relative text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900 mb-6">
            {t("hero.title1")}
            <br />
            <span className="text-[#E05307]">{t("hero.title2")}</span>
          </h1>
          <p className="relative text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            {t("hero.description")}
          </p>
        </section>

        {/* 3. Mission / Split Section */}
        <section className="bg-gradient-to-br from-gray-50 to-orange-50/30 rounded-[5px] p-8 md:p-16 max-w-7xl mx-auto overflow-hidden relative">
          {/* Decorative grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.03] pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#E05307 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          ></div>

          <div className="relative grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                {t("mission.title")} <br />
                <span className="text-[#E05307] decoration-4 underline decoration-orange-200 underline-offset-4">
                  {t("mission.titleHighlight")}
                </span>
                .
              </h2>
              <p className="text-gray-600 mb-6 text-lg leading-relaxed">
                {t("mission.description1")}
              </p>
              <p className="text-gray-600 text-lg leading-relaxed">
                {t("mission.description2")}
              </p>
            </div>
            {/* Visual Element representing Code/Tech */}
            <div className="bg-gray-900 rounded-xl shadow-2xl p-6 transform rotate-1 hover:rotate-0 transition-transform duration-500">
              <div className="flex space-x-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <code className="block text-sm font-mono text-gray-300">
                <span className="text-[#E05307]">class</span>{" "}
                <span className="text-yellow-400">InnoCoder</span> {"{"} <br />
                &nbsp;&nbsp;<span className="text-[#E05307]">constructor</span>
                (skill, passion) {"{"} <br />
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span className="text-purple-400">this</span>.skill = skill;{" "}
                <br />
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span className="text-purple-400">this</span>.passion = passion;{" "}
                <br />
                &nbsp;&nbsp;{"}"} <br />
                <br />
                &nbsp;&nbsp;<span className="text-blue-400">
                  compete
                </span>() {"{"} <br />
                &nbsp;&nbsp;&nbsp;&nbsp;
                <span className="text-purple-400">return</span>{" "}
                <span className="text-green-400">"Victory"</span>; <br />
                &nbsp;&nbsp;{"}"} <br />
                {"}"}
              </code>
            </div>
          </div>
        </section>

        {/* 4. Values / Features */}
        <section className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">
              {t("features.title")}
            </h2>
            <p className="text-gray-500 mt-2">{t("features.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {FEATURES.map((item, idx) => (
              <div
                key={idx}
                className="group p-8 bg-white rounded-[5px] border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center text-[#E05307] mb-6 group-hover:bg-[#E05307] group-hover:text-white transition-colors duration-300">
                  <item.icon size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. CTA Section */}
        <section className="max-w-4xl mx-auto px-4 text-center">
          <div className="bg-[#E05307] rounded-[5px] p-12 shadow-xl shadow-orange-900/20 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

            <h2 className="relative text-3xl md:text-4xl font-bold mb-6">
              {t("cta.title")}
            </h2>
            <p className="relative text-orange-100 mb-8 text-lg max-w-xl mx-auto">
              {t("cta.description")}
            </p>
            <button
              onClick={() => navigate("/contests")}
              className="relative bg-white text-[#E05307] px-8 py-3.5 rounded-full font-bold hover:bg-orange-50 transition-colors shadow-lg active:scale-95"
            >
              {t("cta.button")}
            </button>
          </div>
        </section>
      </div>
    </AnimatedSection>
  )
}

export default About
