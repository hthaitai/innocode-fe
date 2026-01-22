import React from "react"
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { validate as uuidValidate } from "uuid"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import RoundInfo from "../../components/organizer/RoundInfo"
import RoundOpenCodeSection from "../../components/organizer/RoundOpenCodeSection"
import StartEndRoundSection from "../../components/organizer/StartEndRoundSection"
import RoundRelatedSettings from "../../components/organizer/RoundRelatedSettings"
import DeleteRoundSection from "../../components/organizer/DeleteRoundSection"
import RoundMockTestUpload from "../../components/organizer/RoundMockTestUpload"
import RoundMockTestTemplateDownload from "../../components/organizer/RoundMockTestTemplateDownload"
import { useGetRoundByIdQuery } from "../../../../services/roundApi"
import { useGetContestByIdQuery } from "../../../../services/contestApi"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import { LoadingState } from "../../../../shared/components/ui/LoadingState"
import { ErrorState } from "../../../../shared/components/ui/ErrorState"
import { MissingState } from "../../../../shared/components/ui/MissingState"
import RoundTimeTravelSection from "../../components/organizer/RoundTimeTravelSection"
import TransferSubmissionsSection from "../../components/organizer/TransferSubmissionsSection"

const OrganizerRoundDetail = () => {
  const { contestId, roundId } = useParams()
  const { t } = useTranslation(["round", "common", "contest", "errors"])

  const isValidContestId = uuidValidate(contestId)
  const isValidRoundId = uuidValidate(roundId)

  const {
    data: contest,
    isLoading: isContestLoading,
    isError: isContestError,
    error: contestError,
  } = useGetContestByIdQuery(contestId, { skip: !isValidContestId })

  const {
    data: round,
    isLoading: isRoundLoading,
    isError: isRoundError,
    error: roundError,
  } = useGetRoundByIdQuery(roundId, { skip: !isValidRoundId })

  const hasContestError = !isValidContestId || isContestError
  const hasRoundError = !isValidRoundId || isRoundError
  const hasError = hasContestError || hasRoundError

  // Update breadcrumb to show "Not found" for error states
  const breadcrumbItems = hasError
    ? [
        "Contests",
        hasContestError ? t("errors:common.notFound") : contest?.name,
        ...(hasRoundError && !hasContestError
          ? [t("errors:common.notFound")]
          : []),
      ]
    : BREADCRUMBS.ORGANIZER_ROUND_DETAIL(
        contest?.name ?? t("common:common.contest"),
        round?.roundName ?? t("common:common.round"),
      )

  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_ROUND_DETAIL(
    contestId,
    roundId,
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

  if (isRoundError || !round || !isValidRoundId) {
    let errorMessage = null

    // Handle specific error status codes for round
    if (!isValidRoundId) {
      errorMessage = t("errors:common.invalidId")
    } else if (roundError?.status === 404) {
      errorMessage = t("errors:common.notFound")
    } else if (roundError?.status === 403) {
      errorMessage = t("errors:common.forbidden")
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
                  <>
                    <RoundMockTestTemplateDownload />
                    <RoundMockTestUpload roundId={round.roundId} />
                  </>
                )}

              <RoundRelatedSettings contestId={contestId} round={round} />

              {round.problemType === "Manual" && (
                <TransferSubmissionsSection
                  contestId={contestId}
                  roundId={roundId}
                />
              )}
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
