import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";

export default function NotFound() {
  const { t } = useTranslation("pages");
  
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4 bg-white">
      {/* Floating 404 */}
      <motion.h1
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 80 }}
        className="text-7xl font-extrabold mb-4 text-gray-800"
      >
        {t("notFound.title")}
      </motion.h1>

      {/* Wiggle animation */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-lg text-gray-500 mb-6"
      >
        {t("notFound.message")}
      </motion.p>

      {/* Bouncing button */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
      >
        <Link
          to="/"
          className="button-orange px-4 py-2 flex items-center justify-center rounded-full text-white shadow-lg"
        >
          {t("notFound.backToHome")}
        </Link>
      </motion.div>

      {/* Floating subtle animation */}
      <motion.div
        className="mt-10 text-gray-300 text-sm"
        animate={{ y: [0, -8, 0] }}
        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
      >
        ✨ {t("notFound.subtitle")}
      </motion.div>
    </div>
  );
}
