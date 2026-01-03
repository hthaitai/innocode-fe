import { formatScore } from "@/shared/utils/formatNumber"

export const getContestLeaderboardColumns = () => [
  {
    accessorKey: "rank",
    header: "#",
    size: 60,
    cell: ({ row }) => row.original?.rank ?? "—",
    meta: { className: "truncate max-w-[60px]" },
  },
  {
    accessorKey: "teamName",
    header: "Team name",
    size: 720,
    cell: ({ row }) => row.original?.teamName || "—",
    meta: { className: "truncate max-w-[720px]" },
  },
  {
    accessorKey: "score",
    header: "Team score",
    size: 140,
    cell: ({ row }) => formatScore(row.original?.score),
    meta: { className: "truncate max-w-[140px]" },
  },
]
