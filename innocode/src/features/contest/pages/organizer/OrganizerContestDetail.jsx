import React, { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Calendar, Pencil, Trash } from "lucide-react"
import PageContainer from "@/shared/components/PageContainer"
import TableFluent from "@/shared/components/TableFluent"
import InfoSection from "@/shared/components/InfoSection"
import DetailTable from "@/shared/components/DetailTable"
import Actions from "@/shared/components/Actions"
import ContestRelatedSettings from "../../components/organizer/ContestRelatedSettings"
import { useModal } from "@/shared/hooks/useModal"
import { createBreadcrumbWithPaths } from "@/config/breadcrumbs"
import { formatDateTime } from "@/shared/utils/formatDateTime"
import { formatForInput } from "@/shared/utils/formatForInput"

// ✅ Redux imports
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
  fetchContests,
  updateContest,
  deleteContest,
} from "@/features/contest/store/contestThunks"
import {
  fetchRounds,
  addRound,
  updateRound,
  deleteRound,
} from "../../../round/store/roundThunk"

const OrganizerContestDetail = () => {
  const { contestId } = useParams()
  const navigate = useNavigate()
  const { openModal } = useModal()
  const dispatch = useAppDispatch()

  // ----- Redux State -----
  const {
    contests,
    loading: contestsLoading,
    error: contestsError,
  } = useAppSelector((state) => state.contests)
  const {
    rounds,
    loading: roundsLoading,
    error: roundsError,
  } = useAppSelector((state) => state.rounds)

  // ----- Fetch contests and rounds -----
  useEffect(() => {
    if (!contests || contests.length === 0) {
      dispatch(fetchContests())
    }
  }, [dispatch, contests])

  useEffect(() => {
    if (contestId) {
      dispatch(fetchRounds({ contestId }))
    }
  }, [dispatch, contestId])

  const contest = contests.find((c) => c.contestId === contestId)

  const { items, paths } = createBreadcrumbWithPaths(
    "ORGANIZER_CONTEST_DETAIL",
    contest?.name ?? "Unknown Contest",
    contestId
  )

  // ----- Contest Handlers -----
  const handleContestModal = (mode) => {
    openModal("contest", {
      mode,
      initialData: contest,
      onSubmit: async (data) => {
        if (mode === "edit") {
          await dispatch(updateContest({ id: contest.contestId, data }))
          dispatch(fetchContests())
        }
      },
    })
  }

  const handleDeleteContest = () => {
    openModal("confirmDelete", {
      type: "contest",
      item: contest,
      onConfirm: async (onClose) => {
        await dispatch(deleteContest(contest.contestId))
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
        if (mode === "create") await dispatch(addRound({ contestId, data }))
        if (mode === "edit")
          await dispatch(updateRound({ id: round.round_id, data }))
      },
    })
  }

  const handleDeleteRound = (round) => {
    openModal("confirmDelete", {
      type: "round",
      item: round,
      onConfirm: async (onClose) => {
        await dispatch(deleteRound(round.round_id))
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
      breadcrumb={items}
      breadcrumbPaths={paths}
      bg={false}
      loading={contestsLoading || roundsLoading}
      error={contestsError || roundsError}
    >
      {!contest ? (
        <div className="flex items-center justify-center h-[200px] text-gray-500">
          No contest found
        </div>
      ) : (
        <div className="space-y-5">
          {/* Contest Info */}
          <InfoSection
            title="Contest Information"
            onEdit={() => handleContestModal("edit")}
          >
            <DetailTable
              data={[
                { label: "Status", value: contest.status },

                { label: "Name", value: contest.name },
                { label: "Year", value: contest.year },
                { label: "Description", value: contest.description },
                { label: "Image Url", value: contest.imageUrl },
                { label: "Start Date", value: formatDateTime(contest.start) },
                { label: "End Date", value: formatDateTime(contest.end) },
                {
                  label: "Created At",
                  value: formatDateTime(contest.createdAt),
                },
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
                      `/organizer/contests/${contest.contestId}/rounds/${round.round_id}`
                    )
                  }
                />
              )}
            </div>
          </div>

          {/* Related Settings */}
          <ContestRelatedSettings contestId={contest.contestId} />

          {/* Delete Contest */}
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
