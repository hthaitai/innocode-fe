export const handleContestApiError = (err, setErrors, toast) => {
  // Backend field validation errors
  if (err?.data?.errors) {
    const fieldErrors = {}
    if (Array.isArray(err.data.errors)) {
      err.data.errors.forEach((e) => {
        if (e.field) fieldErrors[e.field] = e.message
      })
    } else if (typeof err.data.errors === "object") {
      Object.assign(fieldErrors, err.data.errors)
    }
    setErrors(fieldErrors)
    toast.error("Please fix the highlighted errors.")
    return
  }

  // Duplicate contest name
  if (err?.data?.errorCode === "DUPLICATE") {
    setErrors((prev) => ({
      ...prev,
      name: err.data.errorMessage,
    }))
    toast.error(err.data.errorMessage)
    return
  }

  // Fallback error
  toast.error(err?.data?.errorMessage || "Failed to create contest.")
}
