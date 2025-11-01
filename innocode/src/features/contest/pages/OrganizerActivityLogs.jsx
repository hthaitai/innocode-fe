import React from "react"
import PageContainer from "@/shared/components/PageContainer"
import { useOrganizerBreadcrumb } from '@/features/organizer/hooks/useOrganizerBreadcrumb'

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
