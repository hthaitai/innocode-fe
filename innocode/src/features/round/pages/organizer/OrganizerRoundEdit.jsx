import React, { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchRounds, updateRound } from "@/features/round/store/roundThunk"
import { fetchContests } from "@/features/contest/store/contestThunks"
import RoundForm from "../../components/organizer/RoundForm"
import { validateRound } from "@/features/round/validators/roundValidator"
import { fromDatetimeLocal, toDatetimeLocal } from "@/shared/utils/dateTime"
import { toast } from "react-hot-toast"
import {
  BREADCRUMBS,
  BREADCRUMB_PATHS,
} from "@/config/breadcrumbs"

export default function OrganizerRoundEdit() {
  const { contestId, roundId } = useParams()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { rounds } = useAppSelector((s) => s.rounds)
  const { contests } = useAppSelector((s) => s.contests)

  const [formData, setFormData] = useState(null)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // --- Load round and contest data ---
  useEffect(() => {
    const loadData = async () => {
      // Helper to initialize the form similar to OrganizerContestEdit
      const initForm = (round, contest) => {
        // Map problemType for dropdown: Manual/AutoEvaluation -> Problem (actual type in problemConfig.type)
        let derivedProblemType = round?.problemType || ""
        if (derivedProblemType === "Manual" || derivedProblemType === "AutoEvaluation") {
          derivedProblemType = "Problem"
        }

        // Adapt to API fields: mcqTest and problem
        const derivedMcqTestConfig = round?.mcqTest
          ? {
              name: round.mcqTest.name || "",
              config: round.mcqTest.config || "",
            }
          : null

        let derivedProblemConfig = null
        if (round?.problem) {
          derivedProblemConfig = {
            description: round.problem.description || "",
            language: round.problem.language || "",
            penaltyRate: round.problem.penaltyRate ?? 0.1,
            // Preserve actual type from round.problemType when Manual/AutoEvaluation
            type:
              round.problemType === "Manual" || round.problemType === "AutoEvaluation"
                ? round.problemType
                : "",
          }
        }

        setFormData({
          name: round?.name || round?.roundName || "",
          description: round?.description || "",
          start: toDatetimeLocal(round?.start),
          end: toDatetimeLocal(round?.end),
          problemType: derivedProblemType,
          mcqTestConfig:
            derivedProblemType === "McqTest"
              ? {
                  name: derivedMcqTestConfig?.name || round?.mcqTest?.name || "",
                  config: derivedMcqTestConfig?.config || round?.mcqTest?.config || "",
                }
              : null,
          problemConfig: derivedProblemConfig,
          saveAsDraft: round?.status === "draft",
          status: round?.status || "draft",
          contestName: contest?.name || "",
        })
      }

      let currentRound = rounds.find((r) => String(r.roundId) === String(roundId))
      let currentContest = contests.find((c) => String(c.contestId) === String(contestId))

      // Fetch round if not in store
      if (!currentRound && roundId) {
        const res = await dispatch(
          fetchRounds({ roundId, pageNumber: 1, pageSize: 10 })
        ).unwrap()
        currentRound = Array.isArray(res)
          ? res.find((r) => String(r.roundId) === String(roundId))
          : res
      }

      // Fetch contests if not in store, and use returned list to resolve
      if (!currentContest && contestId) {
        const contestRes = await dispatch(
          fetchContests({ pageNumber: 1, pageSize: 50 })
        ).unwrap()
        currentContest = Array.isArray(contestRes)
          ? contestRes.find((c) => String(c.contestId) === String(contestId))
          : contestRes
      }

      if (currentRound) {
        initForm(currentRound, currentContest)
      }
    }

    loadData()
  }, [roundId, contestId, rounds, contests, dispatch])

  // --- Breadcrumb ---
  const items = BREADCRUMBS.ORGANIZER_ROUND_EDIT(
    contestId,
    formData?.contestName ?? "Contest",
    formData?.name ?? "Round"
  )
  const paths = BREADCRUMB_PATHS.ORGANIZER_ROUND_EDIT(contestId, roundId)

  if (!formData) {
    return (
      <PageContainer breadcrumb={items} breadcrumbPaths={paths}>
        <div className="text-center py-10 text-gray-500">Loading round data...</div>
      </PageContainer>
    )
  }

  // --- Get contest and existing rounds for validation ---
  const existingRounds = rounds.filter((r) => String(r.roundId) !== String(roundId))
  const contestObj = contests.find((c) => String(c.contestId) === String(contestId))

  // --- Handle Submit ---
  const handleSubmit = async () => {
    const validationErrors = validateRound(formData, contestObj, existingRounds)
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

      await dispatch(updateRound({ id: roundId, data: payload })).unwrap()
      toast.success("Round updated successfully!")

      await dispatch(fetchRounds({ roundId, pageNumber: 1, pageSize: 10 }))
      navigate(`/organizer/contests/${contestId}/rounds/${roundId}`)
    } catch (err) {
      console.error(err)
      if (err?.Code === "DUPLICATE") {
        toast.error(err.Message)
        if (err.AdditionalData?.suggestion) {
          setErrors((prev) => ({ ...prev, nameSuggestion: err.AdditionalData.suggestion }))
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
        <RoundForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
          showTypeSelector={false}
        />

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            className="button-white"
            onClick={() => navigate(`/organizer/contests/${contestId}/rounds/${roundId}`)}
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
