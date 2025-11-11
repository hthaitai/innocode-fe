// Optimized color map for organizer-friendly visibility
export const statusColorMap = {
  // 🩶 Neutral / Inactive
  draft: "bg-gray-400",        // draft / not started
  archived: "bg-gray-500",     // old/archived contests
  resubmitted: "bg-gray-600",  // resubmitted contests
  inactive: "bg-gray-400",     
  blocked: "bg-gray-700",      // blocked / problematic

  // 💙 Active / Open / Running
  published: "bg-blue-400",    // ready to start
  open: "bg-blue-500",         // open for registration
  running: "bg-blue-600",      // currently running
  ongoing: "bg-blue-700",      // same as running but darker
  active: "bg-blue-600",       // general active

  // 💛 Pending / Review
  pending: "bg-amber-400",         // waiting
  pending_review: "bg-amber-500",  // under review
  under_review: "bg-amber-500",    
  in_review: "bg-amber-600",       // slightly darker
  upcoming: "bg-amber-300",        // lighter / soon

  // 💚 Success / Complete
  finalized: "bg-green-700",   // fully completed
  completed: "bg-green-500",   // completed
  approved: "bg-green-600",    // approved
  resolved: "bg-green-500",    // resolved / closed

  // ❤️ Error / Negative
  rejected: "bg-red-600",       // rejected
  disqualified: "bg-red-700",   // strong red for disqualified
  error: "bg-red-500",          // generic error

  // 🟣 Special / Escalated / Edge cases
  escalated: "bg-purple-500",   // special attention
}

// Status badge component
const StatusBadge = ({ status }) => {
  const safeStatus =
    typeof status === "string" && status.trim()
      ? status.trim().toLowerCase()
      : "draft"

  const colorClass = statusColorMap[safeStatus] || "bg-gray-500"

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

export default StatusBadge
