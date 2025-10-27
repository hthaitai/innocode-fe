// color map for statuses
export const statusColorMap = {
  // Contest
  draft: "bg-[#7A7574]",       // gray
  published: "bg-[#FFB900]",   // amber
  running: "bg-[#0078D4]",     // blue
  finalized: "bg-[#107C10]",   // green

  // Round
  upcoming: "bg-[#B3B3B3]",    // light gray
  ongoing: "bg-[#0078D4]",     // blue
  completed: "bg-[#107C10]",   // green
  archived: "bg-[#605E5C]",    // darker gray

  // Team
  pending: "bg-[#FFB900]",     // amber
  approved: "bg-[#107C10]",    // green
  disqualified: "bg-[#A80000]",// red
  completed: "bg-[#005A9E]",   // deep blue

  // Submission
  resubmitted: "bg-[#605E5C]", // gray
  approved: "bg-[#107C10]",    // green
  rejected: "bg-[#A80000]",    // red
  pending_review: "bg-[#FFB900]", // amber
  pending: "bg-[#FFB900]",     // alias

  // Appeal
  open: "bg-[#0078D4]",        // blue
  in_review: "bg-[#FF8C00]",   // orange
  resolved: "bg-[#107C10]",    // green
}

// status badge component
export const StatusBadge = ({ status }) => {
  // normalize and validate
  const safeStatus =
    typeof status === "string" && status.trim()
      ? status.trim().toLowerCase()
      : "draft"

  const colorClass = statusColorMap[safeStatus] || "bg-[#7A7574]"

  return (
    <span className="flex items-center gap-2 text-sm">
      <span className={`w-2 h-2 rounded-full ${colorClass}`} />
      {safeStatus
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")}
    </span>
  )
}


// date formatter
export const formatDateTime = (dateString) => {
  if (!dateString) return "—" // Handle null, undefined, or empty
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return "—" // Handle invalid date

  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }

  const parts = new Intl.DateTimeFormat("en-US", options).formatToParts(date)
  const get = (type) => parts.find((p) => p.type === type)?.value || ""

  return `${get("day")}/${get("month")}/${get("year")} ${get("hour")}:${get(
    "minute"
  )} ${get("dayPeriod")}`
}
