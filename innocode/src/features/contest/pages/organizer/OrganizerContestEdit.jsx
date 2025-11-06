import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-hot-toast"
import PageContainer from "@/shared/components/PageContainer"
import ContestForm from "../../components/organizer/ContestForm"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
  fetchContests,
  updateContest,
} from "@/features/contest/store/contestThunks"
import { validateContest } from "@/features/contest/validators/contestValidator"
import { fromDatetimeLocal, toDatetimeLocal } from "@/shared/utils/dateTime"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"

// --- Helper: Initialize form data from contest ---
const initContestForm = (data) => ({
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

export default function OrganizerContestEdit() {
  // --- Hooks ---
  const { contestId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const contest = useAppSelector((s) =>
    s.contests.contests.find((c) => String(c.contestId) === String(contestId))
  )

  // --- State ---
  const [formData, setFormData] = useState(null)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // --- Fetch & Initialize Data ---
  useEffect(() => {
    const loadContest = async () => {
      try {
        let targetContest = contest
        if (!targetContest) {
          const res = await dispatch(fetchContests()).unwrap()
          targetContest = res.find(
            (c) => String(c.contestId) === String(contestId)
          )
        }

        if (targetContest) {
          setFormData(initContestForm(targetContest))
        } else {
          toast.error("Contest not found.")
          navigate("/organizer/contests")
        }
      } catch (err) {
        console.error(err)
        toast.error("Failed to load contest data.")
      }
    }

    loadContest()
  }, [contest, contestId, dispatch, navigate])

  // --- Breadcrumb setup ---
  const breadcrumbItems = BREADCRUMBS.ORGANIZER_CONTEST_EDIT(
    contestId,
    contest?.name ?? "Contest Detail"
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_CONTEST_EDIT(contestId)

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

  // --- Loading state ---
  if (!formData) {
    return <PageContainer breadcrumb={breadcrumbItems} breadcrumbPaths={breadcrumbPaths} loading />
  }

  // --- Render ---
  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <div className="border border-[#E5E5E5] rounded-[5px] bg-white p-5 space-y-5">
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
