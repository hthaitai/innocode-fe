import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import PageContainer from "../../../../shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import {
  useDownloadSubmissionQuery,
  useEvaluateSubmissionMutation,
  useFetchSubmissionByIdQuery,
} from "../../../../services/submissionApi"
import { useGetRoundByIdQuery } from "../../../../services/roundApi"
import { useFetchRubricQuery } from "../../../../services/manualProblemApi"
import SubmissionInfoSection from "../../components/SubmissionInfoSection"
import RubricList from "../../components/RubricList"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { validateScores } from "../../validators/evaluationValidator"
import { AlertTriangle } from "lucide-react"
import { LoadingState } from "../../../../shared/components/ui/LoadingState"
import { ErrorState } from "../../../../shared/components/ui/ErrorState"
import { MissingState } from "../../../../shared/components/ui/MissingState"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import { useTranslation } from "react-i18next"

const JudgeManualEvaluationsPage = () => {
  const { t } = useTranslation("judge")
  const { contestId, roundId, submissionId } = useParams()
  const navigate = useNavigate()

  const { data: round } = useGetRoundByIdQuery(roundId)

  const {
    data: submission,
    isLoading: submissionLoading,
    isError: submissionError,
  } = useFetchSubmissionByIdQuery(submissionId)

  const {
    data: rubricData,
    isLoading: rubricLoading,
    isError: rubricError,
  } = useFetchRubricQuery(roundId)

  const {
    data: downloadData,
    isLoading: downloadLoading,
    isError: downloadError,
    refetch: fetchDownload,
  } = useDownloadSubmissionQuery(submissionId)

  const breadcrumbItems = BREADCRUMBS.JUDGE_ROUND_SUBMISSION_EVALUATION(
    round?.contestName ?? t("manualSubmissions.fallbacks.contest"),
    round?.name ?? t("manualSubmissions.fallbacks.round")
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.JUDGE_ROUND_SUBMISSION_EVALUATION(
    contestId,
    roundId,
    submissionId
  )

  const criteria = rubricData?.data?.criteria ?? []

  const [evaluateSubmission, { isLoading: evaluating }] =
    useEvaluateSubmissionMutation()

  const [scores, setScores] = useState([])
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (criteria.length > 0) {
      const initialScores = criteria.map((c) => {
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
  }, [criteria, submission])

  if (submissionLoading || rubricLoading || downloadLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <LoadingState />
      </PageContainer>
    )
  }

  if (submissionError || rubricError || downloadError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName={t("evaluation.errors.submissionOrRubric")} />
      </PageContainer>
    )
  }

  if (!round || !submission) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <MissingState itemName={t("evaluation.errors.submission")} />
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
    const errors = validateScores(scores, criteria)

    // Stop submission if there are errors
    if (errors.length) {
      errors.forEach((err) => toast.error(err))
      return
    }

    const payload = { submissionId, criterionScores: scores }

    try {
      await evaluateSubmission(payload).unwrap()
      toast.success(t("evaluation.toast.success"))
      navigate(`/judge/contests/${contestId}/rounds/${roundId}/submissions`)
    } catch (err) {
      const errorMessage =
        err?.data?.errorMessage || err?.error || t("evaluation.toast.error")
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
      <AnimatedSection>
        <div className="space-y-5">
          {!isEditable && (
            <div className="flex items-center gap-5 border border-yellow-400 bg-yellow-100 text-yellow-800 rounded-[5px] px-5 min-h-[70px] text-sm leading-5">
              <AlertTriangle className="w-5 h-5" />
              <span>
                {t("evaluation.alert", {
                  status: t(
                    `manualSubmissions.filter.${submission.status}`,
                    submission.status
                  ).toLowerCase(),
                })}
              </span>
            </div>
          )}

          <SubmissionInfoSection
            submission={submission}
            onDownload={handleDownload}
          />

          <RubricList
            rubric={criteria}
            scores={scores}
            evaluating={evaluating}
            onScoreChange={handleScoreChange}
            onSubmit={handleSubmitEvaluation}
            errors={errors}
            readOnly={!isEditable}
          />
        </div>
      </AnimatedSection>
    </PageContainer>
  )
}

export default JudgeManualEvaluationsPage
