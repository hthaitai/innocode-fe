import React from "react"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS } from "@/config/breadcrumbs"
import ContestTable from "../../components/organizer/ContestTable"

const OrganizerContests = () => {
  return (
    <PageContainer breadcrumb={BREADCRUMBS.CONTESTS}>
      <ContestTable />
    </PageContainer>
  )
}

export default OrganizerContests
