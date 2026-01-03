import { formatDateTime } from "@/shared/utils/dateTime"

/**
 * Formats backend error messages to be more human-readable.
 * specifically handles the round buffer overlap error.
 *
 * @param {string} errorMessage - The raw error message from backend
 * @returns {string} The formatted error message
 */
export const formatRoundError = (errorMessage) => {
  if (!errorMessage) return "An unknown error occurred"

  // Check for the specific round buffer error
  // "Round start must be after previous round buffer. Earliest allowed: 2026-01-06T09:39:00Z."
  const bufferErrorRegex =
    /Round start must be after previous round buffer\. Earliest allowed: (.*?)\.$/

  const match = errorMessage.match(bufferErrorRegex)

  if (match) {
    const rawDate = match[1]
    const formattedDate = formatDateTime(rawDate)
    return `Round start must be after previous round buffer. Earliest allowed: ${formattedDate}.`
  }

  return errorMessage
}
