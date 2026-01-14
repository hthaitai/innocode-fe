import React from "react"
import { useParams } from "react-router-dom"
import { validate as uuidValidate } from "uuid"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import ContestInfo from "../../components/organizer/ContestInfo"
import PublishContestSection from "../../components/organizer/PublishContestSection"
import ContestRelatedSettings from "../../components/organizer/ContestRelatedSettings"
import ManageRounds from "../../components/organizer/ManageRounds"
import DeleteContestSection from "../../components/organizer/DeleteContestSection"
import StartEndContestSection from "../../components/organizer/StartEndContestSection"
import StartEndRegistrationSection from "../../components/organizer/StartEndRegistrationSection"
import CancelContestSection from "../../components/organizer/CancelContestSection"
import { useGetContestByIdQuery } from "../../../../services/contestApi"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import { LoadingState } from "../../../../shared/components/ui/LoadingState"
import { MissingState } from "../../../../shared/components/ui/MissingState"
import { useTranslation } from "react-i18next"
import { ErrorState } from "../../../../shared/components/ui/ErrorState"

const OrganizerContestDetail = () => {
  const { contestId } = useParams()
  const { t } = useTranslation(["pages", "contest", "common"])

  const {
    data: contest,
    isLoading,
    isError,
  } = useGetContestByIdQuery(contestId)

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_CONTEST_DETAIL(
    contest?.name ?? t("common:common.contest")
  )

  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_CONTEST_DETAIL(contestId)

  if (isLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <LoadingState />
      </PageContainer>
    )
  }

  if (isError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName={t("common:common.contest")} />
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
                {t("organizerContestDetail.noImage")}
              </span>
            )}
          </div>

          {/* Contest Info*/}
          <div className="space-y-1">
            <ContestInfo contest={contest} />
            <PublishContestSection contest={contest} />
          </div>

          {/* Rounds */}
          <div>
            <div className="text-sm leading-5 font-semibold pt-3 pb-2">
              {t("organizerContestDetail.sections.rounds")}
            </div>
            <ManageRounds contestId={contestId} />
          </div>

          {/* Related Settings */}
          <div>
            <div className="text-sm leading-5 font-semibold pt-3 pb-2">
              {t("organizerContestDetail.sections.relatedSettings")}
            </div>
            <ContestRelatedSettings contestId={contestId} />
          </div>

          {/* Delete */}
          <div>
            <div className="text-sm leading-5 font-semibold pt-3 pb-2">
              {t("organizerContestDetail.sections.otherSettings")}
            </div>

            <div className="space-y-1">
              <StartEndRegistrationSection contestId={contestId} />
              <StartEndContestSection contestId={contestId} />
              <CancelContestSection contest={contest} />
              <DeleteContestSection contest={contest} />
            </div>
          </div>
        </div>
      </AnimatedSection>
    </PageContainer>
  )
}

export default OrganizerContestDetail
