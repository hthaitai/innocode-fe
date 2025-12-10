import React from "react"
import { useParams } from "react-router-dom"
import { User, ChevronRight } from "lucide-react"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useGetContestByIdQuery } from "@/services/contestApi"
import { useGetContestJudgesQuery } from "@/services/contestJudgeApi"
import StatusBadge from "@/shared/components/StatusBadge"

const ContestJudgesListPage = () => {
  const { contestId } = useParams()

  const {
    data: contest,
    isLoading: isContestLoading,
    isError: isContestError,
  } = useGetContestByIdQuery(contestId)

  const {
    data: judgesData,
    isLoading: isJudgesLoading,
    isError: isJudgesError,
  } = useGetContestJudgesQuery(contestId)

  const judges = judgesData?.data || []

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_CONTEST_JUDGE_LIST(
    contest?.name ?? "Contest"
  )
  const breadcrumbPaths =
    BREADCRUMB_PATHS.ORGANIZER_CONTEST_JUDGE_LIST(contestId)

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
      loading={isContestLoading || isJudgesLoading}
      error={isContestError || isJudgesError}
    >
      <div className="space-y-3">
        {judges.length === 0 ? (
          <div className="text-[#7A7574] text-xs leading-4 border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-center items-center min-h-[70px]">
            No judges have been assigned to this contest.
          </div>
        ) : (
          judges.map((judge) => (
            <div
              key={judge.userId || judge.email}
              className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 py-3 flex justify-between items-center min-h-[70px]"
            >
              <div className="flex gap-5 items-center">
                <User size={20} />
                <div>
                  <p className="text-[14px] leading-5">
                    {judge.fullName || "Unnamed Judge"}
                  </p>
                  <p className="text-[12px] leading-4 text-[#7A7574]">
                    {judge.email || "Email not provided"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={judge.status || "Pending"} />
              </div>
            </div>
          ))
        )}
      </div>
    </PageContainer>
  )
}

export default ContestJudgesListPage
