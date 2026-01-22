import React, { useState } from "react"
import { useParams } from "react-router-dom"
import { validate as uuidValidate } from "uuid"

import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useGetAppealsQuery } from "../../../../services/appealApi"
import { useGetContestByIdQuery } from "@/services/contestApi"

import ManageAppeals from "../../components/organizer/ManageAppeals"
import { LoadingState } from "../../../../shared/components/ui/LoadingState"
import { ErrorState } from "../../../../shared/components/ui/ErrorState"
import { MissingState } from "../../../../shared/components/ui/MissingState"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"

import { useTranslation } from "react-i18next"

export default function OrganizerAppeals() {
  const { t } = useTranslation(["appeal", "common", "errors"])
  const { contestId } = useParams()
  const [pageNumber, setPageNumber] = useState(1)
  const pageSize = 10
  const [decisionFilter, setDecisionFilter] = useState("Pending")

  // Fetch contest info
  const {
    data: contest,
    isLoading: contestLoading,
    isError: contestError,
    error: contestErrorData,
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

  const breadcrumbPaths = BREADCRUMB_PATHS.ORGANIZER_APPEALS(contestId)

  // Validate UUID format first
  const isValidUuid = uuidValidate(contestId)
  const hasError = !isValidUuid || contestError

  // Update breadcrumb to show "Not found" for error states
  // For errors: ["Contests", "Not found"] instead of ["Contests", "Not found", "Appeals"]
  const breadcrumbItems = hasError
    ? ["Contests", t("errors:common.notFound")]
    : BREADCRUMBS.ORGANIZER_APPEALS(contest?.name ?? t("common:common.contest"))

  if (!isValidUuid) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState
          itemName={t("common:common.contest")}
          message={t("errors:common.invalidId")}
        />
      </PageContainer>
    )
  }

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
    let errorMessage = null

    // Handle specific error status codes for contest errors
    if (contestError && contestErrorData) {
      if (contestErrorData?.status === 404) {
        errorMessage = t("errors:common.notFound")
      } else if (contestErrorData?.status === 403) {
        errorMessage = t("errors:common.forbidden")
      }
    }

    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState
          itemName={
            contestError ? t("common:common.contest") : t("appeal:appeals")
          }
          message={errorMessage}
        />
      </PageContainer>
    )
  }

  if (!contest) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState
          itemName={t("common:common.contest")}
          message={t("errors:common.notFound")}
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
