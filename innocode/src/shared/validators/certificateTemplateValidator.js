export const validateCertificateTemplate = (data) => {
  const errors = {}

  // ----- name -----
  if (!data.name || !data.name.trim()) {
    errors.name = "Template name is required"
  } else if (data.name.length > 120) {
    errors.name = "Template name cannot exceed 120 characters"
  }

  // ----- file_url -----
  if (!data.file_url || !data.file_url.trim()) {
    errors.file_url = "Template file URL is required"
  } else if (
    !/^https?:\/\/[^\s$.?#].[^\s]*$/i.test(data.file_url)
  ) {
    errors.file_url = "Please enter a valid URL (http or https)"
  }

  return errors
}
