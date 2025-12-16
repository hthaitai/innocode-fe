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

const OrganizerAppealDetail = () => {
  const { contestId, appealId } = useParams()
  const { openModal, modalData, closeModal } = useModal()

  // Fetch contest info
  const {
    data: contest,
    isLoading: contestLoading,
    isError: contestError,
  } = useGetContestByIdQuery(contestId)

  // Fetch appeals
  const {
    data: appealsData,
    isLoading: appealsLoading,
    isError: appealsError,
  } = useGetAppealsQuery({
    contestId,
    pageNumber: 1,
    pageSize: 100,
  })

  const appeal = appealsData?.data?.find((a) => a.appealId === appealId)

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_APPEAL_DETAIL(
    contest?.name || "Contest",
    appeal?.ownerName
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_APPEAL_DETAIL(
    contestId,
    appealId
  )

  if (!appeal) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
        loading={appealsLoading || contestLoading}
        error={appealsError || contestError}
      >
        <div className="flex items-center justify-center h-[200px] text-gray-500">
          Appeal not found
        </div>
      </PageContainer>
    )
  }

  // Correct modal handler
  const handleReviewModal = () => {
    openModal("reviewAppeal", { appeal })
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
      loading={appealsLoading || contestLoading}
      error={appealsError || contestError}
    >
      <div className="space-y-5">
        {/* Appeal Info */}
        <AppealInfo appeal={appeal} />

        {/* Evidences */}
        <div>
          <div className="text-sm font-semibold pt-3 pb-2">Evidences</div>
          <div className="flex flex-col gap-1">
            {appeal.evidences?.map((evidence) => (
              <div
                key={evidence.evidenceId}
                className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]"
              >
                <div className="flex items-center gap-5">
                  <FileText size={20} />
                  <div className="flex flex-col justify-center">
                    <p className="text-[14px] leading-[20px]">
                      {evidence.note}
                    </p>
                    <p className="text-[12px] leading-[16px] text-[#7A7574]">
                      {formatDateTime(evidence.createdAt)}
                    </p>
                  </div>
                </div>

                <button
                  className="button-white"
                  onClick={() =>
                    window.open(evidence.url, "_blank", "noopener,noreferrer")
                  }
                >
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div>
          <div className="text-sm font-semibold pt-3 pb-2">Actions</div>
          <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px] hover:bg-[#F6F6F6] transition-colors">
            <div className="flex items-center gap-5">
              <Scale size={20} />
              <div className="flex flex-col justify-center">
                <p className="text-[14px] leading-[20px]">Review appeal</p>
                <p className="text-[12px] leading-[16px] text-[#7A7574]">
                  Open a modal to approve or reject thís appeal and provide a
                  reason
                </p>
              </div>
            </div>
            <button className="button-orange" onClick={handleReviewModal}>
              Review
            </button>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

export default OrganizerAppealDetail
