import React, { useMemo } from "react"
import { useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import { useGetRoundByIdQuery } from "@/services/roundApi"
import { useGetAutoTestResultsQuery } from "@/services/autoEvaluationApi"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { Spinner } from "../../../../shared/components/SpinnerFluent"
import AutoResultExpandedRow from "../components/AutoResultExpandedRow"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import StatusBadge from "@/shared/components/StatusBadge"
import { formatDateTime } from "@/shared/utils/dateTime"

const AutoResultDetailPage = () => {
  const { contestId, roundId, submissionId } = useParams()

  const { data: round, isLoading: loadingRound } = useGetRoundByIdQuery(roundId)

  const {
    data: resultsData,
    isLoading: loadingResults,
    isError: resultsError,
  } = useGetAutoTestResultsQuery({
    roundId,
    pageNumber: 1,
    pageSize: 10, // Large page size to get all results
  })


  // Find the specific submission
  const submission = useMemo(() => {
    if (!resultsData?.data) return null
    return resultsData.data.find(
      (result) => result.submissionId?.toString() === submissionId?.toString()
    )
  }, [resultsData, submissionId])
  console.log(submission)

  const isLoading = loadingRound || loadingResults

  // Breadcrumb setup - using student name
  const breadcrumbItems = BREADCRUMBS.ORGANIZER_AUTO_RESULT_DETAIL(
    round?.contestName ?? "Contest",
    round?.roundName ?? "Round",
    submission?.submittedByStudentName ?? "Student name"
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_AUTO_RESULT_DETAIL(
    contestId,
    roundId,
    submissionId
  )

  if (isLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <div className="min-h-[70px] flex items-center justify-center">
          <Spinner />
        </div>
      </PageContainer>
    )
  }

  if (resultsError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <div className="text-red-600 text-sm leading-5 border border-red-200 rounded-[5px] bg-red-50 flex items-center px-5 min-h-[70px]">
          Something went wrong while loading results. Please try again.
        </div>
      </PageContainer>
    )
  }

  if (!submission) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <div className="text-[#7A7574] text-sm leading-5 border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-center items-center min-h-[70px]">
          Submission not found or is no longer available.
        </div>
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
          {/* Submission Information */}
          <div className="border border-[#E5E5E5] rounded-[5px] bg-white">
            <div className="p-5 border-b border-[#E5E5E5]">
              <h2 className="text-lg font-semibold text-gray-800">
                Submission Details
              </h2>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-[#7A7574] mb-1">Student</div>
                  <div className="text-sm font-medium text-gray-800">
                    {submission.submittedByStudentName || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-[#7A7574] mb-1">Team</div>
                  <div className="text-sm font-medium text-gray-800">
                    {submission.teamName || "—"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-[#7A7574] mb-1">Status</div>
                  <div>
                    <StatusBadge status={submission.status} />
                  </div>
                </div>
                <div>
                  <div className="text-sm text-[#7A7574] mb-1">Score</div>
                  <div className="text-sm font-medium text-gray-800">
                    {submission.score ?? "—"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-[#7A7574] mb-1">Attempts</div>
                  <div className="text-sm font-medium text-gray-800">
                    {submission.submissionAttemptNumber ?? "—"}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-[#7A7574] mb-1">Created at</div>
                  <div className="text-sm font-medium text-gray-800">
                    {submission.createdAt
                      ? formatDateTime(submission.createdAt)
                      : "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Expanded Row Content */}
          <div className="border border-[#E5E5E5] rounded-[5px] bg-white">
            <AutoResultExpandedRow
              details={submission.details || []}
              artifacts={submission.artifacts || []}
            />
          </div>
        </div>
      </AnimatedSection>
    </PageContainer>
  )
}

export default AutoResultDetailPage
