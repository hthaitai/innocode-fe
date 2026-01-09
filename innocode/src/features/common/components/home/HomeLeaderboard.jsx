import React from "react"
import { Trophy, Medal, Award, ArrowRight } from "lucide-react"
import { useTranslation } from "react-i18next"
import { AnimatedSection } from "../../../../shared/components/ui/AnimatedSection"

const HomeLeaderboard = ({ contest, teams, loading, onViewFull }) => {
  const { t } = useTranslation("home")

  if (!contest) return null

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />
    return null
  }

  const formatScore = (score) => {
    return (score ?? 0).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",")
  }

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Trophy className="w-7 h-7 text-yellow-500" />
          Leaderboard
        </h2>
        <p className="text-sm text-gray-600 mb-4">
          Top teams in:{" "}
          <span className="font-semibold text-[#ff6b35]">{contest.name}</span>
        </p>
        <button
          onClick={onViewFull}
          className="text-[#ff6b35] hover:text-[#ff8c5a] font-semibold flex items-center gap-2 transition-colors text-sm w-full justify-end"
        >
          View full
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12 bg-white rounded-xl shadow-sm">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-orange-500"></div>
        </div>
      ) : teams && teams.length > 0 ? (
        <AnimatedSection direction="right">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      {t("rank")}
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      {t("team")}
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      {t("score")}
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teams.map((team, index) => {
                    const rank = index + 1
                    return (
                      <tr
                        key={team.teamId || index}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-3 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            {getRankIcon(rank) || (
                              <span className="text-base font-bold text-gray-600 w-5 text-center">
                                {rank}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#ff8c5a] text-white flex items-center justify-center font-semibold text-xs flex-shrink-0">
                              {team.teamName?.charAt(0)?.toUpperCase() || "T"}
                            </div>
                            <span className="font-medium text-gray-900 text-sm truncate">
                              {team.teamName || "—"}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="text-lg font-bold text-[#13d45d]">
                            {formatScore(team.score)}
                          </span>
                          <span className="text-xs text-[#13d45d] ml-1">
                            pts
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </AnimatedSection>
      ) : (
        <AnimatedSection direction="right">
          <div className="bg-white rounded-[5px] border border-[#e5e5e5] p-8 text-center">
            <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-600 text-sm">{t("noLeaderboardData")}</p>
          </div>
        </AnimatedSection>
      )}
    </section>
  )
}

export default HomeLeaderboard
