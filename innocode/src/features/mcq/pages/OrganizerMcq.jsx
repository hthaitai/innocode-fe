import React from "react"
import { useParams } from "react-router-dom"

import PageContainer from "@/shared/components/PageContainer"
import { useAppSelector } from "@/store/hooks"

import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import { useOrganizerRoundDetail } from "../../round/hooks/useOrganizerRoundDetail"

import McqTable from "../components/organizer/McqTable"

const OrganizerMcq = () => {
  const { contestId, roundId } = useParams()
  const { contests } = useAppSelector((s) => s.contests)
  const { round } = useOrganizerRoundDetail(contestId, roundId)

  const contest = contests.find(
    (c) => String(c.contestId) === String(contestId)
  )

  const items = BREADCRUMBS.ORGANIZER_MCQ(
    contest?.name ?? "Contest",
    round?.name ?? "Round"
  )

  const paths = BREADCRUMB_PATHS.ORGANIZER_MCQ(contestId, roundId)

  return (
    <PageContainer breadcrumb={items} breadcrumbPaths={paths}>
      <McqTable />
    </PageContainer>
  )
}

export default OrganizerMcq
