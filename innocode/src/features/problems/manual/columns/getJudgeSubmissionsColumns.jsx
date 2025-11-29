import React from "react"
import StatusBadge from "@/shared/components/StatusBadge" // adjust path as needed

export const getJudgeSubmissionsColumns = () => [
  {
    header: "Student",
    accessorKey: "submitedByStudentName",
    size: 240,
    cell: ({ row }) => row.original?.submitedByStudentName || "—",
    meta: { className: "truncate max-w-[250px]" },
  },
  {
    header: "Team",
    accessorKey: "teamName",
    size: 200,
    cell: ({ row }) => row.original?.teamName || "—",
    meta: { className: "truncate max-w-[200px]" },
  },
  {
    header: "Round",
    accessorKey: "roundName",
    size: 180,
    cell: ({ row }) => row.original?.roundName || "—",
    meta: { className: "truncate max-w-[180px]" },
  },
  {
    header: "Status",
    accessorKey: "status",
    size: 180,
    cell: ({ row }) => <StatusBadge status={row.original?.status} />,
    meta: { className: "truncate max-w-[180px]" },
  },
  {
    header: "Judge",
    accessorKey: "judgeEmail",
    size: 214,
    cell: ({ row }) => row.original?.judgeEmail || "—",
    meta: { className: "truncate max-w-[214px]" },
  },
]
