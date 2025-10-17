import React from "react"
import PageContainer from "../../components/PageContainer"
import { useOrganizerBreadcrumb } from "../../hooks/organizer/useOrganizerBreadcrumb"

const OrganizerTeams = () => {
  const { contest, breadcrumbData } = useOrganizerBreadcrumb("ORGANIZER_TEAMS")

  return (
    <PageContainer
      breadcrumb={breadcrumbData.items}
      breadcrumbPaths={breadcrumbData.paths}
    >
      Teams for {contest?.name}
    </PageContainer>
  )
}

export default OrganizerTeams
