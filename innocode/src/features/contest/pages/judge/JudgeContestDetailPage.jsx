import React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useGetContestByIdQuery } from "../../../../services/contestApi"
import { useGetRoundsByContestIdQuery } from "../../../../services/roundApi" // Ensure this is correct based on what I saw earlier
import PageContainer from "../../../../shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { LoadingState } from "../../../../shared/components/ui/LoadingState"
import { ErrorState } from "../../../../shared/components/ui/ErrorState"
import { MissingState } from "../../../../shared/components/ui/MissingState"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import JudgeRoundList from "../../components/judge/JudgeRoundList"

const JudgeContestDetailPage = () => {
  const { contestId } = useParams()
  const navigate = useNavigate()

  const {
    data: contest,
    isLoading: isContestLoading,
    isError: isContestError,
  } = useGetContestByIdQuery(contestId)

  const {
    data: roundsData,
    isLoading: isRoundsLoading,
    isError: isRoundsError,
  } = useGetRoundsByContestIdQuery(contestId)

  const rounds =
    roundsData?.data?.filter((r) => r.problemType === "Manual") ?? []

  // Breadcrumbs
  const breadcrumbItems = BREADCRUMBS.JUDGE_CONTEST_DETAIL(
    contest?.name ?? "Contest"
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.JUDGE_CONTEST_DETAIL(contestId)

  // Check loading state
  if (isContestLoading || isRoundsLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <LoadingState />
      </PageContainer>
    )
  }

  // Check error state
  if (isContestError || isRoundsError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName="contest or rounds" />
      </PageContainer>
    )
  }

  const handleRoundClick = (roundId) => {
    navigate(`/judge/contests/${contestId}/rounds/${roundId}/submissions`)
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <AnimatedSection>
        {rounds.length === 0 ? (
          <div
            className={`text-[#7A7574] text-xs leading-4 border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-center items-center min-h-[70px]`}
          >
            No rounds found
          </div>
        ) : (
          <JudgeRoundList rounds={rounds} onRoundClick={handleRoundClick} />
        )}
      </AnimatedSection>
    </PageContainer>
  )
}

export default JudgeContestDetailPage
