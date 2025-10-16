import {
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  flexRender,
} from "@tanstack/react-table"
import React, { useState } from "react"
import Actions from "./Actions"
import { ChevronUp, ChevronDown } from "lucide-react"
import Modal from "../../Modal"
import ContestForm from "../forms/ContestForm"
import { useNavigate } from "react-router-dom"

const StatusBadge = ({ status }) => {
  const colorMap = {
    draft: "bg-[#7A7574]",
    published: "bg-[#FFB900]",
    finalized: "bg-[#107C10]",
  }
  const colorClass = colorMap[status] || colorMap.draft

  return (
    <span className="flex items-center gap-2">
      <span className={`w-2 h-2 rounded-full ${colorClass}`}></span>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}

const formatDateTime = (dateString) => {
  const date = new Date(dateString)
  const options = {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }
  const parts = new Intl.DateTimeFormat("en-US", options).formatToParts(date)
  const day = parts.find((p) => p.type === "day").value
  const month = parts.find((p) => p.type === "month").value
  const year = parts.find((p) => p.type === "year").value
  const hour = parts.find((p) => p.type === "hour").value
  const minute = parts.find((p) => p.type === "minute").value
  const dayPeriod = parts.find((p) => p.type === "dayPeriod").value

  return `${day}/${month}/${year} ${hour}:${minute} ${dayPeriod}`
}

const OrganizerContestTable = ({ data }) => {
  const [sorting, setSorting] = useState([])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedContest, setSelectedContest] = useState(null)
  const [contestData, setContestData] = useState({})
  const navigate = useNavigate()
  
  // ✅ Handle Edit
  const handleEdit = (contest) => {
    setSelectedContest(contest)
    setContestData(contest)
    setIsEditModalOpen(true)
  }

  const handleDelete = (contest) => {
    console.log("Delete contest:", contest)
    // TODO: add delete logic or confirmation modal
  }

  const closeEditModal = () => {
    setIsEditModalOpen(false)
    setSelectedContest(null)
  }

  const handleUpdate = () => {
    console.log("Updated contest:", contestData)
    // TODO: API call to save updated data here
    closeEditModal()
  }

  const handleRowClick = (contest) => {
    console.log("Row clicked:", contest)
    navigate(`/organizer/contests/${contest.contest_id}`)
  }

  const columns = React.useMemo(
    () => [
      { accessorKey: "name", header: "Name" },
      { accessorKey: "year", header: "Year" },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => <StatusBadge status={row.original.status} />,
      },
      {
        accessorKey: "created_at",
        header: "Created At",
        cell: ({ row }) => formatDateTime(row.original.created_at),
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex justify-end w-full">
            <Actions
              row={row.original}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        ),
      },
    ],
    []
  )

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    state: { sorting },
    onSortingChange: setSorting,
  })

  return (
    <>
      {/* Table */}
      <div className="border border-[#E5E5E5] bg-white rounded-[5px] overflow-x-auto relative">
        <table className="table-auto w-full border-collapse">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`text-[12px] leading-[16px] font-normal text-[#7A7574] border-b border-r border-[#E5E5E5] whitespace-nowrap ${
                      header.column.id === "actions"
                        ? "text-right w-[1%]"
                        : "text-left"
                    }`}
                  >
                    {header.isPlaceholder ? null : (
                      <div
                        className={`flex gap-1 items-center px-5 py-2 justify-between select-none ${
                          header.column.getCanSort()
                            ? "cursor-pointer hover:bg-[#F6F6F6]"
                            : ""
                        }`}
                        onClick={
                          header.column.getCanSort()
                            ? header.column.getToggleSortingHandler()
                            : undefined
                        }
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        <span>
                          {header.column.getIsSorted() === "asc" && (
                            <ChevronUp size={12} className="text-[#7A7574]" />
                          )}
                          {header.column.getIsSorted() === "desc" && (
                            <ChevronDown size={12} className="text-[#7A7574]" />
                          )}
                        </span>
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-[#F9F9F9]"
                onClick={() => handleRowClick(row.original)}
              >
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className={`text-[14px] leading-[20px] px-5 py-2 border-r border-[#E5E5E5] whitespace-nowrap ${
                      cell.column.id === "actions"
                        ? "text-right w-[1%]"
                        : "text-left"
                    }`}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ✅ Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        title={`Edit Contest: ${selectedContest?.name || ""}`}
        size="lg"
        footer={
          <>
            <button className="button-white" onClick={closeEditModal}>
              Cancel
            </button>
            <button className="button-orange" onClick={handleUpdate}>
              Save Changes
            </button>
          </>
        }
      >
        <ContestForm onChange={setContestData} initialData={selectedContest} />
      </Modal>
    </>
  )
}

export default OrganizerContestTable
