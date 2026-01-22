import React, { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { validate as uuidValidate } from "uuid"
import PageContainer from "../../../../shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import {
  useDownloadSubmissionQuery,
  useEvaluateSubmissionMutation,
  useFetchSubmissionByIdQuery,
} from "../../../../services/submissionApi"
import { useGetContestByIdQuery } from "../../../../services/contestApi"
import { useFetchRubricQuery } from "../../../../services/manualProblemApi"
import SubmissionInfoSection from "../../components/SubmissionInfoSection"
import RubricList from "../../components/RubricList"
import { toast } from "react-hot-toast"
import { useNavigate } from "react-router-dom"
import { validateScores } from "../../validators/evaluationValidator"
import { LoadingState } from "../../../../shared/components/ui/LoadingState"
import { ErrorState } from "../../../../shared/components/ui/ErrorState"
import { MissingState } from "../../../../shared/components/ui/MissingState"
import { WarningState } from "../../../../shared/components/ui/WarningState"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import { useTranslation } from "react-i18next"

const JudgeManualEvaluationsPage = () => {
  const { t } = useTranslation(["judge", "common", "errors"])
  const { contestId, roundId, submissionId } = useParams()
  const navigate = useNavigate()

  const isValidContestId = uuidValidate(contestId)
  const isValidRoundId = uuidValidate(roundId)
  const isValidSubmissionId = uuidValidate(submissionId)

  // Refactored to avoid restricted round API
  const {
    data: contestData,
    isLoading: isContestLoading,
    isError: isContestError,
    error: contestError,
  } = useGetContestByIdQuery(contestId, { skip: !isValidContestId })

  const round = contestData?.rounds?.find((r) => r.roundId === roundId)

  const {
    data: submission,
    isLoading: submissionLoading,
    isError: isSubmissionError,
    error: submissionError,
  } = useFetchSubmissionByIdQuery(submissionId, { skip: !isValidSubmissionId })

  const {
    data: rubricData,
    isLoading: rubricLoading,
    isError: isRubricError,
  } = useFetchRubricQuery(roundId, { skip: !isValidRoundId })

  const {
    data: downloadData,
    isLoading: downloadLoading,
    isError: isDownloadError,
    refetch: fetchDownload,
  } = useDownloadSubmissionQuery(submissionId, { skip: !isValidSubmissionId })

  const hasContestError = !isValidContestId || isContestError
  const hasRoundError = !isValidRoundId || (contestData && !round)
  const hasSubmissionError = !isValidSubmissionId || isSubmissionError
  const hasError = hasContestError || hasRoundError || hasSubmissionError

  // Breadcrumbs - Update to show "Not found" for error states
  // Contest error: "Contests > Not found"
  // Round error: "Contests > [Contest Name] > Not found"
  // Submission error: "Contests > [Contest Name] > [Round Name] > Not found"
  const breadcrumbItems = hasError
    ? [
        "Contests",
        hasContestError ? t("errors:common.notFound") : contestData?.name,
        ...(hasRoundError && !hasContestError
          ? [t("errors:common.notFound")]
          : []),
        ...(hasSubmissionError && !hasContestError && !hasRoundError
          ? [round?.name, t("errors:common.notFound")]
          : []),
      ]
    : BREADCRUMBS.JUDGE_ROUND_SUBMISSION_EVALUATION(
        round?.contestName ?? t("manualSubmissions.fallbacks.contest"),
        round?.name ?? t("manualSubmissions.fallbacks.round"),
      )
  const breadcrumbPaths = BREADCRUMB_PATHS.JUDGE_ROUND_SUBMISSION_EVALUATION(
    contestId,
    roundId,
    submissionId,
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
          (r) => r.rubricId === c.rubricId,
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

  if (
    submissionLoading ||
    rubricLoading ||
    downloadLoading ||
    isContestLoading
  ) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <LoadingState />
      </PageContainer>
    )
  }

  if (isContestError || !contestData || !isValidContestId) {
    let errorMessage = null

    // Handle specific error status codes for contest
    if (!isValidContestId) {
      errorMessage = t("errors:common.invalidId")
    } else if (contestError?.status === 404) {
      errorMessage = t("errors:common.notFound")
    } else if (contestError?.status === 403) {
      errorMessage = t("errors:common.forbidden")
    }

    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState
          itemName={t("common:common.contest")}
          message={errorMessage}
        />
      </PageContainer>
    )
  }

  if (!round || !isValidRoundId || isRubricError) {
    let errorMessage = null

    // Handle specific error for round
    if (!isValidRoundId) {
      errorMessage = t("errors:common.invalidId")
    } else if (!round) {
      errorMessage = t("errors:common.notFound")
    }

    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState
          itemName={t("common:common.round")}
          message={errorMessage}
        />
      </PageContainer>
    )
  }

  if (
    isSubmissionError ||
    !submission ||
    !isValidSubmissionId ||
    isDownloadError
  ) {
    let errorMessage = null

    // Handle specific error status codes for submission
    if (!isValidSubmissionId) {
      errorMessage = t("errors:common.invalidId")
    } else if (submissionError?.status === 404) {
      errorMessage = t("errors:common.notFound")
    } else if (submissionError?.status === 403) {
      errorMessage = t("errors:common.forbidden")
    }

    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState
          itemName={t("evaluation.errors.submission")}
          message={errorMessage}
        />
      </PageContainer>
    )
  }

  const isEditable = submission.status === "Pending"

  const handleScoreChange = (rubricId, field, value) => {
    setScores((prev) =>
      prev.map((s) => (s.rubricId === rubricId ? { ...s, [field]: value } : s)),
    )

    // Clear error for this field as soon as user types
    if (errors[rubricId]?.[field]) {
      setErrors((prev) => ({
        ...prev,
        [rubricId]: { ...prev[rubricId], [field]: undefined },
      }))
    }
  }

  const handleSubmitEvaluation = async () => {
    // Run centralized validator
    const validationErrors = validateScores(scores, criteria, t)
    setErrors(validationErrors)

    // Stop submission if there are errors
    if (Object.keys(validationErrors).length > 0) {
      toast.error(
        t("evaluation.errors.validationSummary", {
          count: Object.keys(validationErrors).length,
        }),
      )
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
            <WarningState
              message={t("evaluation.alert", {
                status: t(
                  `manualSubmissions.filter.${submission.status}`,
                  submission.status,
                ).toLowerCase(),
              })}
            />
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
