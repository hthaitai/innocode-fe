import translateApiError from '../../../shared/utils/translateApiError'
import i18n from '../../../i18n/config'

export const handleContestApiError = (err, setErrors, toast) => {
  // Backend field validation errors
  if (err?.data?.errors) {
    const fieldErrors = {}
    if (Array.isArray(err.data.errors)) {
      err.data.errors.forEach((e) => {
        if (e.field) {
          // Translate field error messages
          fieldErrors[e.field] = translateApiError(e.message || e, 'errors')
        }
      })
    } else if (typeof err.data.errors === "object") {
      Object.keys(err.data.errors).forEach((field) => {
        fieldErrors[field] = translateApiError(err.data.errors[field], 'errors')
      })
    }
    setErrors(fieldErrors)
    toast.error(i18n.t('errors:common.validationError'))
    return
  }

  // Translate error message
  const translatedError = translateApiError(err, 'errors')

  // Duplicate contest name
  if (err?.data?.errorCode === "DUPLICATE") {
    setErrors((prev) => ({
      ...prev,
      name: translatedError,
    }))
    toast.error(translatedError)
    return
  }

  // Fallback error
  toast.error(translatedError)
}
