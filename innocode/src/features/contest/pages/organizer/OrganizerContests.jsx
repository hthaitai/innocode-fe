import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { BREADCRUMBS } from "@/config/breadcrumbs"
import PageContainer from "@/shared/components/PageContainer"
import TableFluent from "@/shared/components/TableFluent"
import { Trophy, Trash2 } from "lucide-react"
import { StatusBadge } from "@/shared/utils/StatusBadge"
import { formatDateTime } from "@/shared/utils/dateTime"
import { fetchContests } from "@/features/contest/store/contestThunks"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import Actions from "@/shared/components/Actions"
import { useConfirmDelete } from "../../../../shared/hooks/useConfirmDelete"
import { deleteContest } from "../../store/contestThunks"

const OrganizerContests = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { confirmDeleteEntity } = useConfirmDelete()

  const { contests, pagination, loading, error } = useAppSelector(
    (s) => s.contests
  )

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Fetch contests
  useEffect(() => {
    dispatch(fetchContests({ pageNumber: page, pageSize }))
  }, [dispatch, page, pageSize])

  const refetchContests = () => {
    const safePage = Math.min(page, pagination.totalPages || 1)
    dispatch(fetchContests({ pageNumber: safePage, pageSize }))
  }

  const contestColumns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => row.original?.name || "—",
    },
    {
      accessorKey: "year",
      header: "Year",
      cell: ({ row }) => row.original?.year || "—",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge status={row.original?.status || "Draft"} />
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => formatDateTime(row.original?.createdAt),
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
                  entityName: "Contest",
                  item: row.original,
                  deleteAction: deleteContest,
                  idKey: "contestId",
                  onSuccess: refetchContests,
                }),
            },
          ]}
        />
      ),
    },
  ]

  return (
    <PageContainer breadcrumb={BREADCRUMBS.CONTESTS}>
      <div className="space-y-1">
        <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-between items-center min-h-[70px]">
          <div className="flex gap-5 items-center">
            <Trophy size={20} />
            <div>
              <p className="text-[14px] leading-[20px]">Contest Management</p>
              <p className="text-[12px] leading-[16px] text-[#7A7574]">
                Create and manage contests
              </p>
            </div>
          </div>
          <button
            className="button-orange"
            onClick={() => navigate("/organizer/contests/new")}
          >
            Add contest
          </button>
        </div>

        <TableFluent
          data={contests}
          columns={contestColumns}
          loading={loading}
          error={error}
          pagination={pagination}
          onPageChange={setPage}
          onRowClick={(contest) =>
            navigate(`/organizer/contests/${contest?.contestId}`)
          }
        />
      </div>
    </PageContainer>
  )
}

export default OrganizerContests
