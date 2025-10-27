export const validateProblem = (data) => {
  const errors = {}
  if (!data.language?.trim()) errors.language = "Language is required"
  if (!data.type?.trim()) errors.type = "Type is required"
  if (data.penalty_rate && isNaN(Number(data.penalty_rate)))
    errors.penalty_rate = "Penalty rate must be a number"
  return errors
}