import { AnimatePresence, motion } from "framer-motion"
import { EASING } from "../../../../shared/components/ui/easing"
import { useTranslation } from "react-i18next"

const NameSuggestion = ({ suggestion, onApply }) => {
  const { t } = useTranslation("contest")

  if (!suggestion) return null

  return (
    <AnimatePresence>
      <motion.button
        key="name-suggestion"
        type="button"
        initial={{ opacity: 0, y: -4 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: { duration: 0.2, ease: EASING.fluentOut },
        }}
        exit={{
          opacity: 0,
          y: -4,
          transition: { duration: 0.15, ease: EASING.fluentOut },
        }}
        onClick={onApply}
        className="text-[#D32F2F] text-xs leading-4 mt-1 self-start"
      >
        {t("suggestion.useSuggestedName")}{" "}
        <span className="hover:underline cursor-pointer">{suggestion}</span>.
      </motion.button>
    </AnimatePresence>
  )
}

export default NameSuggestion
