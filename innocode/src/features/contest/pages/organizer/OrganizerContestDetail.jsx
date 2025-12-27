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

const OrganizerContestDetail = () => {
  const { contestId } = useParams()

  // RTK Query
  const {
    data: contest,
    isLoading,
    isError,
  } = useGetContestByIdQuery(contestId)

  // Breadcrumbs
  const breadcrumbItems = BREADCRUMBS.ORGANIZER_CONTEST_DETAIL(
    contest?.name ?? "Contest Detail"
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_CONTEST_DETAIL(contestId)

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

  // If not found
  if (!contest && !isLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <div className="text-[#7A7574] text-xs leading-4 border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-center items-center min-h-[70px]">
          This contest has been deleted or is no longer available.
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
      error={isError}
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
