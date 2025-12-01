import React from "react"

export const getContestLeaderboardColumns = () => [
  {
    header: "#",
    accessorKey: "rank",
    size: 40,
    cell: (info) => info.getValue(),
    meta: { className: "truncate max-w-[60px]" },
  },
  {
    header: "Team name",
    accessorKey: "teamName",
    size: 200,
    cell: (info) => info.getValue(),
    meta: { className: "truncate max-w-[200px]" },
  },
  {
    header: "Team score",
    accessorKey: "score",
    size: 40,
    cell: (info) => info.getValue(),
    meta: { className: "truncate max-w-[100px]" },
  },
]
