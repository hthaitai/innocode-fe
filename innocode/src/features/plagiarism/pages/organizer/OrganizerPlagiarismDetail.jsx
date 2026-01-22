import React from "react"
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { validate as uuidValidate } from "uuid"
import PageContainer from "@/shared/components/PageContainer"
import { useGetPlagiarismDetailQuery } from "@/services/plagiarismApi"
import { useGetContestByIdQuery } from "@/services/contestApi"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import PlagiarismInformation from "../../components/organizer/PlagiarismInformation"
import SubmittedFiles from "../../components/organizer/SubmittedFiles"
import TestCaseResults from "../../components/organizer/TestCaseResults"
import MatchedSubmissions from "../../components/organizer/MatchedSubmissions"
import ResolveAction from "../../components/organizer/ResolveAction"
import { LoadingState } from "../../../../shared/components/ui/LoadingState"
import { ErrorState } from "../../../../shared/components/ui/ErrorState"
import { MissingState } from "../../../../shared/components/ui/MissingState"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"

const OrganizerPlagiarismDetail = () => {
  const { t } = useTranslation(["plagiarism", "common", "errors"])
  const { contestId, submissionId } = useParams()

  const isValidContestId = uuidValidate(contestId)
  const isValidSubmissionId = uuidValidate(submissionId)

  const {
    data: contest,
    isLoading: contestLoading,
    isError: isContestError,
    error: contestError,
  } = useGetContestByIdQuery(contestId, { skip: !isValidContestId })

  const {
    data: plagiarismData,
    isLoading: plagiarismLoading,
    isError: isPlagiarismError,
    error: plagiarismError,
  } = useGetPlagiarismDetailQuery(submissionId, {
    skip: !isValidSubmissionId,
  })

  const submission = plagiarismData?.submission
  const artifacts = plagiarismData?.artifacts || []
  const details = plagiarismData?.details || []
  const matches = plagiarismData?.matches || []

  const hasContestError = !isValidContestId || isContestError
  const hasSubmissionError = !isValidSubmissionId || isPlagiarismError
  const hasError = hasContestError || hasSubmissionError

  // Update breadcrumb to show "Not found" for error states
  const breadcrumbItems = hasError
    ? [
        "Contests",
        hasContestError ? t("errors:common.notFound") : contest?.name,
        ...(hasSubmissionError && !hasContestError
          ? ["Plagiarism", t("errors:common.notFound")]
          : []),
      ]
    : BREADCRUMBS.ORGANIZER_PLAGIARISM_DETAIL(
        contest?.name ?? t("common:common.contest"),
        submission?.studentName ?? t("plagiarism:submission", "Submission"),
      )

  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_PLAGIARISM_DETAIL(
    contestId,
    submissionId,
  )

  if (plagiarismLoading || contestLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <LoadingState />
      </PageContainer>
    )
  }

  if (isContestError || !contest || !isValidContestId) {
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

  if (isPlagiarismError || !plagiarismData || !isValidSubmissionId) {
    let errorMessage = null

    // Handle specific error status codes for plagiarism
    if (!isValidSubmissionId) {
      errorMessage = t("errors:common.invalidId")
    } else if (plagiarismError?.status === 404) {
      errorMessage = t("errors:common.notFound")
    } else if (plagiarismError?.status === 403) {
      errorMessage = t("errors:common.forbidden")
    }

    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState
          itemName={t("plagiarism:submission", "Submission")}
          message={errorMessage}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <AnimatedSection>
        <div className="space-y-5">
          <PlagiarismInformation submission={submission} />

          <div>
            <div className="text-sm font-semibold pt-3 pb-2">
              {t("submittedFiles")}
            </div>
            <SubmittedFiles artifacts={artifacts} />
          </div>

          <div>
            <div className="text-sm font-semibold pt-3 pb-2">
              {t("testCaseDetails")}
            </div>
            <TestCaseResults details={details} />
          </div>

          <div>
            <div className="text-sm font-semibold pt-3 pb-2">
              {t("matchedSubmissions")}
            </div>
            <MatchedSubmissions matches={matches} />
          </div>

          <ResolveAction
            contestId={contestId}
            submissionId={submissionId}
            plagiarismData={plagiarismData}
          />
        </div>
      </AnimatedSection>
    </PageContainer>
  )
}

export default OrganizerPlagiarismDetail
