import React from "react"
import PageContainer from "../../../components/PageContainer"
import { useOrganizerBreadcrumb } from "../../../hooks/organizer/useOrganizerBreadcrumb"

const OrganizerNotifications = () => {
  const { contest, breadcrumbData } = useOrganizerBreadcrumb(
    "ORGANIZER_NOTIFICATIONS"
  )

  return (
    <PageContainer
      breadcrumb={breadcrumbData.items}
      breadcrumbPaths={breadcrumbData.paths}
    >
      Teams
    </PageContainer>
  )
}

export default OrganizerNotifications
