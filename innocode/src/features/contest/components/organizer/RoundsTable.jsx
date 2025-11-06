import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, Pencil, Trash2 } from "lucide-react"
import TableFluent from "@/shared/components/TableFluent"
import Actions from "@/shared/components/Actions"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchRounds, deleteRound } from "@/features/round/store/roundThunk"
import { formatDateTime } from "@/shared/utils/dateTime"
import { useConfirmDelete } from "../../../../shared/hooks/useConfirmDelete"

const RoundsTable = ({ contestId }) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { confirmDeleteEntity } = useConfirmDelete()

  const { rounds, pagination, loading, error } = useAppSelector(
    (state) => state.rounds
  )

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Fetch rounds for this contest
  useEffect(() => {
    dispatch(fetchRounds({ contestId, pageNumber: page, pageSize }))
  }, [dispatch, contestId, page, pageSize])

  // Refetch (safe page)
  const refetchRounds = () => {
    const safePage = Math.min(page, pagination.totalPages || 1)
    dispatch(fetchRounds({ contestId, pageNumber: safePage, pageSize }))
  }

  const roundColumns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => row.original?.name || "—",
    },
    {
      accessorKey: "start",
      header: "Start",
      cell: ({ row }) => formatDateTime(row.original?.start),
    },
    {
      accessorKey: "end",
      header: "End",
      cell: ({ row }) => formatDateTime(row.original?.end),
    },
    {
      id: "actions",
      header: "",
      enableSorting: false,
      enableHiding: false,
      cell: ({ row }) => (
        <Actions
          row={row.original}
          items={[
            {
              label: "Delete",
              icon: Trash2,
              className: "text-red-500",
              onClick: () =>
                confirmDeleteEntity({
                  entityName: "Round",
                  item: row.original,
                  deleteAction: deleteRound,
                  idKey: "roundId",
                  onSuccess: refetchRounds,
                }),
            },
          ]}
        />
      ),
    },
  ]

  return (
    <div className="space-y-1">
      {/* Header / Toolbar */}
      <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
        <div className="flex gap-5 items-center">
          <Calendar size={20} />
          <div>
            <p className="text-[14px] leading-[20px]">Round Management</p>
            <p className="text-[12px] leading-[16px] text-[#7A7574]">
              Create and manage rounds
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

      {/* Table */}
      <TableFluent
        data={rounds}
        columns={roundColumns}
        loading={loading}
        error={error}
        pagination={pagination}
        onPageChange={setPage}
        onRowClick={(round) =>
          navigate(`/organizer/contests/${contestId}/rounds/${round.roundId}`)
        }
      />
    </div>
  )
}

export default RoundsTable
