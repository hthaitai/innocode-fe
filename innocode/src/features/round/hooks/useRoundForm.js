import { useState, useEffect, useMemo, useCallback } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { addRound, updateRound } from "@/features/round/store/roundThunk"
import { validateRound } from "@/features/round/validators/roundValidator"
import { fromDatetimeLocal, toDatetimeLocal } from "@/shared/utils/dateTime"
import { toast } from "react-hot-toast"
import { mapRoundList } from "../mappers/roundMapper"

const EMPTY_ROUND = {
  name: "",
  start: "",
  end: "",
  problemType: "",
  mcqTestConfig: null,
  problemConfig: null,
  timeLimitSeconds: 0,
}

export function useRoundForm({
  contestId,
  initialData,
  onCreated,
  onUpdated,
  onClose,
}) {
  const dispatch = useAppDispatch()
  const { contests } = useAppSelector((s) => s.contests)

  const [formData, setFormData] = useState(EMPTY_ROUND)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const contest = useMemo(
    () => contests?.find((c) => String(c.contestId) === String(contestId)),
    [contests, contestId]
  )

  const existingRounds = useMemo(() => {
    if (!contest?.rounds) return []
    const mapped = mapRoundList(contest.rounds)
    return mapped.filter(
      (r) => !initialData || String(r.roundId) !== String(initialData.roundId)
    )
  }, [contest?.rounds, initialData])

  // Populate form on open
  useEffect(() => {
    if (!initialData) {
      setFormData(EMPTY_ROUND)
      setErrors({})
      return
    }

    let derivedProblemType = initialData?.problemType || ""
    if (["Manual", "AutoEvaluation"].includes(derivedProblemType)) {
      derivedProblemType = "Problem"
    }

    const derivedMcqTestConfig = initialData?.mcqTest
      ? {
          name: initialData.mcqTest.name || "",
          config: initialData.mcqTest.config || "",
        }
      : null

    let derivedProblemConfig = null
    if (initialData?.problem) {
      derivedProblemConfig = {
        description: initialData.problem.description || "",
        language: initialData.problem.language || "",
        penaltyRate: initialData.problem.penaltyRate ?? 0.1,
        type:
          initialData.problemType === "Manual" ||
          initialData.problemType === "AutoEvaluation"
            ? initialData.problemType
            : "",
      }
    }

    setFormData({
      name: initialData?.name || initialData?.roundName || "",
      start: toDatetimeLocal(initialData?.start),
      end: toDatetimeLocal(initialData?.end),
      problemType: derivedProblemType,
      mcqTestConfig:
        derivedProblemType === "McqTest" ? derivedMcqTestConfig : null,
      problemConfig: derivedProblemConfig,
      timeLimitSeconds: initialData?.timeLimitSeconds ?? 0,
    })
    setErrors({})
  }, [initialData])

  const handleSubmit = useCallback(async () => {
    const validationErrors = validateRound(formData, contest, existingRounds)
    setErrors(validationErrors)
    const errorCount = Object.keys(validationErrors).length
    if (errorCount > 0) {
      toast.error(`Please fix ${errorCount} field${errorCount > 1 ? "s" : ""}`)
      return
    }

    setIsSubmitting(true)
    try {
      const payload = {
        name: formData.name,
        start: fromDatetimeLocal(formData.start),
        end: fromDatetimeLocal(formData.end),
        problemType: formData.problemType,
        timeLimitSeconds: Number(formData.timeLimitSeconds) || 0,
      }

      if (formData.problemType === "McqTest" && formData.mcqTestConfig) {
        payload.mcqTestConfig = {
          name: formData.mcqTestConfig.name || "",
          config: formData.mcqTestConfig.config || "temporary-config",
        }
      } else if (formData.problemType === "Problem" && formData.problemConfig) {
        const selectedType = formData.problemConfig.type
        if (selectedType) {
          payload.problemType = selectedType
          payload.problemConfig = {
            description: formData.problemConfig.description || "",
            language: formData.problemConfig.language || "",
            penaltyRate: formData.problemConfig.penaltyRate ?? 0.1,
            type: selectedType,
          }
        }
      }

      if (initialData?.roundId) {
        await dispatch(
          updateRound({ id: initialData.roundId, data: payload })
        ).unwrap()
        toast.success("Round updated successfully!")
        onUpdated?.()
      } else {
        await dispatch(addRound({ contestId, data: payload })).unwrap()
        toast.success("Round created successfully!")
        onCreated?.()
      }

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
  }, [
    dispatch,
    formData,
    contest,
    existingRounds,
    initialData,
    contestId,
    onClose,
    onCreated,
    onUpdated,
  ])

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    handleSubmit,
    isSubmitting,
    contest,
  }
}
