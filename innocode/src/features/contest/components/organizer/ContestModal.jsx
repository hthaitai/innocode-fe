import React, { useEffect, useState } from "react"
import BaseModal from "@/shared/components/BaseModal"
import ContestForm from "./ContestForm"
import { useAppDispatch } from "@/store/hooks"
import {
  addContest,
  updateContest,
  fetchContests,
} from "@/features/contest/store/contestThunks"
import { validateContest } from "@/features/contest/validators/contestValidator"
import { fromDatetimeLocal } from "@/shared/utils/dateTime"
import { toast } from "react-hot-toast"
import { toDatetimeLocal } from "../../../../shared/utils/dateTime"

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

export default function ContestModal({
  isOpen,
  onClose,
  onCreated,
  onUpdated,
  initialData = null,
}) {
  const dispatch = useAppDispatch()
  const [formData, setFormData] = useState(initialData || EMPTY_CONTEST)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Reset form when opening or when initialData changes
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData({
        ...initialData,
        start: toDatetimeLocal(initialData.start),
        end: toDatetimeLocal(initialData.end),
        registrationStart: toDatetimeLocal(initialData.registrationStart),
        registrationEnd: toDatetimeLocal(initialData.registrationEnd),
      })
    }
  }, [isOpen, initialData])

  const handleSubmit = async () => {
    const validationErrors = validateContest(formData, {
      isEdit: !!initialData,
    })
    setErrors(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      toast.error(
        `Please fix ${Object.keys(validationErrors).length} field${
          Object.keys(validationErrors).length > 1 ? "s" : ""
        }`
      )
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
        // Edit existing contest
        await dispatch(
          updateContest({ id: initialData.contestId, data: payload })
        ).unwrap()
        toast.success("Contest updated successfully!")
        if (onUpdated) onUpdated()
      } else {
        // Create new contest
        await dispatch(addContest(payload)).unwrap()
        toast.success("Contest created successfully!")
        if (onCreated) onCreated()
      }

      await dispatch(fetchContests())
      onClose()
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
  }

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
        {isSubmitting
          ? initialData
            ? "Updating..."
            : "Creating..."
          : initialData
          ? "Update Contest"
          : "Create Contest"}
      </button>
    </div>
  )

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Contest" : "Create New Contest"}
      size="lg"
      footer={footer}
    >
      <div className="space-y-5">
        <ContestForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
        />
      </div>
    </BaseModal>
  )
}
