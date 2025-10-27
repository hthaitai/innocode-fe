export const validateRound = (data) => {
  const errors = {}
  if (!data.name?.trim()) errors.name = "Round name is required"
  if (!data.start) errors.start = "Start time is required"
  if (!data.end) errors.end = "End time is required"
  if (data.start && data.end && new Date(data.start) > new Date(data.end))
    errors.end = "End time must be after start time"
  return errors
}
