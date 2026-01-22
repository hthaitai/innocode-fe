import { useNavigate, useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useGetContestByIdQuery } from "@/services/contestApi"
import { validate as uuidValidate } from "uuid"

import { LayoutTemplate, GraduationCap } from "lucide-react"
import { Icon } from "@iconify/react"
import { Link } from "react-router-dom"
import { ChevronRight } from "lucide-react"
import PageContainer from "@/shared/components/PageContainer"
import { AnimatedSection } from "@/shared/components/ui/AnimatedSection"
import { LoadingState } from "@/shared/components/ui/LoadingState"
import { ErrorState } from "@/shared/components/ui/ErrorState"
import { MissingState } from "@/shared/components/ui/MissingState"

const OrganizerCertificates = () => {
  const { contestId } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation(["pages", "common", "contest", "errors"])

  const isValidGuid = uuidValidate(contestId)

  const {
    data: contest,
    isLoading: isContestLoading,
    isError,
    error,
  } = useGetContestByIdQuery(contestId, { skip: !isValidGuid })

  const hasError = !isValidGuid || isError

  // Update breadcrumb to show "Not found" for error states
  // For errors: ["Contests", "Not found"] instead of ["Contests", "Not found", "Certificates"]
  const breadcrumbItems = hasError
    ? ["Contests", t("errors:common.notFound")]
    : BREADCRUMBS.ORGANIZER_CERTIFICATES(contest?.name || "...")

  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_CERTIFICATES(contestId)

  const menuItems = [
    {
      title: t("organizerContestDetail.relatedSettings.templateGallery.title"),
      subtitle: t(
        "organizerContestDetail.relatedSettings.templateGallery.subtitle",
      ),
      icon: <LayoutTemplate size={20} />,
      path: "templates",
    },
    {
      title: t(
        "organizerContestDetail.relatedSettings.issuedStudentCertificates.title",
      ),
      subtitle: t(
        "organizerContestDetail.relatedSettings.issuedStudentCertificates.subtitle",
      ),
      icon: <GraduationCap size={20} />,
      path: "issued/students",
    },
    {
      title: t(
        "organizerContestDetail.relatedSettings.issuedTeamCertificates.title",
      ),
      subtitle: t(
        "organizerContestDetail.relatedSettings.issuedTeamCertificates.subtitle",
      ),
      icon: <Icon icon="mdi:certificate-outline" width={20} height={20} />,
      path: "issued/teams",
    },
  ]

  if (isContestLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <LoadingState />
      </PageContainer>
    )
  }

  if (isError || !contest || !isValidGuid) {
    let errorMessage = null

    // Handle specific error status codes
    if (!isValidGuid) {
      errorMessage = t("errors:common.invalidId")
    } else if (error?.status === 404) {
      errorMessage = t("errors:common.notFound")
    } else if (error?.status === 403) {
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

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <AnimatedSection>
        <div className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={`/organizer/contests/${contestId}/certificates/${item.path}`}
              className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px] hover:bg-[#F6F6F6] transition-colors"
            >
              <div className="flex gap-5 items-center">
                {item.icon}
                <div>
                  <p className="text-[14px] leading-[20px]">{item.title}</p>
                  <p className="text-[12px] leading-[16px] text-[#7A7574]">
                    {item.subtitle}
                  </p>
                </div>
              </div>
              <ChevronRight size={20} className="text-[#7A7574]" />
            </Link>
          ))}
        </div>
      </AnimatedSection>
    </PageContainer>
  )
}

export default OrganizerCertificates
