export const validateContest = (data) => {
  const errors = {}
  if (!data.year?.trim()) errors.year = "Year is required"
  if (!data.name?.trim()) errors.name = "Contest name is required"
  if (!data.description?.trim()) errors.description = "Description is required"
  return errors
}

export const validateRound = (data) => {
  const errors = {}
  if (!data.name?.trim()) errors.name = "Round name is required"
  if (!data.start) errors.start = "Start time is required"
  if (!data.end) errors.end = "End time is required"
  if (data.start && data.end && new Date(data.start) > new Date(data.end))
    errors.end = "End time must be after start time"
  return errors
}

export const validateProblem = (data) => {
  const errors = {}
  if (!data.language?.trim()) errors.language = "Language is required"
  if (!data.type?.trim()) errors.type = "Type is required"
  if (data.penalty_rate && isNaN(Number(data.penalty_rate)))
    errors.penalty_rate = "Penalty rate must be a number"
  return errors
}

export const validateTestCase = (data) => {
  const errors = {}
  if (!data.description?.trim()) errors.description = "Description is required"
  if (!data.type?.trim()) errors.type = "Type is required"
  if (data.weight == null || isNaN(Number(data.weight)) || data.weight <= 0)
    errors.weight = "Weight must be a positive number"
  if (data.time_limit_ms && data.time_limit_ms <= 0)
    errors.time_limit_ms = "Time limit must be positive"
  if (data.memory_kb && data.memory_kb <= 0)
    errors.memory_kb = "Memory must be positive"
  return errors
}
