import React from "react"
import { useTranslation } from "react-i18next"

const AboutMission = () => {
  const { t } = useTranslation("about")

  const fullCode = `class InnoCoder {
  constructor(skill, passion) {
    this.skill = skill;
    this.passion = passion;
  }

  compete() {
    return "Victory";
  }
}`

  // Highlight syntax simply
  const renderHighlightedCode = (code) => {
    return code
      .replace(
        /class|constructor|this|return/g,
        '<span class="text-[#E05307] font-semibold">$&</span>'
      )
      .replace(/"Victory"/g, '<span class="text-green-400">$&</span>')
      .replace(/InnoCoder/g, '<span class="text-yellow-400">$&</span>')
      .replace(/skill|passion/g, '<span class="text-purple-300">$&</span>')
      .replace(/compete/g, '<span class="text-blue-400">$&</span>')
  }

  return (
    <section className="relative">
      <div className="grid md:grid-cols-2 gap-16 items-center">
        {/* Text Content */}
        <div>
          <h2 className="text-title-1 font-bold text-gray-900 mb-6">
            {t("mission.title")} <br />
            <span className="text-[#E05307] decoration-4 underline decoration-orange-200 underline-offset-4">
              {t("mission.titleHighlight")}
            </span>
            .
          </h2>
          <div className="space-y-6 text-body-1 text-gray-600">
            <p className="leading-relaxed">{t("mission.description1")}</p>
            <p className="leading-relaxed">{t("mission.description2")}</p>
          </div>
        </div>

        {/* Visual Element representing Code/Tech */}
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-r from-orange-400 to-purple-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
          <div className="relative bg-gray-900 rounded-xl shadow-2xl p-8 transform rotate-1 group-hover:rotate-0 transition-transform duration-500 border border-gray-800">
            <div className="flex space-x-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-500 hover:bg-red-400 cursor-pointer"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500 hover:bg-yellow-400 cursor-pointer"></div>
              <div className="w-3 h-3 rounded-full bg-green-500 hover:bg-green-400 cursor-pointer"></div>
            </div>

            <pre className="block text-body-1 font-mono text-gray-300 overflow-x-auto">
              {/* Static Code Block */}
              <code
                dangerouslySetInnerHTML={{
                  __html: renderHighlightedCode(fullCode),
                }}
              />
            </pre>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutMission
