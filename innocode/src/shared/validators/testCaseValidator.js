export const validateTestCase = (data, { t = (key) => key } = {}) => {
  const errors = {}
  if (!data.description?.trim())
    errors.description = t("round:validation.testCase.description")
  // if (!data.type?.trim()) errors.type = "Type is required"
  if (data.weight == null || isNaN(Number(data.weight)) || data.weight <= 0)
    errors.weight = t("round:validation.weightPositive")
  if (data.time_limit_ms && data.time_limit_ms <= 0)
    errors.time_limit_ms = t("round:validation.testCase.timeLimit")
  if (data.memory_kb && data.memory_kb <= 0)
    errors.memory_kb = t("round:validation.testCase.memoryLimit")
  return errors
}
