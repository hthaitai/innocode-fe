/**
 * Date and time utility functions
 * Centralized location for all date/time formatting and conversion operations
 */
import i18n from "../../i18n/config"

/**
 * Formats a date string for display as dd/mm/yyyy HH:MM AM/PM
 * @param {string} dateString - ISO date string (assumed to be UTC if no timezone specified)
 * @returns {string} Formatted date string or "—" if invalid
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return "—" // Handle null, undefined, or empty

  // Ensure the date string is treated as UTC if it doesn't have timezone info
  let date
  if (typeof dateString === "string") {
    // Check if the string has timezone info (Z, +HH:mm, -HH:mm, or +HHmm, -HHmm)
    const hasTimezone =
      dateString.includes("Z") || /[+-]\d{2}:?\d{2}$/.test(dateString)

    if (!hasTimezone && dateString.includes("T")) {
      // If no timezone indicator but has time component, assume it's UTC and append 'Z'
      date = new Date(dateString + "Z")
    } else {
      date = new Date(dateString)
    }
  } else {
    date = new Date(dateString)
  }

  if (isNaN(date.getTime())) return "—" // Handle invalid date

  // Format consistently as dd/mm/yyyy HH:MM AM/PM (in local time)
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()

  let hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, "0")
  const formattedHours = String(hours).padStart(2, "0")

  return `${day}/${month}/${year} ${formattedHours}:${minutes}`
}

/**
 * Converts a backend ISO datetime string (UTC)
 * into a "datetime-local" string for inputs, adjusted for local timezone.
 * Example: "2025-11-04T16:11:00Z" → "2025-11-04T23:11" in Vietnam (UTC+7)
 */
export const toDatetimeLocal = (isoString) => {
  if (!isoString) return ""

  // Normalize timezone: ensure final Z or offset is valid
  const normalized = isoString.replace(/([+-]\d{2}):(\d{2})$/, "$1$2")

  const date = new Date(normalized)

  if (isNaN(date.getTime())) {
    // Fallback: force parse by removing offset and treating as UTC
    const utc = isoString.split(/[+-]/)[0] + "Z"
    const forced = new Date(utc)
    if (isNaN(forced.getTime())) return ""
    return forced.toISOString().slice(0, 16)
  }

  const pad = (n) => String(n).padStart(2, "0")

  const year = date.getFullYear()
  const month = pad(date.getMonth() + 1)
  const day = pad(date.getDate())
  const hours = pad(date.getHours())
  const minutes = pad(date.getMinutes())

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

/**
 * Converts a "datetime-local" value (local time)
 * into an ISO UTC string for backend submission.
 * Example: "2025-11-05T22:50" (local UTC+7) → "2025-11-05T15:50:00.000Z" (UTC)
 */
export const fromDatetimeLocal = (localString) => {
  if (!localString) return ""
  const date = new Date(localString)
  if (isNaN(date.getTime())) return ""

  // ✅ Strip milliseconds for backend
  return date.toISOString().replace(/\.\d{3}Z$/, "Z")
}
