import React from "react"
import { useNavigate } from "react-router-dom"
import { BREADCRUMBS } from "@/config/breadcrumbs"
import PageContainer from "@/shared/components/PageContainer"
import TableFluent from "@/shared/components/TableFluent"
import { Trophy, Pencil, Trash2 } from "lucide-react"
import { useModal } from "@/features/organizer/hooks/useModal"
import { StatusBadge } from "@/shared/utils/StatusBadge"
import { formatDateTime } from "@/shared/utils/formatDateTime"
import useContests from "../../../contest/hooks/useContests"
import {
  addContest,
  updateContest,
  deleteContest,
} from "@/store/slices/contestSlice"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import Actions from "../../../../shared/components/Actions"

const OrganizerContests = () => {
  const navigate = useNavigate()
  const { openModal } = useModal()

  const dispatch = useAppDispatch()
  const { contests, loading, error } = useAppSelector((s) => s.contests)

  // ----- CRUD Modals -----
  const handleContestModal = (mode, contest = {}) => {
    openModal("contest", {
      mode,
      initialData: contest,
      onSubmit: async (data) => {
        if (mode === "create") return dispatch(addContest(data))
        if (mode === "edit")
          return dispatch(updateContest({ id: contest.contest_id, data }))
      },
    })
  }

  const handleDeleteContest = (contest) => {
    openModal("confirmDelete", {
      type: "contest",
      item: contest,
      onConfirm: async (onClose) => {
        await dispatch(deleteContest(contest.contest_id))
        onClose()
      },
    })
  }

  // ----- Table Columns -----
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
      cell: ({ row }) => formatDateTime(row.original.created_at),
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

  // ----- Render -----
  return (
    <PageContainer
      breadcrumb={BREADCRUMBS.CONTESTS}
      loading={loading}
      error={error}
    >
      <div className="space-y-1">
        {/* Add Contest Section */}
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

        {/* Table */}
        <TableFluent
          data={contests}
          columns={contestColumns}
          title="Contests"
          onRowClick={(contest) =>
            navigate(`/organizer/contests/${contest.contest_id}`)
          }
        />
      </div>
    </PageContainer>
  )
}

export default OrganizerContests
