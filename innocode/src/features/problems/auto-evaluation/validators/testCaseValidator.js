export const validateTestCase = (data, { isEdit = false } = {}) => {
  const errors = {}

  // Trim values early
  const description = data.description?.trim()
  const input = data.input?.trim()
  const expectedOutput = data.expectedOutput?.trim()

  // Description
  if (!description) {
    errors.description = "Description is required"
  } else if (description.length > 255) {
    errors.description = "Description must be 255 characters or less"
  }

  // Input
  if (!input) {
    errors.input = "Input is required"
  } else if (input.length > 255) {
    errors.input = "Input must be 255 characters or less"
  }

  // Expected Output
  if (!expectedOutput) {
    errors.expectedOutput = "Expected output is required"
  } else if (expectedOutput.length > 255) {
    errors.expectedOutput = "Expected output must be 255 characters or less"
  }

  // Weight
  if (data.weight == null || data.weight <= 0) {
    errors.weight = "Weight must be greater than 0"
  }

  // Optional limits
  if (data.timeLimitMs != null && data.timeLimitMs <= 0) {
    errors.timeLimitMs = "Time limit must be a positive integer if provided"
  }

  if (data.memoryKb != null && data.memoryKb <= 0) {
    errors.memoryKb = "Memory limit must be a positive integer if provided"
  }

  return errors
}
