import React, { useEffect, useState, useMemo } from "react"
import BaseModal from "@/shared/components/BaseModal"
import RoundForm from "./RoundForm"
import RoundDateInfo from "./RoundDateInfo"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { addRound, updateRound } from "@/features/round/store/roundThunk"
import { validateRound } from "@/features/round/validators/roundValidator"
import { fromDatetimeLocal, toDatetimeLocal } from "@/shared/utils/dateTime"
import { toast } from "react-hot-toast"
import { mapRoundList } from "../../mappers/roundMapper"

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

export default function RoundModal({
  isOpen,
  onClose,
  onCreated,
  onUpdated,
  initialData = null,
  contestId,
}) {
  const dispatch = useAppDispatch()
  const { contests } = useAppSelector((s) => s.contests)
  
  const [formData, setFormData] = useState(EMPTY_ROUND)
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Get contest and existing rounds for validation
  const contest = useMemo(
    () => contests?.find((c) => c && String(c.contestId) === String(contestId)),
    [contests, contestId]
  )

  // Get existing rounds from contest object
  const existingRounds = useMemo(() => {
    if (!contest?.rounds) return []
    const mappedRounds = mapRoundList(contest.rounds)
    // Filter out the current round if editing
    return mappedRounds.filter(
      (r) => !initialData || String(r.roundId) !== String(initialData.roundId)
    )
  }, [contest?.rounds, initialData])

  // Reset form when opening or when initialData changes
  useEffect(() => {
    if (isOpen) {
      if (initialData && initialData.roundId) {
        // Map problemType for dropdown: Manual/AutoEvaluation -> Problem (actual type in problemConfig.type)
        let derivedProblemType = initialData?.problemType || ""
        if (derivedProblemType === "Manual" || derivedProblemType === "AutoEvaluation") {
          derivedProblemType = "Problem"
        }

        // Adapt to API fields: mcqTest and problem
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
            // Preserve actual type from initialData.problemType when Manual/AutoEvaluation
            type:
              initialData.problemType === "Manual" || initialData.problemType === "AutoEvaluation"
                ? initialData.problemType
                : "",
          }
        }

        setFormData({
          name: initialData?.name || initialData?.roundName || "",
          description: initialData?.description || "",
          start: toDatetimeLocal(initialData?.start),
          end: toDatetimeLocal(initialData?.end),
          problemType: derivedProblemType,
          mcqTestConfig:
            derivedProblemType === "McqTest"
              ? {
                  name: derivedMcqTestConfig?.name || initialData?.mcqTest?.name || "",
                  config: derivedMcqTestConfig?.config || initialData?.mcqTest?.config || "",
                }
              : null,
          problemConfig: derivedProblemConfig,
          saveAsDraft: initialData?.status?.toLowerCase() === "draft",
          status: initialData?.status?.toLowerCase() || "draft",
        })
      } else {
        setFormData(EMPTY_ROUND)
      }
      setErrors({})
    }
  }, [isOpen, initialData])

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

      if (initialData?.roundId) {
        // Edit existing round
        await dispatch(updateRound({ id: initialData.roundId, data: payload })).unwrap()
        toast.success("Round updated successfully!")
        if (onUpdated) onUpdated()
      } else {
        // Create new round
        await dispatch(addRound({ contestId, data: payload })).unwrap()
        toast.success("Round created successfully!")
        if (onCreated) onCreated()
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
          ? "Update Round"
          : "Create Round"}
      </button>
    </div>
  )

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? "Edit Round" : "Create New Round"}
      size="lg"
      footer={footer}
    >
      <div className="space-y-5">
        {contest && <RoundDateInfo contest={contest} />}
        <RoundForm
          formData={formData}
          setFormData={setFormData}
          errors={errors}
          setErrors={setErrors}
          showTypeSelector={!initialData}
        />
      </div>
    </BaseModal>
  )
}

