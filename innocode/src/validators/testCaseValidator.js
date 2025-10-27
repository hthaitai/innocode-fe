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
