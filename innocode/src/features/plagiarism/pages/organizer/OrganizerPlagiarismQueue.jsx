import React, { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import TableFluent from "@/shared/components/TableFluent"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useGetPlagiarismQueueQuery } from "@/services/plagiarismApi"
import { useGetContestByIdQuery } from "@/services/contestApi"
import { getPlagiarismColumns } from "../../columns/getPlagiarismColumns"
import TablePagination from "../../../../shared/components/TablePagination"
import ManagePlagiarism from "../../components/organizer/ManagePlagiarism"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"
import { LoadingState } from "../../../../shared/components/ui/LoadingState"
import { ErrorState } from "../../../../shared/components/ui/ErrorState"
import { MissingState } from "../../../../shared/components/ui/MissingState"

import { useTranslation } from "react-i18next"

export default function OrganizerPlagiarismQueue() {
  const { t } = useTranslation(["plagiarism"])
  const { contestId } = useParams()

  const [page, setPage] = useState(1)
  const pageSize = 10

  const [studentNameSearch, setStudentNameSearch] = useState("")
  const [teamNameSearch, setTeamNameSearch] = useState("")

  const {
    data: contest,
    isLoading: contestLoading,
    isError: contestError,
  } = useGetContestByIdQuery(contestId)

  const {
    data: plagiarismData,
    isLoading: plagiarismLoading,
    isError: plagiarismError,
  } = useGetPlagiarismQueueQuery({
    contestId,
    pageNumber: page,
    pageSize,
    teamName: teamNameSearch,
    studentName: studentNameSearch,
  })

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_PLAGIARISM(
    contest?.name ?? t("contest")
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_PLAGIARISM(contestId)

  const plagiarismItems = plagiarismData?.data ?? []
  const pagination = plagiarismData?.additionalData ?? {}

  if (plagiarismLoading || contestLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <LoadingState />
      </PageContainer>
    )
  }

  if (plagiarismError || contestError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName={t("submissions")} />
      </PageContainer>
    )
  }

  if (!contest) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <MissingState itemName={t("contest")} />
      </PageContainer>
    )
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <AnimatedSection>
        <ManagePlagiarism
          contestId={contestId}
          plagiarismItems={plagiarismItems}
          pagination={pagination}
          setPage={setPage}
          setTeamNameSearch={setTeamNameSearch}
          setStudentNameSearch={setStudentNameSearch}
        />
      </AnimatedSection>
    </PageContainer>
  )
}
