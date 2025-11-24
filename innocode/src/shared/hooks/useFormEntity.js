import { useState, useMemo } from "react"
import { toast } from "react-hot-toast"

/**
 * Generic hook for Add/Edit forms
 *
 * @param {Object} options
 * @param {Object} options.initialData - initial form state (empty for create, fetched entity for edit)
 * @param {Function} options.validate - validation function (receives formData and { isEdit })
 * @param {Function} options.submitApi - async function to submit data (receives FormData)
 * @param {boolean} options.isEdit - whether this is an edit form
 * @param {Function} [options.transformBeforeSubmit] - optional function to transform formData before creating FormData
 */
export function useFormEntity({
  initialData,
  validate,
  submitApi,
  isEdit = false,
  transformBeforeSubmit,
}) {
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check if there are changes from the initial data (for edit forms)
  const hasChanges = useMemo(() => {
    if (!formData || !initialData) return false
    return Object.keys(formData).some(
      (key) => formData[key] !== initialData[key]
    )
  }, [formData, initialData])

  // Build FormData dynamically, optionally transform first
  const buildFormData = (data) => {
    const payload = new FormData()
    const finalData = transformBeforeSubmit ? transformBeforeSubmit(data) : data

    Object.entries(finalData).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === "imgFile" && value) payload.append("ImageFile", value)
        else payload.append(key, value)
      }
    })

    return payload
  }

  // Handle submission with validation
  const handleSubmit = async () => {
    const validationErrors = validate(formData, { isEdit })
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      toast.error(`Please fix ${Object.keys(validationErrors).length} field(s)`)
      return
    }

    try {
      setIsSubmitting(true)
      await submitApi(buildFormData(formData))
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    handleSubmit,
    isSubmitting,
    hasChanges,
  }
}
