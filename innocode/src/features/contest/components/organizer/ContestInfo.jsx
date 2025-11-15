import React, { useCallback } from "react"
import InfoSection from "@/shared/components/InfoSection"
import DetailTable from "@/shared/components/DetailTable"
import { formatDateTime } from "@/shared/utils/dateTime"
import StatusBadge from "../../../../shared/components/StatusBadge"
import { useAppDispatch } from "@/store/hooks"
import { useModal } from "@/shared/hooks/useModal"
import { fetchContestById } from "../../store/contestThunks"

const ContestInfo = ({ contest }) => {
  const dispatch = useAppDispatch()
  const { openModal } = useModal()

  const safe = (val) =>
    val === null || val === undefined || val === "" ? "—" : val

  // Move edit logic here
  const handleEdit = useCallback(() => {
    if (!contest) return

    openModal("contest", {
      initialData: contest,
      onUpdated: () => {
        dispatch(fetchContestById(contest.contestId))
      },
    })
  }, [contest, openModal, dispatch])

  return (
    <InfoSection title="Contest Information" onEdit={handleEdit}>
      <DetailTable
        data={[
          { label: "Name", value: safe(contest.name) },
          { label: "Status", value: <StatusBadge status={contest.status} /> },
          { label: "Year", value: safe(contest.year) },
          { spacer: true },
          { label: "Start Date", value: safe(formatDateTime(contest.start)) },
          { label: "End Date", value: safe(formatDateTime(contest.end)) },
          {
            label: "Registration Start",
            value: contest.registrationStart
              ? safe(formatDateTime(contest.registrationStart))
              : "Not set",
          },
          {
            label: "Registration End",
            value: contest.registrationEnd
              ? safe(formatDateTime(contest.registrationEnd))
              : "Not set",
          },
          { spacer: true },
          { label: "Max Team Members", value: safe(contest.teamMembersMax) },
          { label: "Max Teams", value: safe(contest.teamLimitMax) },
          { label: "Rewards", value: safe(contest.rewardsText) },
          { spacer: true },
          { label: "Description", value: safe(contest.description) },
          { label: "Image URL", value: safe(contest.imgUrl) },
          {
            label: "Created At",
            value: safe(formatDateTime(contest.createdAt)),
          },
        ]}
      />
    </InfoSection>
  )
}

export default ContestInfo
