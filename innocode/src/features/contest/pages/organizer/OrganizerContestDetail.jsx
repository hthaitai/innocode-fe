import React from "react"
import { useParams, useNavigate } from "react-router-dom"
import PageContainer from "@/shared/components/PageContainer"
import TableFluent from "@/shared/components/TableFluent"
import { Calendar, Pencil, Trash } from "lucide-react"
import { formatForInput } from "@/shared/utils/formatForInput"
import { formatDateTime } from "@/shared/utils/formatDateTime"
import useContests from "../../../contest/hooks/useContests"
import useRounds from "@/features/round/hooks/useRounds"
import ContestRelatedSettings from "../../components/organizer/ContestRelatedSettings"
import InfoSection from "../../../../shared/components/InfoSection"
import DetailTable from "../../../../shared/components/DetailTable"
import Actions from "../../../../shared/components/Actions"
import { useModal } from "../../../../shared/hooks/useModal"
import { useOrganizerBreadcrumb } from "../../../../shared/hooks/useOrganizerBreadcrumb"

const OrganizerContestDetail = () => {
  const { contestId: contestIdParam } = useParams()
  const contestId = Number(contestIdParam)

  const navigate = useNavigate()
  const { openModal } = useModal()
  const { breadcrumbData } = useOrganizerBreadcrumb("ORGANIZER_CONTEST_DETAIL")

  // ----- Hooks -----
  const {
    contests,
    loading: contestsLoading,
    error: contestsError,
    updateContest,
    deleteContest,
  } = useContests()

  const {
    rounds,
    loading: roundsLoading,
    error: roundsError,
    addRound,
    updateRound,
    deleteRound,
  } = useRounds(contestId)

  const contest = contests.find((c) => c.contest_id === contestId)

  // ----- Contest Handlers -----
  const handleContestModal = (mode) => {
    openModal("contest", {
      mode,
      initialData: contest,
      onSubmit: async (data) => {
        if (mode === "edit")
          return await updateContest(contest.contest_id, data)
      },
    })
  }

  const handleDeleteContest = () => {
    openModal("confirmDelete", {
      type: "contest",
      item: contest,
      onConfirm: async (onClose) => {
        await deleteContest(contest.contest_id)
        onClose()
        navigate("/organizer/contests")
      },
    })
  }

  // ----- Round Handlers -----
  const handleRoundModal = (mode, round = {}) => {
    const roundData = {
      ...round,
      start: formatForInput(round.start),
      end: formatForInput(round.end),
    }

    openModal("round", {
      mode,
      initialData: roundData,
      onSubmit: async (data) => {
        if (mode === "create") return await addRound(data)
        if (mode === "edit") return await updateRound(round.round_id, data)
      },
    })
  }

  const handleDeleteRound = (round) => {
    openModal("confirmDelete", {
      type: "round",
      item: round,
      onConfirm: async (onClose) => {
        await deleteRound(round.round_id)
        onClose()
      },
    })
  }

  // ----- Table Columns -----
  const roundColumns = [
    { accessorKey: "name", header: "Name" },
    {
      accessorKey: "start",
      header: "Start",
      cell: ({ row }) => formatDateTime(row.original.start),
    },
    {
      accessorKey: "end",
      header: "End",
      cell: ({ row }) => formatDateTime(row.original.end),
    },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <Actions
          row={row.original}
          items={[
            {
              label: "Edit",
              icon: Pencil,
              onClick: () => handleRoundModal("edit", row.original),
            },
            {
              label: "Delete",
              icon: Trash,
              className: "text-red-500",
              onClick: () => handleDeleteRound(row.original),
            },
          ]}
        />
      ),
    },
  ]

  // ----- Render -----
  return (
    <PageContainer
      breadcrumb={breadcrumbData.items}
      breadcrumbPaths={breadcrumbData.paths}
      bg={false}
      loading={contestsLoading}
      error={contestsError}
    >
      {!contest ? (
        <div className="flex items-center justify-center h-[200px] text-gray-500">
          No contest found
        </div>
      ) : (
        <div className="space-y-5">
          <InfoSection
            title="Contest Information"
            onEdit={() => handleContestModal("edit")}
          >
            <DetailTable
              data={[
                { label: "Name", value: contest.name },
                { label: "Year", value: contest.year },
                { label: "Description", value: contest.description },
                { label: "Status", value: contest.status },
                { label: "Created at", value: contest.created_at },
              ]}
            />
          </InfoSection>

          {/* Rounds */}
          <div>
            <div className="text-sm font-semibold pt-3 pb-2">Rounds</div>
            <div className="space-y-1">
              <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
                <div className="flex gap-5 items-center">
                  <Calendar size={20} />
                  <div>
                    <p className="text-[14px] leading-[20px]">
                      Round Management
                    </p>
                    <p className="text-[12px] leading-[16px] text-[#7A7574]">
                      Create and manage rounds
                    </p>
                  </div>
                </div>
                <button
                  className="button-orange"
                  onClick={() => handleRoundModal("create")}
                >
                  New Round
                </button>
              </div>

              {roundsLoading ? (
                <div className="p-4 text-gray-500">Loading rounds...</div>
              ) : roundsError ? (
                <div className="p-4 text-red-500">{roundsError}</div>
              ) : (
                <TableFluent
                  data={rounds.map((r) => ({ ...r, id: r.round_id }))}
                  columns={roundColumns}
                  title="Rounds"
                  onRowClick={(round) =>
                    navigate(
                      `/organizer/contests/${contest.contest_id}/rounds/${round.round_id}`
                    )
                  }
                />
              )}
            </div>
          </div>

          {/* Related settings */}
          <ContestRelatedSettings contestId={contest.contest_id} />

          {/* More actions */}
          <div>
            <div className="text-sm font-semibold pt-3 pb-2">More actions</div>
            <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
              <div className="flex gap-5 items-center">
                <Trash size={20} />
                <div>
                  <p className="text-[14px] leading-[20px]">Delete contest</p>
                </div>
              </div>
              <button className="button-white" onClick={handleDeleteContest}>
                Delete Contest
              </button>
            </div>
          </div>
        </div>
      )}
    </PageContainer>
  )
}

export default OrganizerContestDetail
