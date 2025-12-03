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
import { AlertTriangle } from "lucide-react"

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
  const {
    data: rubric,
    isLoading: rubricLoading,
    isError: rubricError,
  } = useFetchRubricQuery(roundId, {
    skip: !roundId,
  })

  // Download submission
  const {
    data: downloadData,
    isLoading: downloadLoading,
    isError: downloadError,
    refetch: fetchDownload,
  } = useDownloadSubmissionQuery(submissionId, { skip: !submissionId })

  // Evaluate submission
  const [evaluateSubmission, { isLoading: evaluating }] =
    useEvaluateSubmissionMutation()

  // Local state for scores
  const [scores, setScores] = useState([])
  const [errors, setErrors] = useState({})

  // Initialize scores when rubric loads
  useEffect(() => {
    if (rubric) {
      const initialScores = rubric.map((c) => {
        const existingResult = submission?.criterionResults?.find(
          (r) => r.rubricId === c.rubricId
        )
        return {
          rubricId: c.rubricId,
          score: existingResult?.score ?? 0,
          note: existingResult?.note ?? "",
        }
      })
      setScores(initialScores)
    }
  }, [rubric, submission])

  if (submissionLoading || rubricLoading || downloadLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
        loading
      />
    )
  }

  if (submissionError || rubricError || downloadError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
        error={submissionError}
      />
    )
  }

  if (!submission) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <div className="text-[#7A7574] text-xs leading-4 border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-center items-center min-h-[70px]">
          Submission not found.
        </div>
      </PageContainer>
    )
  }

  if (!roundId) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <div className="text-[#7A7574] text-xs leading-4 border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-center items-center min-h-[70px]">
          This round has been deleted or is no longer available.
        </div>
      </PageContainer>
    )
  }

  const isEditable = submission.status === "Pending"

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

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <div className="space-y-5">
        {!isEditable && (
          <div className="flex items-center gap-5 border border-yellow-400 bg-yellow-100 text-yellow-800 rounded-[5px] px-5 min-h-[70px] text-sm leading-5">
            <AlertTriangle className="w-5 h-5" />
            <span>
              This submission is{" "}
              <span className="font-bold">
                {submission.status.toLowerCase()}
              </span>{" "}
              and cannot be edited.
            </span>
          </div>
        )}

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
          readOnly={!isEditable}
        />
      </div>
    </PageContainer>
  )
}

export default JudgeManualEvaluationsPage
