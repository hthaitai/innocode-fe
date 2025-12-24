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

const OrganizerPlagiarismDetail = () => {
  const { contestId, submissionId } = useParams()

  // Fetch contest info
  const {
    data: contest,
    isLoading: contestLoading,
    isError: contestError,
  } = useGetContestByIdQuery(contestId)

  // Fetch plagiarism detail
  const {
    data: plagiarismData,
    isLoading: plagiarismLoading,
    isError: plagiarismError,
  } = useGetPlagiarismDetailQuery(submissionId)

  const submission = plagiarismData?.submission
  const studentName = submission?.studentName
  const artifacts = plagiarismData?.artifacts || []
  const details = plagiarismData?.details || []
  const matches = plagiarismData?.matches || []

  const contestName = contest?.name ?? "Contest"
  const breadcrumbItems = BREADCRUMBS.ORGANIZER_PLAGIARISM_DETAIL(
    contestName,
    studentName
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_PLAGIARISM_DETAIL(
    contestId,
    studentName
  )

  if (!plagiarismData && !plagiarismLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
        loading={plagiarismLoading || contestLoading}
        error={plagiarismError || contestError}
      >
        <div className="flex items-center justify-center h-[200px] text-gray-500">
          Plagiarism case not found
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
      loading={plagiarismLoading || contestLoading}
      error={plagiarismError || contestError}
    >
      <div className="space-y-5">
        <PlagiarismInformation submission={submission} />
        <SubmittedFiles artifacts={artifacts} />
        <TestCaseResults details={details} />
        <MatchedSubmissions matches={matches} />
        <ResolveAction
          contestId={contestId}
          submissionId={submissionId}
          plagiarismData={plagiarismData}
        />
      </div>
    </PageContainer>
  )
}

export default OrganizerPlagiarismDetail
