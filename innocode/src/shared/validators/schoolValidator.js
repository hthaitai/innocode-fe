export const validateSchool = (data) => {
  const errors = {}

  // ----- name -----
  if (!data.name || !data.name.trim()) {
    errors.name = "School name is required"
  } else if (data.name.length > 200) {
    errors.name = "School name cannot exceed 200 characters"
  }

  // ----- province_id -----
  if (!data.province_id) {
    errors.province_id = "Province is required"
  }

  // ----- contact ----- (no validation)
  // ----- address ----- (no validation)

  return errors
}
