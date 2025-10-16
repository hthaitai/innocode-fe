import React from "react"
import { useParams } from "react-router-dom"
import PageContainer from "../../components/PageContainer"
import {
  createBreadcrumbWithPaths,
  BREADCRUMBS,
} from "../../config/breadcrumbs"
import { contestsDataOrganizer } from "../../data/contestsDataOrganizer"

const OrganizerContestDetail = () => {
  const { contestId } = useParams()
  const contest = contestsDataOrganizer.find((c) => c.contest_id === parseInt(contestId))

  const breadcrumbData = contest
    ? createBreadcrumbWithPaths("ORGANIZER_CONTEST_DETAIL", contest.name)
    : { items: BREADCRUMBS.NOT_FOUND, paths: ["/"] }

  console.log("Breadcrumb data:", breadcrumbData)
  return (
    <PageContainer
      breadcrumb={breadcrumbData.items}
      breadcrumbPaths={breadcrumbData.paths}
      bg={false}
    >
      <div className="page-container">
        <div className="min-h-[400px] bg-white rounded-lg border border-gray-200 shadow-sm flex items-center justify-center text-gray-400">
          Organizer Contest Detail — Content goes here
        </div>
      </div>
    </PageContainer>
  )
}

export default OrganizerContestDetail
