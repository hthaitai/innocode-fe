import React from "react"
import PageContainer from "@/shared/components/PageContainer"
import { useOrganizerBreadcrumb } from '@/features/organizer/hooks/useOrganizerBreadcrumb'

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
