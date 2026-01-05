import { formatScore } from "@/shared/utils/formatNumber"

export const getContestLeaderboardColumns = (t) => [
  {
    accessorKey: "rank",
    header: t ? t("leaderboard:columns.rank") : "#",
    size: 60,
    cell: ({ row }) => row.original?.rank ?? "—",
    meta: { className: "truncate max-w-[60px]" },
  },
  {
    accessorKey: "teamName",
    header: t ? t("leaderboard:columns.teamName") : "Team name",
    size: 720,
    cell: ({ row }) => row.original?.teamName || "—",
    meta: { className: "truncate max-w-[720px]" },
  },
  {
    accessorKey: "score",
    header: t ? t("leaderboard:columns.teamScore") : "Team score",
    size: 140,
    cell: ({ row }) => formatScore(row.original?.score),
    meta: { className: "truncate max-w-[140px]" },
  },
]
