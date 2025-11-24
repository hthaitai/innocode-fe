import { useState } from "react"

export const useRubricForm = ({ initialData, onUpdated, onClose }) => {
  const [formData, setFormData] = useState({
    description: initialData?.description || "",
    maxScore: initialData?.maxScore || 1,
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      if (!formData.description.trim()) {
        setErrors({ description: "Description is required." })
        setIsSubmitting(false)
        return
      }
      if (formData.maxScore <= 0) {
        setErrors({ maxScore: "Max score must be positive." })
        setIsSubmitting(false)
        return
      }

      // simulate update (could call a Redux dispatch here if needed)
      onUpdated?.(formData)
      onClose()
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
  }
}
