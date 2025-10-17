// color map for statuses
export const statusColorMap = {
  draft: "bg-[#7A7574]",
  published: "bg-[#FFB900]",
  finalized: "bg-[#107C10]",
}

// status badge component
export const StatusBadge = ({ status }) => (
  <span className="flex items-center gap-2">
    <span className={`w-2 h-2 rounded-full ${statusColorMap[status] || statusColorMap.draft}`}></span>
    {status.charAt(0).toUpperCase() + status.slice(1)}
  </span>
)

// date formatter
export const formatDateTime = (dateString) => {
  const date = new Date(dateString)
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }
  const parts = new Intl.DateTimeFormat("en-US", options).formatToParts(date)
  const day = parts.find((p) => p.type === "day").value
  const month = parts.find((p) => p.type === "month").value
  const year = parts.find((p) => p.type === "year").value
  const hour = parts.find((p) => p.type === "hour").value
  const minute = parts.find((p) => p.type === "minute").value
  const dayPeriod = parts.find((p) => p.type === "dayPeriod").value

  return `${day}/${month}/${year} ${hour}:${minute} ${dayPeriod}`
}
