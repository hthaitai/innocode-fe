import React from "react"
import PageContainer from "../../components/PageContainer"
import { useOrganizerBreadcrumb } from "../../hooks/organizer/useOrganizerBreadcrumb"

const OrganizerCertificates = () => {
  const { contest, breadcrumbData } = useOrganizerBreadcrumb("ORGANIZER_CERTIFICATES")

  return (
    <PageContainer
      breadcrumb={breadcrumbData.items}
      breadcrumbPaths={breadcrumbData.paths}
    >
      Teams
    </PageContainer>
  )
}

export default OrganizerCertificates
