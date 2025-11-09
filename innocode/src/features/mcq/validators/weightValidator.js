// Validate weight
export const validateWeight = (value) => {
  if (!value || value.trim() === "") {
    return "Weight is required"
  }
  const numValue = Number(value)
  if (isNaN(numValue)) {
    return "Weight must be a number"
  }
  if (numValue <= 0) {
    return "Weight must be greater than 0"
  }
  return ""
}
