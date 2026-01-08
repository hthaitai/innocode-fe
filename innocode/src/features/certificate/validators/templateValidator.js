export const validateTemplate = (data, { t = (key) => key } = {}) => {
  const errors = {}

  // ---- Name ----
  const nameValue = String(data.name ?? "").trim()
  if (!nameValue) {
    errors.name = t("certificate:validation.templateName")
  }

  return errors
}
