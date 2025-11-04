import React, { useState } from "react"
import PageContainer from "@/shared/components/PageContainer"
import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "@/store/hooks"
import {
  addContest,
  fetchContests,
} from "@/features/contest/store/contestThunks"
import ContestForm from "../../components/organizer/ContestForm"
import { BREADCRUMBS } from "@/config/breadcrumbs"
import { validateContest } from "@/features/contest/validators/contestValidator"
import { fromDatetimeLocal } from "@/shared/utils/dateTime"
import { toast } from "react-hot-toast"

export default function OrganizerContestCreate() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  // Default empty state, same as in ContestModal
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

  const handleSubmit = async () => {
    const validationErrors = validateContest(formData)
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
        year: Number(formData.year),
        registrationStart: fromDatetimeLocal(formData.registrationStart),
        registrationEnd: fromDatetimeLocal(formData.registrationEnd),
        start: fromDatetimeLocal(formData.start),
        end: fromDatetimeLocal(formData.end),
      }

      await dispatch(addContest(payload)).unwrap()
      toast.success("Contest created successfully!")

      await dispatch(fetchContests())
      navigate("/organizer/contests")
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

  return (
    <PageContainer breadcrumb={BREADCRUMBS.ORGANIZER_CONTEST_CREATE}>
      <div className="border border-[#E5E5E5] rounded-[5px] bg-white p-5 space-y-5">
        <div>
          <h2 className="text-lg font-medium">Create New Contest</h2>
          <p className="text-sm text-gray-500">
            Fill out the form below to add a new contest.
          </p>
        </div>

        <ContestForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
        />

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            className="button-white"
            onClick={() => navigate("/organizer/contests")}
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
            {isSubmitting ? "Creating..." : "Create Contest"}
          </button>
        </div>
      </div>
    </PageContainer>
  )
}
