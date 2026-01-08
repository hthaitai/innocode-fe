// Validate weight
export const validateWeight = (value, t = (key) => key) => {
  if (!value || value.trim() === "") {
    return t("round:validation.weight")
  }
  const numValue = Number(value)
  if (isNaN(numValue)) {
    return t("round:validation.weightNumber")
  }
  if (numValue <= 0) {
    return t("round:validation.weightPositive")
  }
  return ""
}
