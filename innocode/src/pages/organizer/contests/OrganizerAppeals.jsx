import React from "react"
import PageContainer from "../../../components/PageContainer"
import { useOrganizerBreadcrumb } from "../../../hooks/organizer/useOrganizerBreadcrumb"

const OrganizerAppeals = () => {
  const { contest, breadcrumbData } = useOrganizerBreadcrumb("ORGANIZER_APPEALS")

  return (
    <PageContainer
      breadcrumb={breadcrumbData.items}
      breadcrumbPaths={breadcrumbData.paths}
    >
      Teams
    </PageContainer>
  )
}

export default OrganizerAppeals
