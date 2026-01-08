export const validateTestCase = (
  data,
  { isEdit = false, t = (key) => key } = {}
) => {
  const errors = {}

  // Trim values early
  const description = data.description?.trim()
  const input = data.input?.trim()
  const expectedOutput = data.expectedOutput?.trim()

  // Description
  if (!description) {
    errors.description = t("round:validation.testCase.description")
  } else if (description.length > 255) {
    errors.description = t("round:validation.testCase.limit")
  }

  // Input
  if (!input) {
    errors.input = t("round:validation.testCase.input")
  } else if (input.length > 255) {
    errors.input = t("round:validation.testCase.limit")
  }

  // Expected Output
  if (!expectedOutput) {
    errors.expectedOutput = t("round:validation.testCase.expectedOutput")
  } else if (expectedOutput.length > 255) {
    errors.expectedOutput = t("round:validation.testCase.limit")
  }

  // Weight
  if (data.weight == null || data.weight <= 0) {
    errors.weight = t("round:validation.weightPositive")
  }

  // Optional limits
  if (data.timeLimitMs != null && data.timeLimitMs <= 0) {
    errors.timeLimitMs = t("round:validation.testCase.timeLimit")
  }

  if (data.memoryKb != null && data.memoryKb <= 0) {
    errors.memoryKb = t("round:validation.testCase.memoryLimit")
  }

  return errors
}
