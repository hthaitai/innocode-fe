import React, { useEffect, useMemo } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Calendar, Trash2 } from "lucide-react"
import PageContainer from "@/shared/components/PageContainer"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { useConfirmDelete } from "@/shared/hooks/useConfirmDelete"
import { fetchRounds, deleteRound } from "@/features/round/store/roundThunk"
import { fetchContests } from "@/features/contest/store/contestThunks"
import { formatDateTime } from "@/shared/utils/dateTime"
import { BREADCRUMBS, BREADCRUMB_PATHS } from "@/config/breadcrumbs"
import Actions from "@/shared/components/Actions"
import TableFluent from "@/shared/components/TableFluent"

const OrganizerRounds = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { confirmDeleteEntity } = useConfirmDelete()

  const { contestId } = useParams()
  const { contests } = useAppSelector((s) => s.contests)
  const { rounds, loading, error } = useAppSelector((state) => state.rounds)

  // --- Fetch contest if missing ---
  const contest = contests.find(
    (c) => String(c.contestId) === String(contestId)
  )
  useEffect(() => {
    if (!contest && contestId) {
      dispatch(fetchContests({ pageNumber: 1, pageSize: 50 }))
    }
  }, [contest, contestId, dispatch])

  // --- Fetch all rounds globally then filter by contest ---
  useEffect(() => {
    dispatch(fetchRounds({ contestId, pageNumber: 1, pageSize: 50 }))
  }, [dispatch, contestId])

  // --- Breadcrumb ---
  const items = BREADCRUMBS.ORGANIZER_ROUNDS(
    contestId,
    contest?.name ?? "Contest"
  )
  const paths = BREADCRUMB_PATHS.ORGANIZER_ROUNDS(contestId)

  const handleDelete = (round) =>
    confirmDeleteEntity({
      entityName: "Round",
      item: round,
      deleteAction: deleteRound,
      idKey: "roundId",
      onSuccess: () =>
        dispatch(fetchRounds({ contestId, pageNumber: 1, pageSize: 50 })),
    })

  const columns = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        cell: (info) => info.getValue() || "Untitled Round",
      },
      {
        header: "Start",
        accessorKey: "start",
        cell: (info) => formatDateTime(info.getValue()),
      },
      {
        header: "End",
        accessorKey: "end",
        cell: (info) => formatDateTime(info.getValue()),
      },
      {
        header: "Type",
        accessorKey: "problemType",
        cell: (info) => info.getValue() || "—",
      },
      {
        header: "",
        id: "actions",
        cell: ({ row }) => (
          <Actions
            row={row.original}
            items={[
              {
                label: "Delete",
                icon: Trash2,
                className: "text-red-500",
                onClick: () => handleDelete(row.original),
              },
            ]}
          />
        ),
      },
    ],
    [contestId, navigate]
  )

  return (
    <PageContainer breadcrumb={items} breadcrumbPaths={paths}>
      <div className="space-y-1">
        {/* Header */}
        <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
          <div className="flex gap-5 items-center">
            <Calendar size={20} />
            <div>
              <p className="text-[14px] leading-[20px]">Round Management</p>
              <p className="text-[12px] leading-[16px] text-[#7A7574]">
                Create and manage rounds for this contest
              </p>
            </div>
          </div>
          <button
            className="button-orange"
            onClick={() =>
              navigate(`/organizer/contests/${contestId}/rounds/new`)
            }
          >
            Add round
          </button>
        </div>

        {/* Rounds table */}
        <TableFluent
          data={rounds}
          columns={columns}
          loading={loading}
          error={error}
          onRowClick={(round) =>
            navigate(`/organizer/contests/${contestId}/rounds/${round.roundId}`)
          }
        />
      </div>
    </PageContainer>
  )
}

export default OrganizerRounds
