import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "react-hot-toast"
import PageContainer from "@/shared/components/PageContainer"
import RoundForm from "../../components/organizer/RoundForm"
import RoundDateInfo from "../../components/organizer/RoundDateInfo"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { addRound, fetchRounds } from "../../../round/store/roundThunk"
import { fetchContests } from "@/features/contest/store/contestThunks"
import { validateRound } from "../../../round/validators/roundValidator"
import { fromDatetimeLocal } from "@/shared/utils/dateTime"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"

// Keep initial form state consistent with Contest create structure
const EMPTY_ROUND = {
  name: "",
  description: "",
  start: "",
  end: "",
  problemType: "",
  mcqTestConfig: null,
  problemConfig: null,
  saveAsDraft: true,
  status: "draft",
}

export default function OrganizerRoundCreate() {
  // --- Hooks ---
  const { contestId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { contests } = useAppSelector((s) => s.contests)
  const { rounds } = useAppSelector((state) => state.rounds)

  // --- State ---
  const [formData, setFormData] = useState(EMPTY_ROUND)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // --- Data ---
  const contest = contests?.find(
    (c) => c && String(c.contestId) === String(contestId)
  )

  const existingRounds = (rounds || []).filter(
    (r) => r && String(r.contestId) === String(contestId)
  )

  // --- Effects ---
  useEffect(() => {
    if (!contest && contestId) {
      dispatch(fetchContests({ pageNumber: 1, pageSize: 50 }))
    }
  }, [contest, contestId, dispatch])

  useEffect(() => {
    if (contestId) {
      dispatch(fetchRounds({ pageNumber: 1, pageSize: 50 }))
    }
  }, [contestId, dispatch])

  // --- Breadcrumb setup ---
  const breadcrumbItems = BREADCRUMBS.ORGANIZER_ROUND_CREATE(
    contestId,
    contest?.name ?? "Contest"
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_ROUND_CREATE(contestId)

  // --- Handle Submit ---
  const handleSubmit = async () => {
    const validationErrors = validateRound(formData, contest, existingRounds)
    setErrors(validationErrors)

    const errorCount = Object.keys(validationErrors).length
    if (errorCount > 0) {
      toast.error(`Please fix ${errorCount} field${errorCount > 1 ? "s" : ""}`)
      return
    }

    setIsSubmitting(true)
    try {
      // Clean payload: only include one config based on problemType
      const payload = {
        name: formData.name,
        description: formData.description || "",
        start: fromDatetimeLocal(formData.start),
        end: fromDatetimeLocal(formData.end),
        problemType: formData.problemType,
        saveAsDraft: formData.saveAsDraft ?? true,
        status: formData.status || "draft",
      }

      // Add only the relevant config based on problemType
      if (formData.problemType === "McqTest" && formData.mcqTestConfig) {
        payload.mcqTestConfig = {
          name: formData.mcqTestConfig.name || "",
          config: formData.mcqTestConfig.config || "temporary-config",
        }
      } else if (formData.problemType === "Problem" && formData.problemConfig) {
        // When "Problem" is selected, use the type chosen in ProblemConfigFields
        const selectedType = formData.problemConfig.type // Manual or AutoEvaluation
        if (selectedType) {
          // Update problemType to the actual type (Manual or AutoEvaluation)
          payload.problemType = selectedType
          payload.problemConfig = {
            description: formData.problemConfig.description || "",
            language: formData.problemConfig.language || "",
            penaltyRate: formData.problemConfig.penaltyRate ?? 0.1,
            type: selectedType,
          }
        }
      }

      await dispatch(addRound({ contestId, data: payload })).unwrap()
      toast.success("Round created successfully!")

      await dispatch(fetchRounds({ pageNumber: 1, pageSize: 50 }))
      navigate(`/organizer/contests/${contestId}/rounds`)
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

  // --- Render ---
  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <RoundDateInfo contest={contest} />

      <div className="border border-[#E5E5E5] rounded-[5px] bg-white p-5 space-y-5">
        <RoundForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
        />

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            className="button-white"
            onClick={() => navigate(`/organizer/contests/${contestId}/rounds`)}
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
            {isSubmitting ? "Creating..." : "Create Round"}
          </button>
        </div>
      </div>
    </PageContainer>
  )
}
