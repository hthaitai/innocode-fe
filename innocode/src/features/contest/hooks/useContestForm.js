import { useState, useEffect, useCallback } from "react"
import { useAppDispatch } from "@/store/hooks"
import {
  addContest,
  updateContest,
} from "@/features/contest/store/contestThunks"
import { validateContest } from "@/features/contest/validators/contestValidator"
import { fromDatetimeLocal, toDatetimeLocal } from "@/shared/utils/dateTime"
import { toast } from "react-hot-toast"

const EMPTY_CONTEST = {
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

export function useContestForm({ initialData, onCreated, onUpdated, onClose }) {
  const dispatch = useAppDispatch()
  const [formData, setFormData] = useState(initialData || EMPTY_CONTEST)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Populate or reset form
  useEffect(() => {
    if (initialData) {
      setFormData({
        ...initialData,
        start: toDatetimeLocal(initialData.start),
        end: toDatetimeLocal(initialData.end),
        registrationStart: toDatetimeLocal(initialData.registrationStart),
        registrationEnd: toDatetimeLocal(initialData.registrationEnd),
      })
    } else {
      setFormData(EMPTY_CONTEST)
      setErrors({})
    }
  }, [initialData])

  const handleSubmit = useCallback(async () => {
    const validationErrors = validateContest(formData, {
      isEdit: !!initialData,
    })
    setErrors(validationErrors)
    const errorCount = Object.keys(validationErrors).length
    if (errorCount > 0) {
      toast.error(`Please fix ${errorCount} field${errorCount > 1 ? "s" : ""}`)
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        ...formData,
        start: fromDatetimeLocal(formData.start),
        end: fromDatetimeLocal(formData.end),
        registrationStart: fromDatetimeLocal(formData.registrationStart),
        registrationEnd: fromDatetimeLocal(formData.registrationEnd),
      }

      if (initialData?.contestId) {
        await dispatch(
          updateContest({ id: initialData.contestId, data: payload })
        ).unwrap()
        toast.success("Contest updated successfully!")
        onUpdated?.()
      } else {
        await dispatch(addContest(payload)).unwrap()
        toast.success("Contest created successfully!")
        onCreated?.()
      }
      onClose?.()
    } catch (err) {
      console.error(err)
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
        toast.error("An unexpected error occurred.")
      }
    } finally {
      setIsSubmitting(false)
    }
  }, [dispatch, formData, initialData, onCreated, onUpdated, onClose])

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    isSubmitting,
    handleSubmit,
  }
}
