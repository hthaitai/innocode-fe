import React from "react"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import ManageContests from "../../components/organizer/ManageContests"
import {
  useGetOrganizerContestsQuery,
  useDeleteContestMutation,
} from "../../../../services/contestApi"
import { useState } from "react"
import { LoadingState } from "../../../../shared/components/ui/LoadingState"
import { ErrorState } from "../../../../shared/components/ui/ErrorState"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"

const OrganizerContests = () => {
  const [page, setPage] = useState(1)
  const pageSize = 15
  const [searchName, setSearchName] = useState("")

  const {
    data: contestsData,
    isLoading,
    isError,
  } = useGetOrganizerContestsQuery({
    pageNumber: page,
    pageSize,
    nameSearch: searchName,
  })

  const contests = contestsData?.data ?? []
  const pagination = contestsData?.additionalData ?? {}

  const breadcrumbItems = BREADCRUMBS.CONTESTS
  const breadcrumbPaths = BREADCRUMB_PATHS.CONTESTS

  if (isLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <LoadingState />
      </PageContainer>
    )
  }

  if (isError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <LoadingState />
      </PageContainer>
    )
  }

  if (isError) {
    return (
      <PageContainer
        breadcrumb={breadcrumbItems}
        breadcrumbPaths={breadcrumbPaths}
      >
        <ErrorState itemName="contests" />
      </PageContainer>
    )
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <AnimatedSection direction="bottom">
        <ManageContests
          contests={contests}
          pagination={pagination}
          setPage={setPage}
          setSearchName={setSearchName}
        />
      </AnimatedSection>
    </PageContainer>
  )
}

export default OrganizerContests
