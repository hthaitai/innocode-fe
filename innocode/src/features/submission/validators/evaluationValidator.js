export const validateScores = (scores, rubric) => {
  const errors = []

  scores.forEach((s) => {
    const rubricItem = rubric.find((r) => r.rubricId === s.rubricId)
    if (!rubricItem) {
      errors.push(`Rubric item not found for ID ${s.rubricId}`)
    } else if (s.score > rubricItem.maxScore) {
      errors.push(
        `Score for "${rubricItem.description}" exceeds max of ${rubricItem.maxScore}`
      )
    } else if (s.score < 0) {
      errors.push(`Score for "${rubricItem.description}" cannot be negative`)
    }

    if (s.note && s.note.length > 255) {
      errors.push(
        `Note for "${
          rubricItem?.description || s.rubricId
        }" cannot exceed 255 characters`
      )
    }
  })

  return errors
}
