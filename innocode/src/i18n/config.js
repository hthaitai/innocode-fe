import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"
import dayjs from "dayjs"
import "dayjs/locale/vi"
import "dayjs/locale/en"

import enCommon from "../locales/en/common.json"
import viCommon from "../locales/vi/common.json"
import enPolicy from "../locales/en/policy.json"
import viPolicy from "../locales/vi/policy.json"
import enHome from "../locales/en/home.json"
import viHome from "../locales/vi/home.json"
import enAuth from "../locales/en/auth.json"
import viAuth from "../locales/vi/auth.json"
import enErrors from "../locales/en/errors.json"
import viErrors from "../locales/vi/errors.json"
import enAbout from "../locales/en/about.json"
import viAbout from "../locales/vi/about.json"
import enPages from "../locales/en/pages.json"
import viPages from "../locales/vi/pages.json"
import enBreadcrumbs from "../locales/en/breadcrumbs.json"
import viBreadcrumbs from "../locales/vi/breadcrumbs.json"
import enRound from "../locales/en/round.json"
import viRound from "../locales/vi/round.json"
import enJudge from "../locales/en/judge.json"
import viJudge from "../locales/vi/judge.json"
import enLeaderboard from "../locales/en/leaderboard.json"
import viLeaderboard from "../locales/vi/leaderboard.json"
import enCertificate from "../locales/en/certificate.json"
import viCertificate from "../locales/vi/certificate.json"

import enAppeal from "../locales/en/appeal.json"
import viAppeal from "../locales/vi/appeal.json"
import enPlagiarism from "../locales/en/plagiarism.json"
import viPlagiarism from "../locales/vi/plagiarism.json"
import enContest from "../locales/en/contest.json"
import viContest from "../locales/vi/contest.json"
import enNotifications from "../locales/en/notifications.json"
import viNotifications from "../locales/vi/notifications.json"
import enFooter from "../locales/en/footer.json"
import viFooter from "../locales/vi/footer.json"
import enLoader from "../locales/en/loader.json"
import viLoader from "../locales/vi/loader.json"
import enResults from "../locales/en/results.json"
import viResults from "../locales/vi/results.json"
import enDashboard from "../locales/en/dashboard.json"
import viDashboard from "../locales/vi/dashboard.json"
import enTeams from "../locales/en/teams.json"
import viTeams from "../locales/vi/teams.json"
import enQuiz from "../locales/en/quiz.json"
import viQuiz from "../locales/vi/quiz.json"

i18n
  .use(LanguageDetector) // Tự động detect ngôn ngữ từ browser
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        common: enCommon,
        policy: enPolicy,
        home: enHome,
        auth: enAuth,
        errors: enErrors,
        about: enAbout,
        pages: enPages,
        breadcrumbs: enBreadcrumbs,
        round: enRound,
        judge: enJudge,
        leaderboard: enLeaderboard,
        certificate: enCertificate,
        appeal: enAppeal,
        plagiarism: enPlagiarism,
        notifications: enNotifications,
        contest: enContest,
        footer: enFooter,
        loader: enLoader,
        results: enResults,
        dashboard: enDashboard,
        teams: enTeams,
        quiz: enQuiz,
      },
      vi: {
        common: viCommon,
        policy: viPolicy,
        home: viHome,
        auth: viAuth,
        errors: viErrors,
        about: viAbout,
        pages: viPages,
        breadcrumbs: viBreadcrumbs,
        round: viRound,
        judge: viJudge,
        leaderboard: viLeaderboard,
        certificate: viCertificate,
        appeal: viAppeal,
        plagiarism: viPlagiarism,
        notifications: viNotifications,
        contest: viContest,
        footer: viFooter,
        loader: viLoader,
        results: viResults,
        dashboard: viDashboard,
        teams: viTeams,
        quiz: viQuiz,
      },
    },
    fallbackLng: "en",
    defaultNS: "common",
    interpolation: {
      escapeValue: false, // React đã escape rồi
    },
    detection: {
      // Lưu ngôn ngữ vào localStorage
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  })

i18n.on("languageChanged", (lng) => {
  dayjs.locale(lng)
})

// Set initial locale
if (i18n.language) {
  dayjs.locale(i18n.language)
}

export default i18n
