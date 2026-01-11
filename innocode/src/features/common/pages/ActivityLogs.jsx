import React from "react"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS } from "@/config/breadcrumbs"
import ActivityLog from "../components/ActivityLog"

const ActivityLogs = () => {
  return (
    <PageContainer breadcrumb={BREADCRUMBS.ACTIVITY_LOGS}>
      <div>
        <ActivityLog />
      </div>
    </PageContainer>
  )
}

export default ActivityLogs
