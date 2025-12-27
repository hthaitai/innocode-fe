import React, { useState } from "react"
import { useParams } from "react-router-dom"

import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useGetAppealsQuery } from "../../../../services/appealApi"
import { useGetContestByIdQuery } from "@/services/contestApi"

import ManageAppeals from "../../components/organizer/ManageAppeals"
import { LoadingState } from "../../../../shared/components/ui/LoadingState"
import { ErrorState } from "../../../../shared/components/ui/ErrorState"
import { MissingState } from "../../../../shared/components/ui/MissingState"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"

export default function OrganizerAppeals() {
  const { contestId } = useParams()
  const [pageNumber, setPageNumber] = useState(1)
  const pageSize = 10
  const [decisionFilter, setDecisionFilter] = useState("Pending")

  // Fetch contest info
  const {
    data: contest,
    isLoading: contestLoading,
    isError: contestError,
  } = useGetContestByIdQuery(contestId)
  const {
    data: appealsData,
    isLoading: appealsLoading,
    isError: appealsError,
  } = useGetAppealsQuery({
    contestId,
    decision: decisionFilter,
    pageNumber,
    pageSize,
  })

  const appeals = appealsData?.data ?? []
  const pagination = appealsData?.additionalData ?? {}

  const breadcrumbItems = BREADCRUMBS.ORGANIZER_APPEALS(
    contest?.name ?? "Contest"
  )
  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_APPEALS(contestId)

  if (contestLoading || appealsLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <LoadingState />
      </PageContainer>
    )
  }

  if (contestError || appealsError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName="appeals" />
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
        <ManageAppeals
          contestId={contestId}
          appeals={appeals}
          pagination={pagination}
          setPageNumber={setPageNumber}
          decisionFilter={decisionFilter}
          setDecisionFilter={setDecisionFilter}
        />
      </AnimatedSection>
    </PageContainer>
  )
}
