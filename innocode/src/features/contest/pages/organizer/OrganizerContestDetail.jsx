import React, { useMemo } from "react"
import { useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import ContestInfo from "../../components/organizer/ContestInfo"
import PublishContestSection from "../../components/organizer/PublishContestSection"
import ContestRelatedSettings from "../../components/organizer/ContestRelatedSettings"
import RoundsList from "../../components/organizer/ManageRounds"
import DeleteContestSection from "../../components/organizer/DeleteContestSection"
import StartEndContestSection from "../../components/organizer/StartEndContestSection"
import { useGetContestByIdQuery } from "../../../../services/contestApi"
import { Spinner } from "../../../../shared/components/SpinnerFluent"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import { LoadingState } from "../../../../shared/components/ui/LoadingState"
import { ErrorState } from "../../../../shared/components/ui/ErrorState"
import { MissingState } from "../../../../shared/components/ui/MissingState"

const OrganizerContestDetail = () => {
  const { contestId } = useParams()

  const {
    data: contest,
    isLoading,
    isError,
  } = useGetContestByIdQuery(contestId)

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_CONTEST_DETAIL(contest?.name)
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
        <ErrorState itemName="contest" />
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
          {/* Contest Image */}
          <div className="border border-[#E5E5E5] mb-4 w-[335px] h-[188px] rounded-[5px] overflow-hidden bg-white flex items-center justify-center">
            {contest?.imgUrl ? (
              <img
                src={contest.imgUrl}
                alt={contest.name || "Contest Image"}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-[#7A7574] text-sm">No image</span>
            )}
          </div>

          {/* Contest Info*/}
          <div className="space-y-1">
            <ContestInfo contest={contest} />

            <PublishContestSection contest={contest} />

            <StartEndContestSection contestId={contestId} />
          </div>

          {/* Rounds */}
          <div>
            <div className="text-sm leading-5 font-semibold pt-3 pb-2">
              Rounds management
            </div>
            <RoundsList contestId={contestId} />
          </div>

          {/* Related Settings */}
          <div>
            <div className="text-sm leading-5 font-semibold pt-3 pb-2">
              Related settings
            </div>
            <ContestRelatedSettings contestId={contestId} />
          </div>

          {/* Delete */}
          <div>
            <div className="text-sm leading-5 font-semibold pt-3 pb-2">
              Other settings
            </div>
            <DeleteContestSection contest={contest} />
          </div>
        </div>
      </AnimatedSection>
    </PageContainer>
  )
}

export default OrganizerContestDetail
