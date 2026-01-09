import React from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { Mail, MapPin, Github } from "lucide-react"

const Footer = () => {
  const { t } = useTranslation(["footer", "common"])

  return (
    <footer className="w-full bg-[#18181B] text-gray-300 py-12 border-t border-gray-800">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Brand Column */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white flex items-center gap-2">
              <span className="text-[#ff6b35]">InnoCode</span>
            </h3>
            <p className="text-sm leading-relaxed text-gray-400">
              {t("footer:description")}
            </p>
            <div className="flex gap-4 pt-2">
              <a
                href="https://github.com/hthaitai/innocode-fe"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#ff6b35] transition-colors duration-200"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              {t("footer:platform")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/"
                  className="hover:text-[#ff6b35] transition-colors duration-200 block py-1"
                >
                  {t("common:navbar.home")}
                </Link>
              </li>
              <li>
                <Link
                  to="/contests"
                  className="hover:text-[#ff6b35] transition-colors duration-200 block py-1"
                >
                  {t("common:navbar.contests")}
                </Link>
              </li>
              <li>
                <Link
                  to="/leaderboard"
                  className="hover:text-[#ff6b35] transition-colors duration-200 block py-1"
                >
                  {t("common:navbar.leaderboard")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              {t("footer:resources")}
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  to="/about"
                  className="hover:text-[#ff6b35] transition-colors duration-200 block py-1"
                >
                  {t("common:navbar.about")}
                </Link>
              </li>
              <li>
                <Link
                  to="/policy"
                  className="hover:text-[#ff6b35] transition-colors duration-200 block py-1"
                >
                  {t("common:navbar.policy")}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">
              {t("footer:contact")}
            </h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#ff6b35] shrink-0 mt-0.5" />
                <span>{t("footer:address")}</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-[#ff6b35] shrink-0" />
                {/* <a href="#" className="hover:text-white transition-colors">
                  innocodechallenge@gmail.com
                </a> */}
                <div>innocodechallenge@gmail.com</div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>{t("footer:copyright", { year: new Date().getFullYear() })}</p>
          <div className="flex gap-6">
            {/* <Link to="/policy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/policy" className="hover:text-white transition-colors">
              Terms of Service
            </Link> */}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
