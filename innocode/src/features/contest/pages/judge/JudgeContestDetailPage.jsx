import React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { validate as uuidValidate } from "uuid"
import { useGetContestByIdQuery } from "../../../../services/contestApi"
import { useGetRoundsByContestIdQuery } from "../../../../services/roundApi"
import PageContainer from "../../../../shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { LoadingState } from "../../../../shared/components/ui/LoadingState"
import { ErrorState } from "../../../../shared/components/ui/ErrorState"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import JudgeRoundList from "../../components/judge/JudgeRoundList"
import { useTranslation } from "react-i18next"
import JudgeContestInfo from "../../components/judge/JudgeContestInfo"

const JudgeContestDetailPage = () => {
  const { t } = useTranslation(["judge", "common", "errors", "contest"])
  const { contestId } = useParams()
  const navigate = useNavigate()

  const isValidContestId = uuidValidate(contestId)

  const {
    data: contest,
    isLoading: isContestLoading,
    isError: isContestError,
    error: contestError,
  } = useGetContestByIdQuery(contestId, { skip: !isValidContestId })

  const {
    data: roundsData,
    isLoading: isRoundsLoading,
    isError: isRoundsError,
  } = useGetRoundsByContestIdQuery(contestId, { skip: !isValidContestId })

  const rounds =
    roundsData?.data?.filter((r) => r.problemType === "Manual") ?? []

  const hasContestError = !isValidContestId || isContestError

  // Breadcrumbs - Update to show "Not found" for error states
  const breadcrumbItems = hasContestError
    ? ["Contests", t("errors:common.notFound")]
    : BREADCRUMBS.JUDGE_CONTEST_DETAIL(
        contest?.name ?? t("contestDetail.fallbackName"),
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
  if (isContestError || !contest || !isValidContestId) {
    let errorMessage = null

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

  if (isRoundsError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName={t("contestDetail.errorItem")} />
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
        <div className="space-y-5">
          {/* Contest Image */}
          <div className="border border-[#E5E5E5] mb-4 w-[335px] h-[188px] rounded-[5px] overflow-hidden bg-white flex items-center justify-center">
            {contest?.imgUrl ? (
              <img
                src={contest.imgUrl}
                alt={contest.name || "Contest Image"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[#7A7574] text-sm">
                {t("contestDetail.noImage", "No image available")}
              </span>
            )}
          </div>

          {/* Contest Info */}
          <JudgeContestInfo contest={contest} />

          {/* Rounds */}
          <div>
            <div className="text-sm leading-5 font-semibold pt-3 pb-2">
              {t("judge:contestDetail.manualRounds", "Manual Rounds")}
            </div>
            {rounds.length === 0 ? (
              <div
                className={`text-[#7A7574] text-xs leading-4 border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-center items-center min-h-[70px]`}
              >
                {t("judge:contestDetail.noRounds")}
              </div>
            ) : (
              <JudgeRoundList rounds={rounds} onRoundClick={handleRoundClick} />
            )}
          </div>
        </div>
      </AnimatedSection>
    </PageContainer>
  )
}

export default JudgeContestDetailPage
