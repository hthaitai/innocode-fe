// color map for statuses
export const statusColorMap = {
  // 🩶 Neutral / Inactive
  draft: "bg-[#9CA3AF]", // gray-400
  archived: "bg-[#6B7280]", // gray-500
  resubmitted: "bg-[#6B7280]", // gray-500
  inactive: "bg-[#9CA3AF]", // gray-400
  blocked: "bg-[#4B5563]", // gray-600

  // 💙 Active / Open / Running
  published: "bg-[#3B82F6]", // blue-500
  running: "bg-[#2563EB]", // blue-600
  ongoing: "bg-[#2563EB]", // blue-600
  open: "bg-[#2563EB]", // blue-600
  active: "bg-[#2563EB]", // users

  // 💛 Pending / Review
  pending: "bg-[#FBBF24]", // amber-400
  pending_review: "bg-[#F59E0B]", // amber-500
  under_review: "bg-[#F59E0B]", // amber-500
  in_review: "bg-[#D97706]", // amber-600 (slightly darker to differentiate)
  upcoming: "bg-[#FCD34D]", // amber-300 (lighter for rounds)

  // 💚 Success / Complete
  finalized: "bg-[#16A34A]", // green-600
  completed: "bg-[#22C55E]", // green-500
  approved: "bg-[#16A34A]", // green-600
  resolved: "bg-[#22C55E]", // green-500

  // ❤️ Error / Negative
  rejected: "bg-[#DC2626]", // red-600
  disqualified: "bg-[#B91C1C]", // red-700
  error: "bg-[#EF4444]", // red-500

  // 🟣 Special / Escalated / Edge cases
  escalated: "bg-[#8B5CF6]", // violet-500
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
