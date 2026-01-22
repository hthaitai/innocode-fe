import React, { useEffect, useState, useMemo, useCallback, useRef } from "react"
import { useParams } from "react-router-dom"
import { useTranslation } from "react-i18next"
import PageContainer from "@/shared/components/PageContainer"
import {
  Trophy,
  Medal,
  Award,
  Users,
  ChevronDown,
  ChevronUp,
  Wifi,
  WifiOff,
  MedalIcon,
} from "lucide-react"
import { formatDateTime } from "@/shared/utils/dateTime"
import { formatScore } from "@/shared/utils/formatNumber"
import { BREADCRUMBS, createBreadcrumbWithPaths } from "@/config/breadcrumbs"
import { useGetTeamsByContestIdQuery } from "@/services/leaderboardApi"
import { useGetContestByIdQuery } from "@/services/contestApi"
import useContests from "../../../contest/hooks/useContests"
import { Icon } from "@iconify/react"
import { motion, AnimatePresence } from "framer-motion"
import { useLiveLeaderboard } from "../../hooks/useLiveLeaderboard"

const Leaderboard = () => {
  const { t } = useTranslation("pages")
  const { contestId: urlContestId } = useParams()

  const { contests, loading: contestsLoading } = useContests()

  const [expandedTeamId, setExpandedTeamId] = useState(null)

  // Toggle team expansion
  const toggleTeamExpansion = (teamId) => {
    setExpandedTeamId(expandedTeamId === teamId ? null : teamId)
  }

  // Get available contests (ongoing or completed)
  const availableContests = useMemo(() => {
    if (!contests || !Array.isArray(contests)) return []

    return contests.filter((c) => {
      // Filter out Draft contests
      if (c.status === "Draft") return false

      const status = c.status?.toLowerCase() || ""
      const now = new Date()

      // Check if ongoing
      const isOngoing =
        status === "ongoing" ||
        status === "registrationopen" ||
        status === "registrationclosed" ||
        (c.start && c.end && now >= new Date(c.start) && now < new Date(c.end))

      // Check if completed
      const isCompleted =
        status === "completed" || (c.end && now > new Date(c.end))

      // Include if ongoing or completed
      return isOngoing || isCompleted
    })
  }, [contests])

  // Use contestId from URL or first available contest
  const [selectedContestId, setSelectedContestId] = useState(
    urlContestId || null,
  )

  useEffect(() => {
    if (!selectedContestId && availableContests.length > 0) {
      setSelectedContestId(availableContests[0].contestId)
    }
  }, [availableContests, selectedContestId])

  // Fetch contest detail immediately if we have urlContestId using RTK Query
  const { data: contestDetail, isLoading: contestDetailLoading } =
    useGetContestByIdQuery(urlContestId, {
      skip: !urlContestId, // Skip if no contestId in URL
    })

  // Get selected contest details from availableContests
  const selectedContest = availableContests.find(
    (c) => c.contestId === selectedContestId,
  )

  // Fetch leaderboard data using RTK Query
  const {
    data: leaderboardData,
    isLoading: loading,
    error,
    refetch,
  } = useGetTeamsByContestIdQuery(selectedContestId, {
    skip: !selectedContestId,
  })

  // Connect to live leaderboard hub - pass refetch function to trigger updates
  const { isConnected, connectionError } = useLiveLeaderboard(
    selectedContestId || null, // Always pass a value, never undefined
    refetch, // Pass refetch function to trigger when updates are received
    !!selectedContestId,
  )

  // Refetch when contest changes
  useEffect(() => {
    if (selectedContestId) {
      // Refetch leaderboard data when contest changes
      refetch()
    }
  }, [selectedContestId, refetch])

  // Debug: Log leaderboard data
  useEffect(() => {
    if (import.meta.env.VITE_ENV === "development") {
      console.log(
        "🔍 [Leaderboard Component] selectedContestId:",
        selectedContestId,
      )
      console.log(
        "🔍 [Leaderboard Component] leaderboardData:",
        leaderboardData,
      )
      console.log(
        "🔍 [Leaderboard Component] leaderboardData type:",
        typeof leaderboardData,
      )
      console.log(
        "🔍 [Leaderboard Component] leaderboardData isArray:",
        Array.isArray(leaderboardData),
      )
      console.log("🔍 [Leaderboard Component] loading:", loading)
      console.log("🔍 [Leaderboard Component] error:", error)
    }
  }, [leaderboardData, selectedContestId, loading, error])

  // Handle data structure - Use RTK Query data (will be updated via refetch)
  const entries = Array.isArray(leaderboardData)
    ? leaderboardData // Fallback for old format
    : leaderboardData?.teams ||
      leaderboardData?.teamIdList ||
      leaderboardData?.entries ||
      []

  // Debug: Log entries
  useEffect(() => {
    if (import.meta.env.VITE_ENV === "development") {
      console.log("🔍 [Leaderboard Component] entries:", entries)
      console.log("🔍 [Leaderboard Component] entries length:", entries.length)
      if (entries.length > 0) {
        console.log("🔍 [Leaderboard Component] first entry:", entries[0])
        console.log(
          "🔍 [Leaderboard Component] first entry keys:",
          Object.keys(entries[0] || {}),
        )
      }
    }
  }, [entries])

  // Get contest info from selected contest or from data
  const contestInfo = {
    contestName: selectedContest?.name || leaderboardData?.contestName || null,
    contestId: selectedContestId,
    totalTeamCount: Array.isArray(entries)
      ? entries.length
      : leaderboardData?.totalTeamCount || 0,
    snapshotAt: leaderboardData?.snapshotAt || null,
  }

  // Dynamic breadcrumb based on selected contest
  const breadcrumbData = useMemo(() => {
    // Use urlContestId if available, fallback to selectedContestId
    const contestIdForBreadcrumb = urlContestId || selectedContestId

    if (contestIdForBreadcrumb) {
      // Try to get contest name from multiple sources (prioritize contestDetail for immediate display)
      const contestName =
        contestDetail?.name || // From useContestDetail (immediate when URL has contestId)
        selectedContest?.name || // From availableContests
        leaderboardData?.contestName || // From leaderboard data
        contestInfo?.contestName || // From contest info
        "Contest"

      const paths = [
        "/contests",
        `/contest-detail/${contestIdForBreadcrumb}`,
        `/leaderboard/${contestIdForBreadcrumb}`,
      ]
      const items = ["Contests", contestName, "Leaderboard"]
      return { items, paths }
    }
    return { items: BREADCRUMBS.LEADERBOARD, paths: ["/leaderboard"] }
  }, [
    urlContestId,
    selectedContestId,
    selectedContest,
    leaderboardData,
    contestInfo,
    contestDetail,
  ])

  // Format round type for display
  const formatRoundType = (roundType) => {
    switch (roundType) {
      case "McqTest":
        return t("leaderboard.mcqTest")
      case "Manual":
        return t("leaderboard.manualProblem")
      case "AutoEvaluation":
        return t("leaderboard.autoEvaluation")
      default:
        return roundType || "—"
    }
  }

  // Get status color class based on status
  const getStatusColorClass = (status) => {
    if (!status) return "text-gray-400"
    const s = status.toLowerCase().replace(/\s+/g, "")

    switch (s) {
      case "pending":
      case "plagiarismsuspected":
      case "incoming":
      case "upcoming":
      case "paused":
        return "text-yellow-500"
      case "delayed":
        return "text-orange-600"
      case "plagiarismconfirmed":
      case "cancelled":
        return "text-red-500"
      case "finished":
      case "completed":
      case "finalized":
        return "text-green-500"
      default:
        return "text-gray-400"
    }
  }

  // Render team members detail
  const renderTeamMembers = (entry) => {
    const members = entry.members || []

    if (members.length === 0) {
      return (
        <div className="px-4 py-3">
          <p className="text-sm text-gray-500">
            {t("leaderboard.onlyMemberCanSee")}
          </p>
        </div>
      )
    }

    return (
      <div className="px-4 py-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Users size={16} />
          {entry.teamName}
        </h4>
        <div className="space-y-4">
          {members.map((member, idx) => (
            <div
              key={member.memberId || idx}
              className="bg-white rounded-lg border border-gray-200 p-4"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#ff8c5a] text-white flex items-center justify-center font-semibold text-sm">
                    {member.memberName?.charAt(0)?.toUpperCase() || "M"}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {member.memberName || t("leaderboard.unknownMember")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">
                    {t("leaderboard.totalScore")}
                  </p>
                  <p className="text-lg font-bold text-blue-600">
                    {formatScore(member.totalScore) || "0"}
                  </p>
                </div>
              </div>

              {/* Round Scores */}
              {member.roundScores && member.roundScores.length > 0 ? (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs font-medium text-gray-600 mb-2">
                    {t("leaderboard.roundScores")}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {member.roundScores.map((round, roundIdx) => (
                      <div
                        key={round.roundId || roundIdx}
                        className="bg-gray-50 rounded px-3 py-2 border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-medium text-gray-700 ">
                            {round.roundName || t("leaderboard.round")}{" "}
                            {round.status && (
                              <span
                                className={`text-xs ml-4 ${getStatusColorClass(
                                  round.status,
                                )}`}
                              >
                                {(() => {
                                  if (!round.status) return ""
                                  const statusLower = round.status
                                    .toLowerCase()
                                    .replace(/\s+/g, "")
                                  const translationKey = `contest.statusLabels.${statusLower}`
                                  const translated = t(translationKey)
                                  return translated !== translationKey
                                    ? translated
                                    : round.status
                                })()}
                              </span>
                            )}
                          </p>
                          <span className="text-xs font-bold text-nowrap text-blue-600 ml-2">
                            {formatScore(round.score)} pts
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-1">
                          <Icon
                            icon={
                              round.roundType === "McqTest"
                                ? "mdi:checkbox-multiple-marked-circle"
                                : round.roundType === "Manual"
                                  ? "mdi:file-document-edit"
                                  : "mdi:code-tags"
                            }
                            className="text-gray-400"
                            width={12}
                          />
                          <p className="text-xs text-gray-500">
                            {formatRoundType(round.roundType)}
                          </p>
                          {round.completedAt && (
                            <span className="text-xs text-gray-400 ml-1">
                              • {formatDateTime(round.completedAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    {t("leaderboard.noRoundScores")}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (contestsLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbData?.items || BREADCRUMBS.LEADERBOARD}
        breadcrumbPaths={breadcrumbData?.paths || ["/leaderboard"]}
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">
              {t("leaderboard.loading")}
            </p>
          </div>
        </div>
      </PageContainer>
    )
  }

  if (!availableContests || availableContests.length === 0) {
    return (
      <PageContainer
        breadcrumb={breadcrumbData?.items || BREADCRUMBS.LEADERBOARD}
        breadcrumbPaths={breadcrumbData?.paths || ["/leaderboard"]}
      >
        <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 py-8 text-center">
          <Trophy className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t("leaderboard.noContestsAvailable")}
          </h3>
          <p className="text-gray-600">
            {t("leaderboard.noContestsAvailableDesc")}
          </p>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbData.items}
      breadcrumbPaths={breadcrumbData.paths}
      loading={loading}
      error={null}
    >
      <div className="space-y-4">
        {/* Header with Contest Selector */}
        <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 py-4">
          <div className="flex gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Icon
                  className="text-orange-500"
                  icon="mdi:podium"
                  width={28}
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {contestInfo.contestName ||
                      t("leaderboard.contestLeaderboard")}
                  </h2>
                  {/* Live indicator */}
                  {selectedContestId && (
                    <div className="flex items-center gap-1.5">
                      {isConnected ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs font-medium">
                            {t("leaderboard.live")}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-gray-400">
                          <WifiOff size={14} />
                          <span className="text-xs">
                            {t("leaderboard.offline")}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {isConnected
                    ? t("leaderboard.liveUpdatesEnabled")
                    : t("leaderboard.viewCurrentStandings")}
                  {!isConnected && contestInfo.snapshotAt && (
                    <span>
                      {" "}
                      • {t("leaderboard.lastUpdated")}{" "}
                      {formatDateTime(contestInfo.snapshotAt)}
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">
                {t("leaderboard.loadingLeaderboard")}
              </p>
            </div>
          </div>
        ) : error ? (
          // Check if it's a 404 (no data yet) vs actual error
          (typeof error === "object" &&
            (error?.Message?.includes("Not found") ||
              error?.message?.includes("Not found") ||
              error?.status === 404 ||
              error?.statusCode === 404)) ||
          (typeof error === "string" && error.includes("Not found")) ||
          (typeof error === "object" && error?.status === "FETCH_ERROR") ? (
            <div className="text-center py-12 text-[#7A7574]">
              <Icon
                icon="mdi:trophy-outline"
                width="48"
                className="mx-auto mb-2 opacity-50"
              />
              <p className="text-lg font-medium mb-1">
                {t("leaderboard.noLeaderboardYet")}
              </p>
              <p className="text-sm">
                {t("leaderboard.leaderboardWillAppear")}
              </p>
            </div>
          ) : (
            <div className="text-center py-12">
              <Icon
                icon="mdi:alert-circle-outline"
                width="48"
                className="mx-auto mb-2 text-red-500 opacity-50"
              />
              <p className="text-lg font-medium text-red-600 mb-1">
                {t("leaderboard.failedToLoadLeaderboard")}
              </p>
              <p className="text-sm text-[#7A7574]">
                {(() => {
                  if (typeof error === "string") return error
                  if (error?.Message) return error.Message
                  if (error?.message) return error.message
                  if (error?.data?.message) return error.data.message
                  if (error?.data?.Message) return error.data.Message
                  if (error?.status === "FETCH_ERROR") {
                    return t("leaderboard.unableToConnect")
                  }
                  return t("leaderboard.errorLoadingData")
                })()}
              </p>
            </div>
          )
        ) : entries && entries.length > 0 ? (
          <div className="space-y-6">
            {/* Top 3 Podium */}
            {entries.length >= 3 && (
              <div className="relative space-y-4">
                <div className="flex items-end justify-center gap-2">
                  {/* Rank 2 - Left */}
                  <div className="flex-1 max-w-[200px] flex flex-col items-center">
                    <motion.div
                      whileHover={{ scale: 1.03, y: -8 }}
                      className="w-full bg-white rounded-lg shadow-md p-4 mb-2 border border-[#E5E5E5] cursor-pointer hover:shadow-xl transition-shadow duration-300 group"
                      onClick={() => toggleTeamExpansion(entries[1]?.teamId)}
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center mb-2 group-hover:from-gray-100 group-hover:to-gray-200 transition-colors">
                          <MedalIcon size={24} className="text-gray-600" />
                        </div>
                        <p className="text-sm font-semibold text-[#2d3748] text-center mb-1 truncate w-full group-hover:text-[#ff6b35] transition-colors">
                          {entries[1]?.teamName || "—"}
                        </p>
                        <p className="text-2xl font-bold text-[#ff6b35]">
                          {formatScore(entries[1]?.score)}{" "}
                          {t("leaderboard.pts")}
                        </p>
                      </div>
                    </motion.div>
                    <div className="w-full bg-yellow-400 rounded-t-lg flex items-center justify-center py-4 shadow-sm">
                      <span className="text-white font-bold text-lg">2</span>
                    </div>
                  </div>

                  {/* Rank 1 - Center (Tallest) */}
                  <div className="flex-1 max-w-[220px] flex flex-col items-center relative">
                    <div className="absolute -top-4 right-0 z-10">
                      <motion.div
                        animate={{
                          rotate: [0, 10, -10, 0],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          repeat: Infinity,
                          duration: 3,
                          ease: "easeInOut",
                        }}
                      >
                        <Icon
                          icon="mdi:star"
                          className="text-yellow-400 drop-shadow-md"
                          width={40}
                        />
                      </motion.div>
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.05, y: -12 }}
                      className="w-full bg-white rounded-lg shadow-lg p-5 mb-2 border-2 border-yellow-300 cursor-pointer hover:shadow-2xl transition-shadow duration-300 group"
                      onClick={() => toggleTeamExpansion(entries[0]?.teamId)}
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center mb-3 group-hover:from-yellow-200 group-hover:to-yellow-400 transition-colors">
                          <Trophy className="text-yellow-700" size={32} />
                        </div>
                        <p className="text-base font-bold text-[#2d3748] text-center mb-2 truncate w-full group-hover:text-yellow-600 transition-colors">
                          {entries[0]?.teamName || "—"}
                        </p>
                        <p className="text-3xl font-bold text-[#ff6b35]">
                          {formatScore(entries[0]?.score)}{" "}
                          {t("leaderboard.pts")}
                        </p>
                      </div>
                    </motion.div>
                    <div className="w-full bg-yellow-500 rounded-t-lg flex items-center justify-center py-6 shadow-md border-x border-t border-yellow-600">
                      <span className="text-white font-bold text-xl">1</span>
                    </div>
                  </div>

                  {/* Rank 3 - Right */}
                  <div className="flex-1 max-w-[200px] flex flex-col items-center">
                    <motion.div
                      whileHover={{ scale: 1.03, y: -8 }}
                      className="w-full bg-white rounded-lg shadow-md p-4 mb-2 border border-[#E5E5E5] cursor-pointer hover:shadow-xl transition-shadow duration-300 group"
                      onClick={() => toggleTeamExpansion(entries[2]?.teamId)}
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mb-2 group-hover:from-amber-300 group-hover:to-amber-500 transition-colors">
                          <Award className="text-amber-700" size={24} />
                        </div>
                        <p className="text-sm font-semibold text-[#2d3748] text-center mb-1 truncate w-full group-hover:text-amber-600 transition-colors">
                          {entries[2]?.teamName || "—"}
                        </p>
                        <p className="text-2xl font-bold text-[#ff6b35]">
                          {formatScore(entries[2]?.score)}{" "}
                          {t("leaderboard.pts")}
                        </p>
                      </div>
                    </motion.div>
                    <div className="w-full bg-amber-400 rounded-t-lg flex items-center justify-center py-3 shadow-sm">
                      <span className="text-white font-bold text-lg">3</span>
                    </div>
                  </div>
                </div>

                {/* Expanded Members for Top 3 */}
                <AnimatePresence>
                  {expandedTeamId &&
                    [
                      entries[0]?.teamId,
                      entries[1]?.teamId,
                      entries[2]?.teamId,
                    ].includes(expandedTeamId) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0, y: -10 }}
                        animate={{ height: "auto", opacity: 1, y: 0 }}
                        exit={{ height: 0, opacity: 0, y: -10 }}
                        transition={{
                          duration: 0.3,
                          ease: [0.4, 0, 0.2, 1],
                        }}
                        style={{ overflow: "hidden" }}
                        className="mt-4"
                      >
                        {entries.find((e) => e.teamId === expandedTeamId) && (
                          <div className="bg-white rounded-lg border border-[#E5E5E5] p-4">
                            {renderTeamMembers(
                              entries.find((e) => e.teamId === expandedTeamId),
                            )}
                          </div>
                        )}
                      </motion.div>
                    )}
                </AnimatePresence>
              </div>
            )}

            {/* Rest of the ranks list (from rank 4+) */}
            {entries.length > 3 && (
              <div className="space-y-3">
                <h4 className="text-md font-semibold text-[#2d3748] mb-3">
                  {t("leaderboard.otherRankings")}
                </h4>
                {entries.slice(3).map((entry, index) => {
                  const actualRank = entry.rank || index + 4
                  const isExpanded = expandedTeamId === entry.teamId

                  return (
                    <div
                      key={entry.teamId || index + 3}
                      className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div
                        className="p-4 cursor-pointer"
                        onClick={() => toggleTeamExpansion(entry.teamId)}
                      >
                        <div className="flex items-center gap-4">
                          {/* Rank Circle */}
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-lg font-bold text-[#2d3748]">
                              {actualRank}
                            </span>
                          </div>

                          {/* Team Name */}
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-[#2d3748] truncate">
                              {entry.teamName || "—"}
                            </p>
                            {(entry.members?.length || 0) > 0 && (
                              <p className="text-xs text-[#7A7574]">
                                {entry.members?.length || 0}{" "}
                                {(entry.members?.length || 0) !== 1
                                  ? t("leaderboard.members")
                                  : t("leaderboard.member")}
                              </p>
                            )}
                          </div>

                          {/* Score */}
                          <div className="text-right flex-shrink-0">
                            <p className="text-xl font-bold text-[#13d45d]">
                              {formatScore(entry.score)}{" "}
                              <span className="text-xs text-[#13d45d]">
                                {t("leaderboard.pts")}
                              </span>
                            </p>
                          </div>

                          {/* Expand Icon */}
                          <div className="flex-shrink-0">
                            <motion.div
                              animate={{
                                rotate: isExpanded ? 180 : 0,
                                scale: isExpanded ? 1.1 : 1,
                              }}
                              transition={{
                                duration: 0.3,
                                ease: [0.4, 0, 0.2, 1],
                              }}
                            >
                              <ChevronDown
                                className="text-[#7A7574] transition-colors duration-200 hover:text-[#ff6b35] cursor-pointer"
                                size={20}
                              />
                            </motion.div>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Members Section */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              duration: 0.3,
                              ease: [0.4, 0, 0.2, 1],
                            }}
                            style={{ overflow: "hidden" }}
                          >
                            {renderTeamMembers(entry)}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Show top 3 as list if less than 3 entries */}
            {entries.length < 3 && (
              <div className="space-y-3">
                {entries.map((entry, index) => {
                  const actualRank = entry.rank || index + 1
                  const isExpanded = expandedTeamId === entry.teamId
                  const getRankIcon = () => {
                    if (actualRank === 1)
                      return <Trophy className="text-yellow-500" size={20} />
                    if (actualRank === 2)
                      return <Medal className="text-gray-400" size={20} />
                    if (actualRank === 3)
                      return <Award className="text-amber-600" size={20} />
                    return null
                  }

                  return (
                    <div
                      key={entry.teamId || index}
                      className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div
                        className="p-4 cursor-pointer"
                        onClick={() => toggleTeamExpansion(entry.teamId)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                            {getRankIcon() || (
                              <span className="text-lg font-bold text-[#2d3748]">
                                {actualRank}
                              </span>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-[#2d3748] truncate">
                              {entry.teamName || "—"}
                            </p>
                            {(entry.members?.length || 0) > 0 && (
                              <p className="text-xs text-[#7A7574]">
                                {entry.members?.length || 0}{" "}
                                {(entry.members?.length || 0) !== 1
                                  ? t("leaderboard.members")
                                  : t("leaderboard.member")}
                              </p>
                            )}
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xl font-bold text-[#13d45d]">
                              {formatScore(entry.score)}{" "}
                              <span className="text-xs text-[#13d45d]">
                                {t("leaderboard.pts")}
                              </span>
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <motion.div
                              animate={{
                                rotate: isExpanded ? 180 : 0,
                                scale: isExpanded ? 1.1 : 1,
                              }}
                              transition={{
                                duration: 0.3,
                                ease: [0.4, 0, 0.2, 1],
                              }}
                            >
                              <ChevronDown
                                className="text-[#7A7574] transition-colors duration-200 hover:text-[#ff6b35] cursor-pointer"
                                size={20}
                              />
                            </motion.div>
                          </div>
                        </div>
                      </div>

                      {/* Expanded Members Section */}
                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{
                              duration: 0.3,
                              ease: [0.4, 0, 0.2, 1],
                            }}
                            style={{ overflow: "hidden" }}
                          >
                            {renderTeamMembers(entry)}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12 text-[#7A7574]">
            <Icon
              icon="mdi:trophy-outline"
              width="48"
              className="mx-auto mb-2 opacity-50"
            />
            <p className="text-lg font-medium mb-1">
              {t("leaderboard.noRankingsAvailable")}
            </p>
            <p className="text-sm">
              {t("leaderboard.leaderboardWillAppearOnceTeamsStart")}
            </p>
          </div>
        )}
      </div>
    </PageContainer>
  )
}

export default Leaderboard
