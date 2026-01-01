import React from "react"
import { useParams } from "react-router-dom"
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
  const { contestId, submissionId } = useParams()

  const {
    data: contest,
    isLoading: contestLoading,
    isError: contestError,
  } = useGetContestByIdQuery(contestId)

  const {
    data: plagiarismData,
    isLoading: plagiarismLoading,
    isError: plagiarismError,
  } = useGetPlagiarismDetailQuery(submissionId)

  const submission = plagiarismData?.submission
  const artifacts = plagiarismData?.artifacts || []
  const details = plagiarismData?.details || []
  const matches = plagiarismData?.matches || []

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_PLAGIARISM_DETAIL(
    contest?.name ?? "Contest",
    submission?.studentName ?? "Student"
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

  if (plagiarismError || contestError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName="submission" />
      </PageContainer>
    )
  }

  if (!contest) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <MissingState itemName="contest" />
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
              Submitted files
            </div>
            <SubmittedFiles artifacts={artifacts} />
          </div>

          <div>
            <div className="text-sm font-semibold pt-3 pb-2">
              Test case details
            </div>
            <TestCaseResults details={details} />
          </div>

          <div>
            <div className="text-sm font-semibold pt-3 pb-2">
              Matched submissions
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
