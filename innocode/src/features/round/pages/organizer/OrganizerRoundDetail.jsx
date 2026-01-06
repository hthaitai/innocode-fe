import React from "react"
import { useParams } from "react-router-dom"
import { validate as uuidValidate } from "uuid"
import { useTranslation } from "react-i18next"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import RoundInfo from "../../components/organizer/RoundInfo"
import RoundOpenCodeSection from "../../components/organizer/RoundOpenCodeSection"
import StartEndRoundSection from "../../components/organizer/StartEndRoundSection"
import RoundRelatedSettings from "../../components/organizer/RoundRelatedSettings"
import DeleteRoundSection from "../../components/organizer/DeleteRoundSection"
import RoundMockTestUpload from "../../components/organizer/RoundMockTestUpload"
import { useGetRoundByIdQuery } from "../../../../services/roundApi"
import { useGetContestByIdQuery } from "../../../../services/contestApi"
import { Spinner } from "../../../../shared/components/SpinnerFluent"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import { LoadingState } from "../../../../shared/components/ui/LoadingState"
import { ErrorState } from "../../../../shared/components/ui/ErrorState"
import { MissingState } from "../../../../shared/components/ui/MissingState"
import RoundTimeTravelSection from "../../components/organizer/RoundTimeTravelSection"

const OrganizerRoundDetail = () => {
  const { contestId, roundId } = useParams()
  const { t } = useTranslation(["round", "common", "contest"])

  const isValidContestGuid = uuidValidate(contestId)
  const isValidRoundGuid = uuidValidate(roundId)

  const {
    data: contest,
    isLoading: isContestLoading,
    isError: isContestError,
    error: contestError,
  } = useGetContestByIdQuery(contestId)

  const {
    data: round,
    isLoading: isRoundLoading,
    isError: isRoundError,
    error: roundError,
  } = useGetRoundByIdQuery(roundId)

  const isContestNotFound = !isValidContestGuid || contestError?.status === 404

  const breadcrumbItems = isContestNotFound
    ? BREADCRUMBS.ORGANIZER_CONTEST_DETAIL(t("contest:notFound"))
    : BREADCRUMBS.ORGANIZER_ROUND_DETAIL(
        contest?.name,
        !isValidRoundGuid || roundError?.status === 404
          ? t("round:notFound")
          : round?.roundName
      )

  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_ROUND_DETAIL(
    contestId,
    roundId
  )

  if (isContestLoading || isRoundLoading) {
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
    const isContestNotFound =
      contestError?.status === 404 || !contest || !isValidContestGuid
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        {isContestNotFound ? (
          <MissingState itemName={t("common:common.contest")} />
        ) : (
          <ErrorState itemName={t("common:common.contest")} />
        )}
      </PageContainer>
    )
  }

  if (isRoundError || !round || !isValidRoundGuid) {
    const isRoundNotFound =
      roundError?.status === 404 || !round || !isValidRoundGuid
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        {isRoundNotFound ? (
          <MissingState itemName={t("common:common.round")} />
        ) : (
          <ErrorState itemName={t("common:common.round")} />
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
          <div className="space-y-1">
            <RoundInfo round={round} />
            <RoundOpenCodeSection roundId={roundId} />
          </div>

          <div>
            <div className="text-sm font-semibold pt-3 pb-2">
              {t("detail.relatedSettings")}
            </div>

            <div className="space-y-1">
              {round.problemType === "AutoEvaluation" &&
                round.problem?.testType === "MockTest" && (
                  <RoundMockTestUpload roundId={round.roundId} />
                )}

              <RoundRelatedSettings contestId={contestId} round={round} />
            </div>
          </div>

          <div>
            <div className="text-sm font-semibold pt-3 pb-2">
              {t("detail.moreActions")}
            </div>

            <div className="space-y-1">
              <StartEndRoundSection roundId={roundId} />
              <RoundTimeTravelSection
                roundId={roundId}
                isRetakeRound={round.isRetakeRound}
                problemType={round.problemType}
              />
              <DeleteRoundSection round={round} contestId={contestId} />
            </div>
          </div>
        </div>
      </AnimatedSection>
    </PageContainer>
  )
}

export default OrganizerRoundDetail
