import i18n from "@/i18n/config"
import { formatDateTime } from "@/shared/utils/dateTime"

/**
 * Formats publish contest error messages to be more human-readable and localized.
 *
 * @param {string} errorMessage - The raw error message from backend
 * @returns {string} The formatted error message
 */
export const formatPublishError = (errorMessage) => {
  if (!errorMessage) return ""

  // Case 1: Contest end too early
  // "Contest end is too early to cover deadlines. Suggested end >= 2026-01-11 11:34:00 UTC."
  const endTooEarlyRegex =
    /Contest end is too early to cover deadlines\. Suggested end >= (.*?)(?:\.| UTC\.)$/

  // Case 0: No rounds found (exact match or with period)
  if (
    errorMessage === "No rounds found" ||
    errorMessage === "No rounds found."
  ) {
    return i18n.t("contest:publish.errors.noRounds")
  }

  const endTooEarlyMatch = errorMessage.match(endTooEarlyRegex)

  if (endTooEarlyMatch) {
    const rawDate = endTooEarlyMatch[1]
    const formattedDate = formatDateTime(rawDate)
    return i18n.t(
      "pages:organizerContestDetail.publish.errors.contestEndTooEarly",
      {
        date: formattedDate,
      }
    )
  }

  // Case 2: Auto-evaluation round missing config
  // "Auto-evaluation round '1' must have either a mock test file or test cases."
  const autoEvalRegex =
    /Auto-evaluation round '(.*?)' must have either a mock test file or test cases\./
  const autoEvalMatch = errorMessage.match(autoEvalRegex)

  if (autoEvalMatch) {
    const name = autoEvalMatch[1]
    return i18n.t("contest:publish.errors.autoEvalMissingConfig", {
      name,
    })
  }

  // Case 3: Retake round no weight
  // "Retake round 'mcq (Retake)' has no weight (missing questions/test cases/criteria)."
  const retakeNoWeightRegex =
    /Retake round '(.*?)' has no weight \(missing questions\/test cases\/criteria\)\./
  const retakeNoWeightMatch = errorMessage.match(retakeNoWeightRegex)

  if (retakeNoWeightMatch) {
    const name = retakeNoWeightMatch[1]
    return i18n.t("contest:publish.errors.retakeNoWeight", {
      name,
    })
  }

  // Case 4: MCQ test no questions
  // "MCQ test(s) 'mcq (Retake)' have no questions."
  const mcqNoQuestionsRegex = /MCQ test\(s\) '(.*?)' have no questions\./
  const mcqNoQuestionsMatch = errorMessage.match(mcqNoQuestionsRegex)

  if (mcqNoQuestionsMatch) {
    const name = mcqNoQuestionsMatch[1]
    return i18n.t("contest:publish.errors.mcqNoQuestions", {
      name,
    })
  }

  // Case 5: Manual evaluation missing rubric
  // "Manual evaluation round(s) 'manuyal (Retake)', 'manuyal' missing rubric."
  // Note: might match multiple names separated by comma
  const manualNoRubricRegex =
    /Manual evaluation round\(s\) '(.*?)' missing rubric\./
  const manualNoRubricMatch = errorMessage.match(manualNoRubricRegex)

  if (manualNoRubricMatch) {
    const name = manualNoRubricMatch[1]
    return i18n.t("contest:publish.errors.manualNoRubric", {
      name,
    })
  }

  // Case 6: No judges assigned
  // "No judges assigned to the contest for manual problems."
  const noJudgesRegex =
    /No judges assigned to the contest for manual problems\./
  const noJudgesMatch = errorMessage.match(noJudgesRegex)

  if (noJudgesMatch) {
    return i18n.t("contest:publish.errors.noJudges")
  }

  return errorMessage
}
