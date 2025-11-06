import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { BREADCRUMBS } from "@/config/breadcrumbs"
import PageContainer from "@/shared/components/PageContainer"
import TableFluent from "@/shared/components/TableFluent"
import { Trophy, Pencil, Trash2 } from "lucide-react"
import { StatusBadge } from "@/shared/utils/StatusBadge"
import { formatDateTime } from "@/shared/utils/formatDateTime"
import {
  fetchContests,
  addContest,
  updateContest,
  deleteContest,
} from "@/features/contest/store/contestThunks"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import Actions from "@/shared/components/Actions"
import { useModal } from "@/shared/hooks/useModal"
import { toast } from "react-hot-toast"

const OrganizerContests = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { openModal } = useModal()

  const { contests, pagination, loading, error } = useAppSelector(
    (s) => s.contests
  )

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  useEffect(() => {
    dispatch(fetchContests({ pageNumber: page, pageSize }))
  }, [dispatch, page, pageSize])

  const handleContestModal = (mode, contest = {}) => {
    openModal("contest", {
      mode,
      initialData: contest,
      onSubmit: async (data) => {
        if (mode === "create") {
          await dispatch(addContest(data)).unwrap()
        } else {
          await dispatch(
            updateContest({ id: contest.contestId, data })
          ).unwrap()
        }
        dispatch(fetchContests({ pageNumber: page, pageSize }))
      },
    })
  }

  const handleDeleteContest = (contest) => {
    openModal("confirmDelete", {
      type: "contest",
      item: contest,
      onConfirm: async (onClose) => {
        try {
          await dispatch(deleteContest(contest.contestId)).unwrap()
          toast.success("Contest deleted successfully!")
          onClose()
          dispatch(fetchContests({ pageNumber: page, pageSize }))
        } catch (err) {
          console.error(err)
          toast.error("Failed to delete contest.")
        }
      },
    })
  }

  const contestColumns = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => row.original.name || "—",
    },
    {
      accessorKey: "year",
      header: "Year",
      cell: ({ row }) => row.original.year || "—",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge status={row.original.status || "draft"} />
      ),
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => formatDateTime(row.original.createdAt),
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
              onClick: () => handleContestModal("edit", row.original),
            },
            {
              label: "Delete",
              icon: Trash2,
              className: "text-red-500",
              onClick: () => handleDeleteContest(row.original),
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
            onClick={() => handleContestModal("create")}
          >
            New Contest
          </button>
        </div>

        <TableFluent
          data={contests}
          columns={contestColumns}
          title="Contests"
          pagination={pagination}
          onPageChange={setPage}
          loading={loading}
          error={error}
          onRowClick={(contest) =>
            navigate(`/organizer/contests/${contest.contestId}`)
          }
        />
      </div>
    </PageContainer>
  )
}

export default OrganizerContests
