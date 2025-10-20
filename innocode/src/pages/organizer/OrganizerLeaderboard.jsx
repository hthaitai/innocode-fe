import React from "react"
import PageContainer from "../../components/PageContainer"
import { useOrganizerBreadcrumb } from "../../hooks/organizer/useOrganizerBreadcrumb"

const OrganizerLeaderboard = () => {
  const { contest, breadcrumbData } = useOrganizerBreadcrumb("ORGANIZER_LEADERBOARD")

  return (
    <PageContainer
      breadcrumb={breadcrumbData.items}
      breadcrumbPaths={breadcrumbData.paths}
    >
      Leaderboard
    </PageContainer>
  )
}

export default OrganizerLeaderboard
