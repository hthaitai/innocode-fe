import { ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

export const ExpandColumn = {
  id: "expand",
  header: "",
  size: 40,
  cell: ({ row }) => {
    const isExpanded = row.getIsExpanded()

    return (
      <motion.button
        onClick={(e) => {
          e.stopPropagation()
          row.toggleExpanded()
        }}
        animate={{ rotate: isExpanded ? 90 : 0 }}
        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
        className="p-0 flex items-center justify-center rounded select-none text-[#7A7574] hover:text-black"
        aria-label={isExpanded ? "Collapse" : "Expand"}
      >
        <ChevronRight size={16} className="leading-none" />
      </motion.button>
    )
  },
}
