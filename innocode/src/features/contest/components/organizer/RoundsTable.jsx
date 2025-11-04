import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Calendar, Pencil, Trash2 } from "lucide-react"
import TableFluent from "@/shared/components/TableFluent"
import Actions from "@/shared/components/Actions"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import {
  fetchRounds,
  addRound,
  updateRound,
  deleteRound,
} from "@/features/round/store/roundThunk"
import { formatDateTime } from "@/shared/utils/formatDateTime"
import { useCrud } from "@/shared/hooks/useCrud"

const RoundsTable = ({ contestId }) => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

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

  // CRUD setup
  const { openEntityModal, confirmDeleteEntity } = useCrud({
    entityName: "round",
    createAction: (data) => addRound({ contestId, data }),
    updateAction: updateRound,
    deleteAction: deleteRound,
    idKey: "round_id",
    onSuccess: refetchRounds,
  })

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
              label: "Edit",
              icon: Pencil,
              onClick: () => openEntityModal("edit", row.original),
            },
            {
              label: "Delete",
              icon: Trash2,
              className: "text-red-500",
              onClick: () => confirmDeleteEntity(row.original),
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
          onClick={() => openEntityModal("create")}
        >
          New Round
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
          navigate(`/organizer/contests/${contestId}/rounds/${round.round_id}`)
        }
      />
    </div>
  )
}

export default RoundsTable
