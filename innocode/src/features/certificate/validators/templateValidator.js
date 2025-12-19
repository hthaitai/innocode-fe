export const validateTemplate = (data) => {
  const errors = {}

  // ---- Name ----
  const nameValue = String(data.name ?? "").trim()
  if (!nameValue) {
    errors.name = "Template name is required"
  }

  return errors
}
