import React from "react"
import InfoSection from "@/shared/components/InfoSection"
import DetailTable from "@/shared/components/DetailTable"
import { formatDateTime } from "@/shared/utils/dateTime"
import StatusBadge from "@/shared/components/StatusBadge"

const AppealInfo = ({ appeal }) => {
  const safe = (val) =>
    val === null || val === undefined || val === "" ? "—" : val

  const data = [
    // Appeal specifics
    { label: "Student name", value: safe(appeal.ownerName) },
    { label: "Reason", value: safe(appeal.reason) },
    { spacer: true },

    // Decision info
    { label: "Mentor name", value: safe(appeal.mentorName) },
    { label: "Mentor reason", value: safe(appeal.decisionReason) },
    { spacer: true },

    // Identifiers / Context
    { label: "Status", value: <StatusBadge status={appeal.state} /> },
    { label: "Team name", value: safe(appeal.teamName) },
    { label: "Contest name", value: safe(appeal.contestName) },
    { label: "Round name", value: safe(appeal.roundName) },
    { label: "Problem type", value: safe(appeal.targetType) },
    { spacer: true },

    // Miscellaneous
    { label: "Created at", value: safe(formatDateTime(appeal.createdAt)) },
    {
      label: "Evidences",
      value: appeal.evidences?.length
        ? `${appeal.evidences.length} file${
            appeal.evidences.length > 1 ? "s" : ""
          }`
        : "—",
    },
  ]

  return (
    <InfoSection title="Appeal Information">
      <DetailTable data={data} labelWidth="117px" />
    </InfoSection>
  )
}

export default AppealInfo
