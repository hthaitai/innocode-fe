import { Trophy, Medal, Award } from "lucide-react"
import { formatScore } from "@/shared/utils/formatNumber"
import StatusBadge from "@/shared/components/StatusBadge"

export const getContestLeaderboardColumns = (t) => [
  {
    accessorKey: "rank",
    header: t ? t("leaderboard:columns.rank") : "#",
    size: 48,
    cell: ({ row }) => {
      const rank = row.original?.rank
      return (
        <div className="flex justify-center">
          {rank === 1 && <Trophy className="w-4 h-4 text-yellow-500" />}
          {rank === 2 && <Trophy className="w-4 h-4 text-gray-400" />}
          {rank === 3 && <Trophy className="w-4 h-4 text-amber-600" />}
          {rank > 3 && <span>{rank ?? "—"}</span>}
          {!rank && <span>—</span>}
        </div>
      )
    },
    meta: {
      className: "truncate max-w-[48px]",
      headerClassName: "justify-center",
    },
  },
  {
    accessorKey: "teamName",
    header: t ? t("leaderboard:columns.teamName") : "Team name",
    size: 500,
    cell: ({ row }) => row.original?.teamName || "—",
    meta: { className: "truncate max-w-[500px]" },
  },
  {
    accessorKey: "score",
    header: t ? t("leaderboard:columns.teamScore") : "Team score",
    size: 180,
    cell: ({ row }) =>
      `${formatScore(row.original?.score)} ${
        t ? t("leaderboard:points") : "points"
      }`,
    meta: { className: "truncate max-w-[180px]" },
  },
  {
    accessorKey: "members",
    header: t ? t("leaderboard:columns.members") : "Members",
    size: 180,
    cell: ({ row }) => {
      const count = row.original?.members?.length || 0
      const suffix =
        count === 1
          ? t
            ? t("leaderboard:member")
            : "Member"
          : t
            ? t("leaderboard:members")
            : "Members"
      return `${count} ${suffix}`
    },
    meta: { className: "truncate max-w-[180px]" },
  },
  {
    accessorKey: "status",
    header: t ? t("leaderboard:columns.status") : "Status",
    size: 150,
    cell: ({ row }) => {
      const status = row.original?.status
      if (!status) return "—"
      return (
        <StatusBadge
          status={status}
          translate="team"
        />
      )
    },
    meta: { className: "truncate max-w-[150px]" },
  },
]
