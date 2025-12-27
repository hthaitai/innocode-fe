import React from "react"
import { useParams } from "react-router-dom"
import { FileText, Scale } from "lucide-react"
import PageContainer from "@/shared/components/PageContainer"
import InfoSection from "@/shared/components/InfoSection"
import DetailTable from "@/shared/components/DetailTable"
import { formatDateTime } from "@/shared/utils/dateTime"
import { useGetAppealsQuery } from "@/services/appealApi"
import { useGetContestByIdQuery } from "@/services/contestApi"
import { useModal } from "@/shared/hooks/useModal"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import ReviewAppealModal from "../../components/organizer/ReviewAppealModal"
import AppealInfo from "../../components/organizer/AppealInfo"
import { useGetAppealByIdQuery } from "../../../../services/appealApi"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import { LoadingState } from "../../../../shared/components/ui/LoadingState"
import { ErrorState } from "../../../../shared/components/ui/ErrorState"
import { MissingState } from "../../../../shared/components/ui/MissingState"
import AppealEvidences from "../../components/organizer/AppealEvidences"
import AppealActions from "../../components/organizer/AppealActions"

const OrganizerAppealDetail = () => {
  const { contestId, appealId } = useParams()
  const { openModal } = useModal()

  // Fetch contest info
  const {
    data: contest,
    isLoading: contestLoading,
    isError: contestError,
  } = useGetContestByIdQuery(contestId)

  // Fetch appeals
  const {
    data: appeal,
    isLoading: appealLoading,
    isError: appealError,
  } = useGetAppealByIdQuery(appealId)

  const evidences = appeal?.evidences ?? []

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_APPEAL_DETAIL(
    contest?.name ?? "Contest",
    appeal?.ownerName
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_APPEAL_DETAIL(
    contestId,
    appealId
  )

  if (appealLoading || contestLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <LoadingState />
      </PageContainer>
    )
  }

  if (appealError || contestError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName="contest" />
      </PageContainer>
    )
  }

  if (!appeal || !contest) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <MissingState itemName="appeal" />
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
          {/* Appeal Info */}
          <AppealInfo appeal={appeal} />

          {/* Evidences */}
          <div>
            <div className="text-sm font-semibold pt-3 pb-2">Evidences</div>
            <AppealEvidences evidences={evidences} />
          </div>

          {/* Actions */}
          <div>
            <div className="text-sm font-semibold pt-3 pb-2">Actions</div>
            <AppealActions appeal={appeal} />
          </div>
        </div>
      </AnimatedSection>
    </PageContainer>
  )
}

export default OrganizerAppealDetail
