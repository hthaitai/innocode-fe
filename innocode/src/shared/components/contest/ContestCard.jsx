import React from "react"
import { useTranslation } from "react-i18next"
import "./ContestCard.css"
import { Icon } from "@iconify/react"

const ContestCard = ({ contest, onClick }) => {
  const { t } = useTranslation("pages")

  // ✅ Calculate time left from start date
  const calculateTimeLeft = (startDate) => {
    if (!startDate) return t("contest.tba")
    const now = new Date()
    const start = new Date(startDate)
    const diff = start - now
    if (diff <= 0) return t("contest.started")
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
    const minutes = Math.floor((diff / (1000 * 60)) % 60)
    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    if (minutes > 0) return `${minutes}m`
    return t("contest.lessThanMinute")
  }

  // ✅ Get status color - same logic as ContestDetail
  const getStatusColor = (status) => {
    if (!status) return "text-gray-500 bg-gray-500/10"

    // Normalize status: lowercase and remove spaces
    const statusLower = status.toLowerCase().replace(/\s+/g, "")
    switch (statusLower) {
      case "upcoming":
        return "text-amber-500 bg-amber-500/10"
      case "ongoing":
        return "text-blue-500 bg-blue-500/10"
      case "completed":
        return "text-green-500 bg-green-500/10"
      case "published":
        return "text-green-500 bg-green-500/10"
      case "registrationopen":
        return "text-green-500 bg-green-500/10"
      case "registrationclosed":
        return "text-orange-500 bg-orange-500/10"
      case "paused":
        return "text-yellow-500 bg-yellow-500/10"
      case "delayed":
        return "text-orange-600 bg-orange-600/10"
      case "cancelled":
        return "text-red-500 bg-red-500/10"
      case "draft":
        return "text-gray-500 bg-gray-500/10"
      default:
        return "text-gray-500 bg-gray-500/10"
    }
  }

  // Calculate timeLeft from contest.start
  const timeLeft = contest.timeLeft || calculateTimeLeft(contest.start)

  // Format status label from status if statusLabel is not available
  const getStatusLabel = () => {
    const rawStatus = contest.statusLabel || contest.status
    if (!rawStatus) return null

    // Normalize status to lowercase for matching
    const statusLower = rawStatus.toLowerCase().replace(/\s+/g, "")

    // Map status to translation key
    const statusMap = {
      ongoing: "contest.statusLabels.ongoing",
      upcoming: "contest.statusLabels.upcoming",
      completed: "contest.statusLabels.completed",
      published: "contest.statusLabels.published",
      registrationopen: "contest.statusLabels.registrationopen",
      registrationclosed: "contest.statusLabels.registrationclosed",
      paused: "contest.statusLabels.paused",
      delayed: "contest.statusLabels.delayed",
      cancelled: "contest.statusLabels.cancelled",
      draft: "contest.statusLabels.draft",
    }

    const translationKey = statusMap[statusLower]
    if (translationKey) {
      return t(translationKey)
    }

    // Fallback: format status to readable label if no translation found
    return rawStatus
      .replace(/([A-Z])/g, " $1")
      .trim()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ")
  }

  const statusLabel = getStatusLabel()

  return (
    <div className="contest-card bg-white" onClick={onClick}>
      {/* Contest Icon/Image */}
      <div className="contest-card__icon">
        {contest.imgUrl ? (
          <img
            src={contest.imgUrl}
            alt={contest.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = "none"
              e.target.parentElement.innerHTML = `
                <div class="flex items-center justify-center w-full h-full bg-orange-100">
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                    <path d="M20.5 6H18V4C18 2.9 17.1 2 16 2H8C6.9 2 6 2.9 6 4V6H3.5C2.67 6 2 6.67 2 7.5V9.5C2 10.33 2.67 11 3.5 11H4.09L5.41 20.6C5.58 21.9 6.69 23 8 23H16C17.31 23 18.42 21.9 18.59 20.6L19.91 11H20.5C21.33 11 22 10.33 22 9.5V7.5C22 6.67 21.33 6 20.5 6ZM8 4H16V6H8V4ZM17.5 11L16.21 20H7.79L6.5 11H17.5Z" fill="#ff6b35"/>
                  </svg>
                </div>
              `
            }}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-orange-100">
            <Icon icon="mdi:trophy" className="text-orange-500 text-4xl" />
          </div>
        )}
      </div>

      {/* Contest Content */}
      <div className="contest-card__content">
        {/* Status Badge */}
        {statusLabel && (
          <div className="mb-2">
            <span
              className={`inline-block px-2 py-1 text-xs font-semibold rounded ${getStatusColor(
                contest.statusLabel || contest.status,
              )}`}
            >
              {statusLabel}
            </span>
          </div>
        )}

        {/* Title */}
        <h3 className="contest-card__title">{contest.name}</h3>

        {/* Description */}
        <p className="contest-card__description">{contest.description}</p>

        {/* Meta Info */}
        <div className="contest-card__meta">
          {" "}
          <span className="contest-card__time">
            <Icon icon="mdi:clock-outline" className="inline mr-1" />
            {timeLeft}
          </span>
        </div>

        {/* Rewards */}
        {contest.rewardsText && (
          <div className="mt-2 text-sm text-orange-600 font-medium truncate">
            <Icon icon="mdi:gift" className="inline mr-1" />
            <span className="truncate">{contest.rewardsText}</span>
          </div>
        )}

        {/* Year */}
        {contest.year && (
          <div className="mt-1 text-xs text-gray-500">
            <Icon icon="mdi:calendar" className="inline mr-1" />
            {contest.year}
          </div>
        )}
      </div>

      {/* Arrow Icon */}
      <div className="contest-card__arrow transition-all duration-300">
        <Icon icon="mdi:chevron-right" />
      </div>
    </div>
  )
}

export default ContestCard
