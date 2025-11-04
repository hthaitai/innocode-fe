import React, { useState, useEffect } from "react"
import BaseModal from "@/shared/components/BaseModal"
import ContestForm from "./ContestForm"
import { validateContest } from "../../validators/contestValidator"
import { toast } from "react-hot-toast"
import {
  fromDatetimeLocal,
  toDatetimeLocal,
} from "../../../../shared/utils/dateTime"

export default function ContestModal({
  isOpen,
  mode = "create",
  initialData = {},
  onSubmit,
  onClose,
}) {
  const emptyData = {
    year: "",
    name: "",
    description: "",
    imgUrl: "",
    start: "",
    end: "",
    registrationStart: "",
    registrationEnd: "",
    teamMembersMax: "",
    teamLimitMax: "",
    rewardsText: "",
    saveAsDraft: true,
    status: "draft",
  }

  const [formData, setFormData] = useState(emptyData)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      const normalized =
        mode === "edit"
          ? {
              ...initialData,
              registrationStart: toDatetimeLocal(initialData.registrationStart),
              registrationEnd: toDatetimeLocal(initialData.registrationEnd),
              start: toDatetimeLocal(initialData.start),
              end: toDatetimeLocal(initialData.end),
            }
          : emptyData

      setFormData(normalized)
      setErrors({})
      setIsSubmitting(false)
    }
  }, [isOpen, mode, initialData])

  const handleSubmit = async () => {
    const validationErrors = validateContest(formData)
    setErrors(validationErrors)

    const errorCount = Object.keys(validationErrors).length
    if (errorCount > 0) {
      // Show toast summary for errors
      toast.error(`Please fix ${errorCount} field${errorCount > 1 ? "s" : ""}`)
      return // stop submission
    }

    setIsSubmitting(true)
    try {
      await onSubmit({
        ...formData,
        year: Number(formData.year),
        registrationStart: fromDatetimeLocal(formData.registrationStart),
        registrationEnd: fromDatetimeLocal(formData.registrationEnd),
        start: fromDatetimeLocal(formData.start),
        end: fromDatetimeLocal(formData.end),
      })
      onClose()
    } catch (err) {
      // backend errors as toast
      if (err?.Code === "DUPLICATE") {
        toast.error(err.Message)
        if (err.AdditionalData?.suggestion) {
          setErrors((prev) => ({
            ...prev,
            nameSuggestion: err.AdditionalData.suggestion,
          }))
        }
      } else if (err?.Message) {
        toast.error(err.Message)
      } else {
        console.error(err)
        toast.error("An unexpected error occurred.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const title =
    mode === "edit"
      ? `Edit Contest: ${initialData.name || ""}`
      : "Create New Contest"

  const footer = (
    <div className="flex justify-end gap-2">
      <button
        type="button"
        className="button-white"
        onClick={onClose}
        disabled={isSubmitting}
      >
        Cancel
      </button>
      <button
        type="button"
        className={isSubmitting ? "button-gray" : "button-orange"}
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {mode === "edit" ? "Save Changes" : "Create"}
      </button>
    </div>
  )

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="lg"
      footer={footer}
    >
      <ContestForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        loading={isSubmitting}
      />
    </BaseModal>
  )
}
