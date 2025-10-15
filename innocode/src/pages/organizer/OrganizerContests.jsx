import React from "react"
import PageContainer from "../../components/PageContainer"
import { BREADCRUMBS } from "../../config/breadcrumbs"
import OrganizerContestTable from "../../components/organizer/contests/OrganizerContestTable"
import { contestsDataOrganizer } from "../../data/contestsDataOrganizer"

const OrganizerContests = () => {
  return (
    <PageContainer breadcrumb={BREADCRUMBS.CONTESTS}>
      <div className="flex flex-col gap-1 text-[14px] leading-[20px]">
        <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
            <p>Add contest</p>
            <button className="button-orange">Add a contest</button>
        </div>
        <OrganizerContestTable data={contestsDataOrganizer}/>
      </div>
    </PageContainer>
  )
}

export default OrganizerContests
