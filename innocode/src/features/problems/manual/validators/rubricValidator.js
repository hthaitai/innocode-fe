export const validateRubric = (data) => {
  const errors = {}

  // Description
  const descriptionValue = String(data.description ?? "").trim()
  if (!descriptionValue) {
    errors.description = "Description is required."
  } else if (descriptionValue.length > 500) {
    errors.description = "Description cannot be longer than 500 characters."
  }

  // Max Score
  if (data.maxScore <= 0) {
    errors.maxScore = "Max score must be positive."
  }

  return errors
}

