import { ChevronRight } from "lucide-react"

export const ExpandColumn = {
  id: "expand",
  header: "",
  size: 40,
  cell: ({ row }) => {
    const isExpanded = row.getIsExpanded()

    return (
      <button
        onClick={(e) => {
          e.stopPropagation()
          row.toggleExpanded()
        }}
        className={`p-0 flex items-center justify-center rounded select-none text-[#7A7574] hover:text-black ${
          isExpanded ? "rotate-90" : "rotate-0"
        }`}
        aria-label={isExpanded ? "Collapse" : "Expand"}
        style={{ transition: "none" }} // ensures no animation
      >
        <ChevronRight size={16} className="leading-none" />
      </button>
    )
  },
}
