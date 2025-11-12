/**
 * Date and time utility functions
 * Centralized location for all date/time formatting and conversion operations
 */

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
    const hasTimezone = dateString.includes("Z") || 
                       /[+-]\d{2}:?\d{2}$/.test(dateString)
    
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
  const ampm = hours >= 12 ? "PM" : "AM"
  hours = hours % 12
  hours = hours ? hours : 12 // the hour '0' should be '12'
  const formattedHours = String(hours).padStart(2, "0")

  return `${day}/${month}/${year} ${formattedHours}:${minutes} ${ampm}`
}

/**
 * Converts a backend ISO datetime string (UTC)
 * into a "datetime-local" string for inputs, adjusted for local timezone.
 * Example: "2025-11-04T16:11:00Z" → "2025-11-04T23:11" in Vietnam (UTC+7)
 */
export const toDatetimeLocal = (isoString) => {
  if (!isoString) return ""
  
  // Ensure the date string is treated as UTC if it doesn't have timezone info
  let date
  if (typeof isoString === "string") {
    // Check if the string has timezone info (Z, +HH:mm, -HH:mm, or +HHmm, -HHmm)
    const hasTimezone = isoString.includes("Z") || 
                       /[+-]\d{2}:?\d{2}$/.test(isoString)
    
    if (!hasTimezone && isoString.includes("T")) {
      // If no timezone indicator but has time component, assume it's UTC and append 'Z'
      date = new Date(isoString + "Z")
    } else {
      date = new Date(isoString)
    }
  } else {
    date = new Date(isoString)
  }
  
  if (isNaN(date.getTime())) return ""

  // Convert UTC date to local time for datetime-local input
  // datetime-local inputs expect YYYY-MM-DDTHH:mm format in local time
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")
  
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

/**
 * Converts a "datetime-local" value (local time)
 * into an ISO UTC string for backend submission.
 * Example: "2025-11-05T22:50" (local UTC+7) → "2025-11-05T15:50:00.000Z" (UTC)
 */
export const fromDatetimeLocal = (localString) => {
  if (!localString) return ""
  // new Date(localString) interprets the string as local time
  // getTime() already returns the UTC timestamp, so we can use toISOString() directly
  const date = new Date(localString)
  if (isNaN(date.getTime())) return ""

  return date.toISOString()
}
