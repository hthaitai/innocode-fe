import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import LanguageDetector from "i18next-browser-languagedetector"

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
        pages: enPages,
        breadcrumbs: enBreadcrumbs,
        round: enRound,
      },
      vi: {
        common: viCommon,
        policy: viPolicy,
        home: viHome,
        auth: viAuth,
        errors: viErrors,
        about: viAbout,
        pages: viPages,
        pages: viPages,
        breadcrumbs: viBreadcrumbs,
        round: viRound,
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

export default i18n
