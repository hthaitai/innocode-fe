import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
  fetchContests,
  updateContest,
} from "@/features/contest/store/contestThunks"
import ContestForm from "../../components/organizer/ContestForm"
import { validateContest } from "@/features/contest/validators/contestValidator"
import { fromDatetimeLocal, toDatetimeLocal } from "@/shared/utils/dateTime"
import { toast } from "react-hot-toast"
import { createBreadcrumbWithPaths } from "../../../../config/breadcrumbs"

export default function OrganizerContestEdit() {
  const { contestId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const contest = useAppSelector((s) =>
    s.contests.contests.find((c) => String(c.contestId) === String(contestId))
  )

  const [formData, setFormData] = useState(null)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // --- Load contest data ---
  useEffect(() => {
    const loadContest = async () => {
      if (!contest) {
        const res = await dispatch(fetchContests()).unwrap()
        const found = res.find((c) => String(c.contestId) === String(contestId))
        if (found) initForm(found)
      } else {
        initForm(contest)
      }
    }

    const initForm = (data) => {
      setFormData({
        year: data.year || "",
        name: data.name || "",
        description: data.description || "",
        imgUrl: data.imgUrl || "",
        start: toDatetimeLocal(data.start),
        end: toDatetimeLocal(data.end),
        registrationStart: toDatetimeLocal(data.registrationStart),
        registrationEnd: toDatetimeLocal(data.registrationEnd),
        teamMembersMax: data.teamMembersMax || "",
        teamLimitMax: data.teamLimitMax || "",
        rewardsText: data.rewardsText || "",
        saveAsDraft: data.status === "draft",
        status: data.status || "draft",
      })
    }

    loadContest()
  }, [contestId, contest, dispatch])

  // --- Breadcrumb setup ---
  const { items, paths } = createBreadcrumbWithPaths(
    "ORGANIZER_CONTEST_EDIT",
    contestId,
    contest?.name ?? "Contest Detail"
  )

  if (!formData) {
    return (
      <PageContainer breadcrumb={items} breadcrumbPaths={paths}>
        <div className="text-center py-10 text-gray-500">
          Loading contest data...
        </div>
      </PageContainer>
    )
  }

  // --- Handle Submit ---
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
        contestId,
        year: Number(formData.year),
        registrationStart: fromDatetimeLocal(formData.registrationStart),
        registrationEnd: fromDatetimeLocal(formData.registrationEnd),
        start: fromDatetimeLocal(formData.start),
        end: fromDatetimeLocal(formData.end),
      }

      await dispatch(updateContest({ id: contestId, data: payload })).unwrap()
      toast.success("Contest updated successfully!")

      await dispatch(fetchContests())
      navigate(`/organizer/contests/${contestId}`)
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
    <PageContainer breadcrumb={items} breadcrumbPaths={paths}>
      <div className="border border-[#E5E5E5] rounded-[5px] bg-white p-5 space-y-5">
        <div>
          <h2 className="text-lg font-medium">Edit Contest</h2>
          <p className="text-sm text-gray-500">
            Update the fields below to modify contest details.
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
            onClick={() => navigate(`/organizer/contests/${contestId}`)}
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
            {isSubmitting ? "Updating..." : "Save Changes"}
          </button>
        </div>
      </div>
    </PageContainer>
  )
}
