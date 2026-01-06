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
  const { t } = useTranslation(["plagiarism", "common", "contest"])
  const { contestId, submissionId } = useParams()

  const isValidContestGuid = uuidValidate(contestId)
  const isValidSubmissionGuid = uuidValidate(submissionId)

  const {
    data: contest,
    isLoading: contestLoading,
    isError: isContestError,
    error: contestError,
  } = useGetContestByIdQuery(contestId, { skip: !isValidContestGuid })

  const {
    data: plagiarismData,
    isLoading: plagiarismLoading,
    isError: isPlagiarismError,
    error: plagiarismError,
  } = useGetPlagiarismDetailQuery(submissionId, {
    skip: !isValidSubmissionGuid,
  })

  const submission = plagiarismData?.submission
  const artifacts = plagiarismData?.artifacts || []
  const details = plagiarismData?.details || []
  const matches = plagiarismData?.matches || []

  const isContestNotFound = !isValidContestGuid || contestError?.status === 404
  const isSubmissionNotFound =
    !isValidSubmissionGuid || plagiarismError?.status === 404

  const breadcrumbItems = isContestNotFound
    ? BREADCRUMBS.ORGANIZER_CONTEST_DETAIL(t("contest:notFound"))
    : BREADCRUMBS.ORGANIZER_PLAGIARISM_DETAIL(
        contest?.name ?? t("contest"),
        isSubmissionNotFound
          ? t("plagiarism:notFound", "Submission Not Found")
          : submission?.studentName ?? t("student")
      )

  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_PLAGIARISM_DETAIL(
    contestId,
    submissionId
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

  if (isContestError || !contest || !isValidContestGuid) {
    const isNotFound =
      contestError?.status === 404 || !contest || !isValidContestGuid
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        {isNotFound ? (
          <MissingState itemName={t("common:common.contest")} />
        ) : (
          <ErrorState itemName={t("common:common.contest")} />
        )}
      </PageContainer>
    )
  }

  if (isPlagiarismError || !plagiarismData || !isValidSubmissionGuid) {
    const isNotFound =
      plagiarismError?.status === 404 ||
      !plagiarismData ||
      !isValidSubmissionGuid
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        {isNotFound ? (
          <MissingState itemName={t("plagiarism:submission", "Submission")} />
        ) : (
          <ErrorState itemName={t("plagiarism:submission", "Submission")} />
        )}
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
