export const validateRubric = (data, { t = (key) => key } = {}) => {
  const errors = {}

  // Description
  const descriptionValue = String(data.description ?? "").trim()
  if (!descriptionValue) {
    errors.description = t("round:validation.description")
  } else if (descriptionValue.length > 500) {
    errors.description = t("round:validation.descriptionMax", { max: 500 })
  }

  // Max Score
  if (data.maxScore <= 0) {
    errors.maxScore = t("round:validation.rubric.maxScorePositive")
  }

  return errors
}
