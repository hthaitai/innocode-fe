import React from "react"
import { useParams } from "react-router-dom"
import { validate as uuidValidate } from "uuid"
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

import { useTranslation } from "react-i18next"

const OrganizerAppealDetail = () => {
  const { t } = useTranslation(["appeal", "common", "errors"])
  const { contestId, appealId } = useParams()
  const { openModal } = useModal()

  const isValidContestId = uuidValidate(contestId)
  const isValidAppealId = uuidValidate(appealId)

  // Fetch contest info
  const {
    data: contest,
    isLoading: contestLoading,
    isError: isContestError,
    error: contestError,
  } = useGetContestByIdQuery(contestId, { skip: !isValidContestId })

  // Fetch appeals
  const {
    data: appeal,
    isLoading: appealLoading,
    isError: isAppealError,
    error: appealError,
  } = useGetAppealByIdQuery(appealId, { skip: !isValidAppealId })

  const evidences = appeal?.evidences ?? []

  const hasContestError = !isValidContestId || isContestError
  const hasAppealError = !isValidAppealId || isAppealError
  const hasError = hasContestError || hasAppealError

  // Update breadcrumb to show "Not found" for error states
  const breadcrumbItems = hasError
    ? [
        "Contests",
        hasContestError ? t("errors:common.notFound") : contest?.name,
        ...(hasAppealError && !hasContestError
          ? ["Appeals", t("errors:common.notFound")]
          : []),
      ]
    : BREADCRUMBS.ORGANIZER_APPEAL_DETAIL(
        contest?.name ?? "Contest",
        appeal?.ownerName ?? "Appeal",
      )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_APPEAL_DETAIL(
    contestId,
    appealId,
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

  if (isAppealError || !appeal || !isValidAppealId) {
    let errorMessage = null

    // Handle specific error status codes for appeal
    if (!isValidAppealId) {
      errorMessage = t("errors:common.invalidId")
    } else if (appealError?.status === 404) {
      errorMessage = t("errors:common.notFound")
    } else if (appealError?.status === 403) {
      errorMessage = t("errors:common.forbidden")
    }

    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName={t("appeal:appealInfo")} message={errorMessage} />
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
            <div className="text-sm font-semibold pt-3 pb-2">
              {t("appeal:evidences")}
            </div>
            <AppealEvidences evidences={evidences} />
          </div>

          {/* Actions */}
          <div>
            <div className="text-sm font-semibold pt-3 pb-2">
              {t("appeal:actions")}
            </div>
            <AppealActions appeal={appeal} />
          </div>
        </div>
      </AnimatedSection>
    </PageContainer>
  )
}

export default OrganizerAppealDetail
