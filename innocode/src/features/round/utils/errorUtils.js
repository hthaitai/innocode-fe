import { formatDateTime } from "@/shared/utils/dateTime"
import i18n from "@/i18n/config"

export const BUFFER_ERROR_REGEX =
  /Round start must be after previous round buffer\. Earliest allowed: (.*?)\.$/

export const CONFLICT_ERROR_REGEX =
  /Round dates conflict with existing round '(.*?)' \((.*?) - (.*?)\)\.$/

/**
 * Formats backend error messages to be more human-readable.
 * specifically handles the round buffer overlap error.
 *
 * @param {string} errorMessage - The raw error message from backend
 * @returns {string} The formatted error message
 */
export const formatRoundError = (errorMessage) => {
  if (!errorMessage) return i18n.t("round:errors.unknownError")

  // Check for the specific round buffer error
  // "Round start must be after previous round buffer. Earliest allowed: 2026-01-06T09:39:00Z."
  let match = errorMessage.match(BUFFER_ERROR_REGEX)

  if (match) {
    const rawDate = match[1]
    const formattedDate = formatDateTime(rawDate)
    return i18n.t("round:errors.bufferError", { date: formattedDate })
  }

  // Check for retake round placement error
  if (
    errorMessage ===
    "Retake round must be the immediate next round after its main round (no rounds in between)."
  ) {
    return i18n.t("round:errors.retakeRoundPlacement")
  }

  // Check for round date conflict error
  // "Round dates conflict with existing round '1' (2026-01-11T12:48:00Z - 2026-01-12T09:48:00Z)."
  match = errorMessage.match(CONFLICT_ERROR_REGEX)

  if (match) {
    const roundName = match[1]
    const rawStartDate = match[2]
    const rawEndDate = match[3]

    return i18n.t("round:errors.conflictError", {
      roundName,
      startDate: formatDateTime(rawStartDate),
      endDate: formatDateTime(rawEndDate),
    })
  }

  return errorMessage
}
