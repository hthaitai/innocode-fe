// color map for statuses
export const statusColorMap = {
  draft: "bg-[#7A7574]",
  published: "bg-[#FFB900]",
  finalized: "bg-[#107C10]",
}

// status badge component
export const StatusBadge = ({ status }) => {
  // ensure status is always a string, fallback to 'draft'
  const safeStatus =
    typeof status === "string" && status.trim() ? status : "draft"

  return (
    <span className="flex items-center gap-2">
      <span
        className={`w-2 h-2 rounded-full ${statusColorMap[safeStatus]}`}
      ></span>
      {safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1)}
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
