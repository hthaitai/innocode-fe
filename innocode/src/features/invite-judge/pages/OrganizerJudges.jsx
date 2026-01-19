import React from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useGetContestByIdQuery } from "@/services/contestApi"
import { validate as uuidValidate } from "uuid"
import { Mail, UserCheck, ChevronRight } from "lucide-react" // Icons
import PageContainer from "@/shared/components/PageContainer"
import { AnimatedSection } from "@/shared/components/ui/AnimatedSection"
import { LoadingState } from "@/shared/components/ui/LoadingState"
import { ErrorState } from "@/shared/components/ui/ErrorState"
import { MissingState } from "@/shared/components/ui/MissingState"

const OrganizerJudges = () => {
  const { contestId } = useParams()
  const navigate = useNavigate()
  const { t } = useTranslation(["pages", "common", "judge"])

  const isValidGuid = uuidValidate(contestId)

  const {
    data: contest,
    isLoading: isContestLoading,
    isError,
    error,
  } = useGetContestByIdQuery(contestId, { skip: !isValidGuid })

  const isNotFound = !isValidGuid || error?.status === 404

  // Using BREADCRUMBS.ORGANIZER_CONTEST_JUDGES which maps to "Judges"
  const breadcrumbItems = isNotFound
    ? BREADCRUMBS.ORGANIZER_CONTEST_DETAIL(t("contest:notFound"))
    : BREADCRUMBS.ORGANIZER_CONTEST_JUDGES(
        contest?.name || "...",
        t("judge:judges"),
      )

  const breadcrumbPaths = isNotFound
    ? BREADCRUMBS.ORGANIZER_CONTEST_DETAIL(contestId)
    : BREADCRUMB_PATHS.ORGANIZER_CONTEST_JUDGES(contestId)

  const menuItems = [
    {
      title: t("judge:inviteJudge"),
      subtitle: t("judge:inviteJudgeSubtitle"),
      icon: <Mail size={20} />,
      path: "invite-new",
    },
    {
      title: t("judge:activeJudgesTitle"),
      subtitle: t("judge:activeJudgesSubtitle"),
      icon: <UserCheck size={20} />,
      path: "active",
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
    const isNotFound = error?.status === 404 || !contest || !isValidGuid

    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        {isNotFound ? (
          <MissingState itemName={t("common:common.contest")} />
        ) : (
          <ErrorState itemName={t("common:common.contest")} />
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
        <div className="flex flex-col gap-1">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={`/organizer/contests/${contestId}/judges/${item.path}`}
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

export default OrganizerJudges
