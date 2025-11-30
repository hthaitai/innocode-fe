import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import PageContainer from "../../../../shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import {
  useDownloadSubmissionQuery,
  useEvaluateSubmissionMutation,
  useFetchSubmissionByIdQuery,
} from "../../../../services/submissionApi"
import { useFetchRubricQuery } from "../../../../services/manualProblemApi"
import SubmissionInfoSection from "../../components/SubmissionInfoSection"
import RubricList from "../../components/RubricList"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { validateScores } from "../../validators/evaluationValidator"

const JudgeManualEvaluationsPage = () => {
  const { submissionId } = useParams()
  const navigate = useNavigate()

  const breadcrumbItems = BREADCRUMBS.JUDGE_MANUAL_EVALUATION
  const breadcrumbPaths = BREADCRUMB_PATHS.JUDGE_MANUAL_EVALUATION(submissionId)

  // Fetch submission by ID
  const {
    data: submission,
    isLoading: submissionLoading,
    isError: submissionError,
  } = useFetchSubmissionByIdQuery(submissionId, { skip: !submissionId })

  const roundId = submission?.roundId

  // Fetch rubric using the roundId
  const { data: rubric, isLoading: rubricLoading } = useFetchRubricQuery(
    roundId,
    {
      skip: !roundId,
    }
  )

  // Download submission
  const { data: downloadData, refetch: fetchDownload } =
    useDownloadSubmissionQuery(submissionId, { skip: !submissionId })

  // Evaluate submission
  const [evaluateSubmission, { isLoading: evaluating }] =
    useEvaluateSubmissionMutation()

  // Local state for scores
  const [scores, setScores] = useState([])
  const [errors, setErrors] = useState({})

  // Initialize scores when rubric loads
  useEffect(() => {
    if (rubric) {
      const initialScores = rubric.map((c) => ({
        rubricId: c.rubricId,
        score: 0,
        note: "",
      }))
      setScores(initialScores)
    }
  }, [rubric])

  const handleScoreChange = (rubricId, field, value) => {
    setScores((prev) =>
      prev.map((s) => (s.rubricId === rubricId ? { ...s, [field]: value } : s))
    )

    // Clear error for this field as soon as user types
    setErrors((prev) => ({
      ...prev,
      [rubricId]: { ...prev[rubricId], [field]: false },
    }))
  }

  const handleSubmitEvaluation = async () => {
    // Run centralized validator
    const errors = validateScores(scores, rubric)

    // Stop submission if there are errors
    if (errors.length) {
      errors.forEach((err) => toast.error(err))
      return
    }

    const payload = { submissionId, criterionScores: scores }

    try {
      await evaluateSubmission(payload).unwrap()
      toast.success("Evaluation submitted successfully!")
      navigate("/judge/manual-submissions")
    } catch (err) {
      const errorMessage =
        err?.data?.errorMessage || err?.error || "Failed to submit evaluation"
      toast.error(errorMessage)
    }
  }

  // Handle download
  const handleDownload = () => {
    if (downloadData) {
      window.open(downloadData, "_blank")
    } else {
      fetchDownload()
    }
  }

  if (submissionLoading) return <div>Loading submission data...</div>
  if (!roundId) return <div>Round not found for this submission.</div>
  if (rubricLoading) return <div>Loading rubric...</div>

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <div className="space-y-5">
        <SubmissionInfoSection
          submission={submission}
          onDownload={handleDownload}
        />

        <RubricList
          rubric={rubric}
          scores={scores}
          evaluating={evaluating}
          onScoreChange={handleScoreChange}
          onSubmit={handleSubmitEvaluation}
          errors={errors}
        />
      </div>
    </PageContainer>
  )
}

export default JudgeManualEvaluationsPage
