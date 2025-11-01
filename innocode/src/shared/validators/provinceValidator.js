export const validateProvince = (data) => {
  const errors = {}

  // ----- name -----
  if (!data.name || !data.name.trim()) {
    errors.name = "Province name is required"
  } else if (data.name.length > 120) {
    errors.name = "Province name cannot exceed 120 characters"
  }

  // ----- address -----
  if (data.address && data.address.length > 255) {
    errors.address = "Address cannot exceed 255 characters"
  }

  return errors
}
