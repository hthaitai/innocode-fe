import React from "react"
import PageContainer from "../../components/PageContainer"
import { useOrganizerBreadcrumb } from "../../hooks/organizer/useOrganizerBreadcrumb"

const OrganizerActivityLogs = () => {
  const { contest, breadcrumbData } =
    useOrganizerBreadcrumb("ORGANIZER_ACTIVITY")

  return (
    <PageContainer
      breadcrumb={breadcrumbData.items}
      breadcrumbPaths={breadcrumbData.paths}
    >
      Teams
    </PageContainer>
  )
}

export default OrganizerActivityLogs
