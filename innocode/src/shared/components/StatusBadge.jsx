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
  denied: "bg-red-600",
  disqualified: "bg-red-700",
  error: "bg-red-500",
  registrationclosed: "bg-red-600",

  escalated: "bg-purple-500",

  accepted: "bg-green-600",
  cancelled: "bg-red-500",
  revoked: "bg-red-700",
  expired: "bg-gray-500",
  pendinginvite: "bg-amber-400",

  notinvited: "bg-gray-400",
}

import { useTranslation } from "react-i18next"

// StatusBadge component
const StatusBadge = ({ status, translate = false, label }) => {
  const { t } = useTranslation("pages")

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

  // Get display status
  let displayStatus = label

  if (!displayStatus) {
    // Check if this is a role registration status (pending, approved, denied)
    const roleRegistrationStatusMap = {
      pending: "roleRegistrations.pending",
      approved: "roleRegistrations.approved",
      denied: "roleRegistrations.denied",
    }

    const roleRegistrationKey = roleRegistrationStatusMap[safeStatus]
    if (roleRegistrationKey) {
      // Use translation for role registration status
      displayStatus = t(roleRegistrationKey)
    } else if (translate) {
      // Use translation for contest status
      // Map status to translation key
      const statusMap = {
        ongoing: "contest.statusLabels.ongoing",
        upcoming: "contest.statusLabels.upcoming",
        completed: "contest.statusLabels.completed",
        published: "contest.statusLabels.published",
        registrationopen: "contest.statusLabels.registrationOpen",
        registrationclosed: "contest.statusLabels.registrationClosed",
        draft: "contest.statusLabels.draft",
      }

      const translationKey = statusMap[safeStatus]
      displayStatus = translationKey
        ? t(translationKey)
        : status
            .replace(/([a-z])([A-Z])/g, "$1 $2")
            .replace(/_/g, " ")
            .trim()
    } else {
      // Format display: split camelCase or snake_case into words
      displayStatus = status
        .replace(/([a-z])([A-Z])/g, "$1 $2") // split camelCase
        .replace(/_/g, " ") // replace underscores
        .trim()
    }
  }

  return (
    <span className="flex items-center gap-2 text-sm">
      <span className={`w-2 h-2 rounded-full ${colorClass}`} />
      {displayStatus}
    </span>
  )
}

export default StatusBadge
