// Optimized color map
export const statusColorMap = {
  draft: "bg-gray-400",
  archived: "bg-gray-500",
  resubmitted: "bg-gray-600",
  inactive: "bg-gray-400",
  blocked: "bg-gray-700",

  published: "bg-blue-400",
  open: "bg-blue-500",
  registrationopen: "bg-blue-500",
  running: "bg-blue-600",
  ongoing: "bg-blue-700",
  active: "bg-blue-600",

  pending: "bg-amber-400",
  pending_review: "bg-amber-500",
  under_review: "bg-amber-500",
  in_review: "bg-amber-600",
  upcoming: "bg-amber-300",

  finalized: "bg-green-700",
  completed: "bg-green-500",
  approved: "bg-green-600",
  resolved: "bg-green-500",

  rejected: "bg-red-600",
  disqualified: "bg-red-700",
  error: "bg-red-500",
  registrationclosed: "bg-red-600",

  escalated: "bg-purple-500",
}

// StatusBadge component
const StatusBadge = ({ status }) => {
  if (!status) status = "draft"

  // Normalize status: lowercase, remove spaces & special chars
  const safeStatus = status
    .toString()
    .normalize("NFKC") // normalize unicode
    .replace(/\s+/g, "") // remove all spaces
    .replace(/-/g, "") // remove dashes
    .toLowerCase()

  // Get color, default gray if unknown
  const colorClass = statusColorMap[safeStatus] || "bg-gray-500"

  // Format display: split camelCase or snake_case into words
  const displayStatus = status
    .replace(/([a-z])([A-Z])/g, "$1 $2") // split camelCase
    .replace(/_/g, " ") // replace underscores
    .trim()

  return (
    <span className="flex items-center gap-2 text-sm">
      <span className={`w-2 h-2 rounded-full ${colorClass}`} />
      {displayStatus}
    </span>
  )
}

export default StatusBadge
