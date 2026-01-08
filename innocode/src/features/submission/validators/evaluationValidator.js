export const validateScores = (scores, rubric, t = (key) => key) => {
  const errors = {}

  scores.forEach((s) => {
    const rubricItem = rubric.find((r) => r.rubricId === s.rubricId)
    if (!rubricItem) {
      // Logic error, shouldn't happen in normal flow
      return
    }

    // Initialize error object for this item if needed
    if (!errors[s.rubricId]) {
      errors[s.rubricId] = {}
    }

    // Validate Score
    if (s.score > rubricItem.maxScore) {
      errors[s.rubricId].score = t("judge:evaluation.errors.scoreMax", {
        max: rubricItem.maxScore,
      })
    } else if (s.score < 0) {
      errors[s.rubricId].score = t("judge:evaluation.errors.scoreNegative")
    }

    // Validate Note
    // if (s.note && s.note.length > 255) {
    //   errors[s.rubricId].note = "Note cannot exceed 255 characters"
    // }

    // Clean up empty error objects
    if (Object.keys(errors[s.rubricId]).length === 0) {
      delete errors[s.rubricId]
    }
  })

  return errors
}
