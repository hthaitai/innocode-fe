import React, { useState, useEffect, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import {
  useUpdateRoundMutation,
  useGetRoundByIdQuery,
} from "@/services/roundApi"
import { useGetContestByIdQuery } from "@/services/contestApi"
import { toast } from "react-hot-toast"
import PageContainer from "@/shared/components/PageContainer"
import RoundForm from "../../components/organizer/RoundForm"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { validateRound } from "../../validators/roundValidator"
import {
  fromDatetimeLocal,
  toDatetimeLocal,
} from "../../../../shared/utils/dateTime"

const EditRound = () => {
  const { contestId, roundId } = useParams()
  const navigate = useNavigate()

  // Fetch contest and round data
  const { data: contest, isLoading: contestLoading } =
    useGetContestByIdQuery(contestId)
  const { data: round, isLoading: roundLoading } = useGetRoundByIdQuery(roundId)

  const [formData, setFormData] = useState(null)
  const [originalData, setOriginalData] = useState(null)
  const [errors, setErrors] = useState({})

  const [updateRound, { isLoading: isUpdating }] = useUpdateRoundMutation()

  // Breadcrumbs
  const breadcrumbItems = BREADCRUMBS.ORGANIZER_ROUND_EDIT(
    round?.contestName ?? "Contest",
    round?.roundName ?? "Round"
  )

  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_ROUND_EDIT(
    round?.contestId ?? contestId,
    round?.roundId ?? roundId
  )

  // Initialize form data once round is loaded
  useEffect(() => {
    if (!round) return

    const formatted = {
      name: round.roundName,
      start: toDatetimeLocal(round.start),
      end: toDatetimeLocal(round.end),
      problemType: round.problemType,
      mcqTestConfig: round.problemType === "McqTest" ? round.mcqTest : null,
      problemConfig: ["Manual", "AutoEvaluation"].includes(round.problemType)
        ? {
            ...round.problem,
            type: round.problem?.type || round.problemType,
            templateUrl: round.problem?.templateUrl,
          }
        : null,
      TemplateFile: null,
      timeLimitSeconds: round.timeLimitSeconds,
    }

    setFormData(formatted)
    setOriginalData(formatted)
  }, [round])

  // Detect changes for submit button
  const hasChanges = useMemo(() => {
    if (!formData || !originalData) return false
    return Object.keys(formData).some(
      (key) => formData[key] !== originalData[key]
    )
  }, [formData, originalData])

  // Submit handler
  const handleSubmit = async () => {
    if (!formData) return

    const validationErrors = validateRound(formData, contest, [], {
      isEdit: true,
    })
    setErrors(validationErrors)

    if (Object.keys(validationErrors).length > 0) {
      toast.error(`Please fix ${Object.keys(validationErrors).length} field(s)`)
      return
    }

    try {
      const formPayload = new FormData()

      formPayload.append("Name", formData.name)
      formPayload.append("Start", fromDatetimeLocal(formData.start))
      formPayload.append("End", fromDatetimeLocal(formData.end))
      formPayload.append("ProblemType", formData.problemType)
      formPayload.append("TimeLimitSeconds", formData.timeLimitSeconds)

      // Append MCQ config when editing MCQ rounds
      if (formData.problemType === "McqTest") {
        formPayload.append(
          "McqTestConfig.Name",
          formData.mcqTestConfig.name
        )
        formPayload.append(
          "McqTestConfig.Config",
          formData.mcqTestConfig.config
        )
      }

      if (formData.problemConfig) {
        formPayload.append(
          "ProblemConfig.Type",
          formData.problemConfig.type || formData.problemType
        )
        formPayload.append(
          "ProblemConfig.Description",
          formData.problemConfig.description
        )
        formPayload.append(
          "ProblemConfig.Language",
          formData.problemConfig.language
        )
        formPayload.append(
          "ProblemConfig.PenaltyRate",
          formData.problemConfig.penaltyRate
        )

        // Only append TemplateFile if it's actually a File
        if (formData.TemplateFile) {
          formPayload.append(
            "ProblemConfig.TemplateFile",
            formData.TemplateFile
          )
        }
      }

      await updateRound({ id: roundId, contestId, data: formPayload }).unwrap()

      toast.success("Round updated successfully!")
      navigate(`/organizer/contests/${contestId}/rounds/${roundId}`)
    } catch (err) {
      console.error(err)
      toast.error(err?.data?.errorMessage || "Failed to update round")
    }
  }

  // Show loading until data is ready
  if (contestLoading || roundLoading || !formData) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
        loading
      />
    )
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <RoundForm
        formData={formData}
        setFormData={setFormData}
        errors={errors}
        setErrors={setErrors}
        onSubmit={handleSubmit}
        isSubmitting={isUpdating}
        mode="edit"
        hasChanges={hasChanges}
      />
    </PageContainer>
  )
}

export default EditRound
