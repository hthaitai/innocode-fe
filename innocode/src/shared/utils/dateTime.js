/**
 * Date and time utility functions
 * Centralized location for all date/time formatting and conversion operations
 */

/**
 * Formats a date string for display as dd/mm/yyyy HH:MM AM/PM
 * @param {string} dateString - ISO date string or any valid date string
 * @returns {string} Formatted date string or "—" if invalid
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return "—" // Handle null, undefined, or empty
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return "—" // Handle invalid date

  // Format consistently as dd/mm/yyyy HH:MM AM/PM
  const day = String(date.getDate()).padStart(2, "0")
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const year = date.getFullYear()
  
  let hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, "0")
  const ampm = hours >= 12 ? "PM" : "AM"
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  const formattedHours = String(hours).padStart(2, "0")

  return `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`
}

/**
 * Converts a backend ISO datetime string (UTC) into a
 * "datetime-local" compatible string for inputs.
 * @param {string} isoString - ISO date string (UTC)
 * @returns {string} Datetime-local format string (YYYY-MM-DDTHH:mm) in local timezone
 * @example "2025-11-04T20:10:00+00:00" → "2025-11-04T20:10" (in local timezone)
 */
export const toDatetimeLocal = (isoString) => {
  if (!isoString) return ""
  const date = new Date(isoString)
  if (isNaN(date.getTime())) return ""
  
  // Get local time components
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

/**
 * Converts a "datetime-local" input value (local time)
 * into an ISO string (UTC) for backend submission.
 * @param {string} localString - Datetime-local format string (YYYY-MM-DDTHH:mm)
 * @returns {string} ISO string in UTC
 * @example "2025-11-04T20:10" → "2025-11-04T13:10:00.000Z" (converts to UTC)
 */
export const fromDatetimeLocal = (localString) => {
  if (!localString) return ""
  const date = new Date(localString)
  if (isNaN(date.getTime())) return ""
  return date.toISOString()
}