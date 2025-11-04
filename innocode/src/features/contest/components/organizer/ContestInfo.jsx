import React from "react"
import InfoSection from "@/shared/components/InfoSection"
import DetailTable from "@/shared/components/DetailTable"
import { formatDateTime } from "@/shared/utils/formatDateTime"
import { useNavigate } from "react-router-dom"

const ContestInfo = ({ contest }) => {
  const navigate = useNavigate()

  const handleEdit = () => {
    navigate(`/organizer/contests/${contest.contestId}/edit`)
  }

  return (
    <InfoSection title="Contest Information" onEdit={handleEdit}>
      <DetailTable
        data={[
          { label: "Status", value: contest.status },
          { label: "Name", value: contest.name },
          { label: "Year", value: contest.year },
          { label: "Description", value: contest.description },
          { label: "Image URL", value: contest.imgUrl },
          { label: "Start Date", value: formatDateTime(contest.start) },
          { label: "End Date", value: formatDateTime(contest.end) },
          { label: "Created At", value: formatDateTime(contest.createdAt) },
        ]}
      />
    </InfoSection>
  )
}

export default ContestInfo
