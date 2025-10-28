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