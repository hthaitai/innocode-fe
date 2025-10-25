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

  // ----- contact -----
  if (data.contact && data.contact.length > 255) {
    errors.contact = "Contact cannot exceed 255 characters"
  } else if (
    data.contact &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.contact)
  ) {
    errors.contact = "Invalid email format"
  }

  return errors
}
