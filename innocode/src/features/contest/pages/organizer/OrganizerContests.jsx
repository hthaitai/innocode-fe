import React from "react"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import ManageContests from "../../components/organizer/ManageContests"

const OrganizerContests = () => {
  const breadcrumbItems = BREADCRUMBS.CONTESTS
  const breadcrumbPaths = BREADCRUMB_PATHS.CONTESTS

  return (
    <PageContainer
      breadcrumb={breadcrumbItems}
      breadcrumbPaths={breadcrumbPaths}
    >
      <ManageContests />
    </PageContainer>
  )
}

export default OrganizerContests
