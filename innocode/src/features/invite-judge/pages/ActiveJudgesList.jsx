import React from "react"
import { useParams } from "react-router-dom"
import { User, ChevronRight } from "lucide-react"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useGetContestByIdQuery } from "@/services/contestApi"
import { useGetContestJudgesQuery } from "@/services/contestJudgeApi"
import StatusBadge from "@/shared/components/StatusBadge"
import { LoadingState } from "@/shared/components/ui/LoadingState"
import { ErrorState } from "@/shared/components/ui/ErrorState"
import { MissingState } from "@/shared/components/ui/MissingState"
import { AnimatedSection } from "@/shared/components/ui/AnimatedSection"

import { useTranslation } from "react-i18next"

const ActiveJudgesList = () => {
  const { t } = useTranslation("judge")
  const { contestId } = useParams()

  const {
    data: contest,
    isLoading: isContestLoading,
    isError: isContestError,
  } = useGetContestByIdQuery(contestId)

  const {
    data: judgesData,
    isLoading: isJudgesLoading,
    isError: isJudgesError,
  } = useGetContestJudgesQuery(contestId)

  const judges = judgesData?.data ?? []

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_CONTEST_JUDGE_LIST(
    contest?.name ?? "Contest",
    t("judges"),
    t("activeJudgesTitle"),
  )
  const breadcrumbPaths =
    BREADCRUMB_PATHS.ORGANIZER_CONTEST_JUDGE_LIST(contestId)

  if (isContestLoading || isJudgesLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <LoadingState />
      </PageContainer>
    )
  }

  if (isContestError || isJudgesError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName="judges" />
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
        <div className="space-y-1">
          {judges.length === 0 ? (
            <div className="text-[#7A7574] text-xs leading-4 border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-center items-center min-h-[70px]">
              {t("activeJudges.noJudgesAssigned")}
            </div>
          ) : (
            judges.map((judge) => (
              <div
                key={judge.userId || judge.email}
                className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 py-3 flex justify-between items-center min-h-[70px]"
              >
                <div className="flex gap-5 items-center">
                  <User size={20} />
                  <div>
                    <p className="text-[14px] leading-5">
                      {judge.fullName || t("activeJudges.unnamed")}
                    </p>
                    <p className="text-[12px] leading-4 text-[#7A7574]">
                      {judge.email || t("activeJudges.noEmail")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge
                    status={judge.status || "Pending"}
                    translate="judge"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </AnimatedSection>
    </PageContainer>
  )
}

export default ActiveJudgesList
