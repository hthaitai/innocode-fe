import React from "react"
import { useNavigate } from "react-router-dom"
import PageContainer from "../../components/PageContainer"
import TableFluent from "../../components/TableFluent"
import Actions from "../../components/organizer/contests/Actions"
import { BREADCRUMBS } from "../../config/breadcrumbs"
import { Trophy, Pencil, Trash2 } from "lucide-react"
import {
  formatDateTime,
  StatusBadge,
} from "../../components/organizer/utils/TableUtils"
import { useModal } from "../../hooks/organizer/useModal"
import { useContests } from "../../hooks/organizer/useContests"

const OrganizerContests = () => {
  const navigate = useNavigate()
  const { openModal } = useModal()
  const {
    contests,
    validateContest,
    loading,
    error,
    addContest,
    updateContest,
    deleteContest,
  } = useContests()

  // ----- Unified CRUD handlers -----
  const handleContestModal = (mode, contest = {}) => {
    openModal("contest", {
      mode,
      initialData: contest,
      validate: validateContest,
      onSubmit: async (data) => {
        if (mode === "create") return await addContest(data)
        if (mode === "edit")
          return await updateContest(contest.contest_id, data)
      },
    })
  }

  const handleDeleteContest = (contest) => {
    openModal("confirmDelete", {
      type: "contest",
      item: contest,
      onConfirm: async (onClose) => {
        await deleteContest(contest.contest_id)
        onClose() // close the modal after successful deletion
      },
    })
  }

  // ----- Table Columns -----
  const contestColumns = [
    {
      id: "name",
      header: "Name",
      cell: ({ row }) => row.original.name || "—",
    },
    {
      id: "year",
      header: "Year",
      cell: ({ row }) => row.original.year || "—",
    },
    {
      id: "status",
      header: "Status",
      cell: ({ row }) => (
        <StatusBadge status={row.original.status || "draft"} />
      ),
    },
    {
      id: "created_at",
      header: "Created At",
      cell: ({ row }) => formatDateTime(row.original.created_at),
    },
    {
      id: "actions",
      header: "Actions",
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
  if (loading) {
    return (
      <PageContainer breadcrumb={BREADCRUMBS.CONTESTS}>
        <div className="flex items-center justify-center h-[200px] text-gray-500">
          Loading contests...
        </div>
      </PageContainer>
    )
  }

  if (error) {
    return (
      <PageContainer breadcrumb={BREADCRUMBS.CONTESTS}>
        <div className="flex items-center justify-center h-[200px] text-red-500">
          {error}
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer breadcrumb={BREADCRUMBS.CONTESTS}>
      <div className="flex flex-col gap-1">
        {/* Header */}
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
          data={contests.map((c) => ({ ...c, id: c.contest_id }))}
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
