import React, { useEffect, useState, useMemo, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import PageContainer from "@/shared/components/PageContainer"
import { createBreadcrumbWithPaths, BREADCRUMBS } from "@/config/breadcrumbs"
import { Icon } from "@iconify/react"
import {
  Calendar,
  Users,
  Trophy,
  Play,
  NotebookPen,
  BookCheck,
  Medal,
  Award,
  TrophyIcon,
  JoystickIcon,
  RefreshCcw,
} from "lucide-react"
import useContestDetail from "../hooks/useContestDetail"
import CountdownTimer from "@/shared/components/countdowntimer/CountdownTimer"
import { useAuth } from "@/context/AuthContext"
import useTeams from "@/features/team/hooks/useTeams"
import useCompletedQuizzes from "@/features/quiz/hooks/useCompletedQuizzes"
import { formatDateTime } from "@/shared/utils/dateTime"
import { formatScore } from "@/shared/utils/formatNumber"
import { useGetTeamsByContestIdQuery } from "@/services/leaderboardApi"
import { useGetRoundsByContestIdQuery } from "@/services/roundApi"
import useCompletedAutoTests from "@/features/problem/hooks/useCompletedAutoTests"
import manualProblemApi from "@/api/manualProblemApi"
import { useModal } from "@/shared/hooks/useModal"
import RoundTimeline from "@/features/round/components/RoundTimeline"
import useRoundTimeline from "@/features/round/hooks/useRoundTimeline"
import ContestTimeline from "../components/ContestTimeline"
import { useGetContestTimelineQuery } from "@/services/contestApi"

// Wrapper component to fetch and display timeline for each round
const RoundTimelineWrapper = ({ roundId }) => {
  const { timeline, loading } = useRoundTimeline(roundId)
  return <RoundTimeline timeline={timeline} loading={loading} />
}

const ContestDetail = () => {
  const { t, i18n } = useTranslation("pages")
  const { contestId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("overview")
  const { user } = useAuth()
  const role = user?.role || "student"
  const { openModal } = useModal()

  // Fetch contest data from API
  const { contest: apiContest, loading, error } = useContestDetail(contestId)

  // Fetch rounds separately using RTK Query (only when rounds tab is active or contest is loaded)
  const {
    data: roundsData,
    isLoading: roundsLoading,
    isFetching: roundsFetching,
    error: roundsError,
    refetch: refetchRounds,
  } = useGetRoundsByContestIdQuery(contestId, {
    skip: !contestId,
  })

  // Fetch team data for student
  const { getMyTeam, loading: teamLoading } = useTeams()
  const [myTeam, setMyTeam] = useState(null)

  // Fetch contest timeline using RTK Query
  const { data: contestTimeline, isLoading: contestTimelineLoading } =
    useGetContestTimelineQuery(contestId, {
      skip: !contestId,
    })

  // Use API data if available
  const contest = apiContest

  // Get rounds from RTK Query, fallback to contest data
  const rounds = useMemo(() => {
    if (roundsData?.data && Array.isArray(roundsData.data)) {
      return roundsData.data
    }
    // Fallback to contest rounds if RTK Query hasn't loaded yet
    return contest?.rounds || []
  }, [roundsData, contest?.rounds])

  // Check if we have rounds data from RTK Query (not just fallback)
  const hasRoundsFromQuery = roundsData?.data && Array.isArray(roundsData.data)

  // Check if contest is ongoing
  const isOngoing = useMemo(() => {
    if (!contest) return false
    const now = new Date()
    const startDate = new Date(contest.start)
    const endDate = new Date(contest.end)
    const status = contest.statusLabel || contest.status || ""

    // Check by status
    if (status.toLowerCase() === "ongoing") return true

    // Check by dates
    return now >= startDate && now < endDate
  }, [contest])

  // Fetch leaderboard using RTK Query (only when ongoing or ranks tab is active)
  const shouldFetchLeaderboard =
    contestId && (isOngoing || activeTab === "ranks")
  const {
    data: leaderboardData,
    isLoading: leaderboardLoading,
    error: leaderboardError,
  } = useGetTeamsByContestIdQuery(contestId, {
    skip: !shouldFetchLeaderboard,
  })

  // Debug: Log leaderboard data in ContestDetail
  useEffect(() => {
    if (import.meta.env.VITE_ENV === "development" && shouldFetchLeaderboard) {
      console.log("🔍 [ContestDetail] contestId:", contestId)
      console.log(
        "🔍 [ContestDetail] shouldFetchLeaderboard:",
        shouldFetchLeaderboard
      )
      console.log("🔍 [ContestDetail] leaderboardData:", leaderboardData)
      console.log(
        "🔍 [ContestDetail] leaderboardData type:",
        typeof leaderboardData
      )
      console.log(
        "🔍 [ContestDetail] leaderboardData isArray:",
        Array.isArray(leaderboardData)
      )
      console.log("🔍 [ContestDetail] leaderboardLoading:", leaderboardLoading)
      console.log("🔍 [ContestDetail] leaderboardError:", leaderboardError)
    }
  }, [
    leaderboardData,
    contestId,
    shouldFetchLeaderboard,
    leaderboardLoading,
    leaderboardError,
  ])

  // Handle data structure - API returns teams array directly or wrapped
  // transformResponse now always returns object with teams array
  const leaderboardEntries = Array.isArray(leaderboardData)
    ? leaderboardData // Fallback for old format
    : leaderboardData?.teams ||
      leaderboardData?.teamIdList ||
      leaderboardData?.entries ||
      []

  // Debug: Log entries
  useEffect(() => {
    if (import.meta.env.VITE_ENV === "development" && shouldFetchLeaderboard) {
      console.log("🔍 [ContestDetail] leaderboardEntries:", leaderboardEntries)
      console.log(
        "🔍 [ContestDetail] leaderboardEntries length:",
        leaderboardEntries.length
      )
      if (leaderboardEntries.length > 0) {
        console.log("🔍 [ContestDetail] first entry:", leaderboardEntries[0])
      }
    }
  }, [leaderboardEntries, shouldFetchLeaderboard])

  // Get contest info from contest data
  const leaderboardContestInfo = {
    contestName: contest?.name || leaderboardData?.contestName || null,
    contestId: contestId,
    totalTeamCount: Array.isArray(leaderboardEntries)
      ? leaderboardEntries.length
      : leaderboardData?.totalTeamCount || 0,
    snapshotAt: leaderboardData?.snapshotAt || null,
  }

  // Find my team's entry in leaderboard
  const myTeamLeaderboardEntry = useMemo(() => {
    if (!isOngoing || !myTeam || !leaderboardEntries.length) return null

    const myTeamId = myTeam.teamId || myTeam.team_id
    return leaderboardEntries.find(
      (entry) => entry.teamId === myTeamId || entry.teamId === String(myTeamId)
    )
  }, [isOngoing, myTeam, leaderboardEntries])

  // Fetch my team when contestId or user changes (for both student and mentor)
  useEffect(() => {
    const fetchMyTeam = async () => {
      if (contestId && user?.id && (role === "student" || role === "mentor")) {
        try {
          const teamData = await getMyTeam(contestId)
          setMyTeam(teamData || null)
        } catch (error) {
          console.error("Error fetching my team:", error)
          setMyTeam(null)
        }
      }
    }

    fetchMyTeam()
  }, [contestId, user?.id, role, getMyTeam])

  // Check for completed quizzes (only for students)
  const { completedRounds, loading: completedQuizzesLoading } =
    useCompletedQuizzes(role === "student" ? rounds : [])

  // Check completed AutoEvaluation rounds
  const {
    completedRounds: completedAutoTests,
    loading: completedAutoTestsLoading,
  } = useCompletedAutoTests(role === "student" ? rounds : [])

  // Check completed Manual problem rounds using RTK Query
  const manualRounds = useMemo(() => {
    if (role !== "student" || !rounds || rounds.length === 0) return []
    return rounds.filter(
      (round) => round.problemType === "Manual" && round.roundId
    )
  }, [rounds, role])

  // Create a stable key from roundIds to prevent infinite loops
  const manualRoundsKey = useMemo(() => {
    if (!manualRounds || manualRounds.length === 0) return ""
    return manualRounds
      .map((r) => r.roundId)
      .sort()
      .join(",")
  }, [manualRounds])

  // Check each manual round for completion using manualProblemApi
  const [completedManualProblems, setCompletedManualProblems] = useState([])
  const [completedManualProblemsLoading, setCompletedManualProblemsLoading] =
    useState(false)

  // Track previous key and userId to prevent unnecessary re-fetches
  const previousKeyRef = useRef("")
  const previousUserIdRef = useRef(null)
  // Store rounds in ref to avoid stale closure
  const roundsRef = useRef(rounds)

  // Update roundsRef when rounds change
  useEffect(() => {
    roundsRef.current = rounds
  }, [rounds])

  useEffect(() => {
    const currentUserId = user?.id

    // Skip if key and userId haven't changed
    if (
      manualRoundsKey === previousKeyRef.current &&
      currentUserId === previousUserIdRef.current
    ) {
      return
    }

    // Update previous values
    previousKeyRef.current = manualRoundsKey
    previousUserIdRef.current = currentUserId

    if (manualRounds.length === 0 || !currentUserId) {
      setCompletedManualProblems([])
      setCompletedManualProblemsLoading(false)
      return
    }

    const checkCompletedManualProblems = async () => {
      setCompletedManualProblemsLoading(true)
      try {
        // Filter rounds from ref to get latest value
        const manualRoundsFiltered = (roundsRef.current || []).filter(
          (round) => round.problemType === "Manual" && round.roundId
        )

        const checkPromises = manualRoundsFiltered.map(async (round) => {
          try {
            const res = await manualProblemApi.getManualTestResults(
              round.roundId,
              {
                pageNumber: 1,
                pageSize: 1,
                studentIdSearch: currentUserId,
              }
            )
            const results = res.data?.data || res.data || []
            return results.length > 0 ? round : null
          } catch (err) {
            if (err?.response?.status === 404) {
              return null
            }
            console.warn(
              `Error checking manual result for round ${round.roundId}:`,
              err
            )
            return null
          }
        })

        const results = await Promise.all(checkPromises)
        const completed = results.filter((round) => round !== null)
        setCompletedManualProblems(completed)
      } catch (err) {
        console.error("Error checking completed manual problems:", err)
      } finally {
        setCompletedManualProblemsLoading(false)
      }
    }

    checkCompletedManualProblems()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manualRoundsKey, user?.id]) // Only depend on manualRoundsKey and userId, rounds is used inside effect to avoid stale closure

  const breadcrumbData = contest
    ? createBreadcrumbWithPaths("CONTEST_DETAIL", contest.name || contest.title)
    : { items: BREADCRUMBS.NOT_FOUND, paths: ["/"] }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "upcoming":
        return "text-amber-500 bg-amber-500/10"
      case "ongoing":
        return "text-blue-500 bg-blue-500/10"
      case "completed":
        return "text-green-500 bg-green-500/10"
      default:
        return "text-gray-500 bg-gray-500/10"
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const isVietnamese = i18n.language === "vi"

    const day = date.getDate()
    const month = date.getMonth()
    const year = date.getFullYear()
    const hours = date.getHours()
    const minutes = date.getMinutes()

    // Month names
    const monthNamesEn = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ]
    const monthNamesVi = [
      "Thg 1",
      "Thg 2",
      "Thg 3",
      "Thg 4",
      "Thg 5",
      "Thg 6",
      "Thg 7",
      "Thg 8",
      "Thg 9",
      "Thg 10",
      "Thg 11",
      "Thg 12",
    ]

    const monthName = isVietnamese ? monthNamesVi[month] : monthNamesEn[month]

    // Format time
    const period =
      hours >= 12 ? (isVietnamese ? "CH" : "PM") : isVietnamese ? "SA" : "AM"
    const displayHours = hours % 12 || 12
    const displayMinutes = minutes.toString().padStart(2, "0")

    // Format: "Thg 1 5, 2026, 10:30 SA" (Vietnamese) or "Jan 5, 2026, 10:30 AM" (English)
    return `${monthName} ${day}, ${year}, ${displayHours}:${displayMinutes} ${period}`
  }

  // Determine countdown target and label based on contest status
  const getCountdownTarget = () => {
    if (!contest) return null

    const now = new Date()
    const startDate = new Date(contest.start)
    const endDate = new Date(contest.end)

    // If contest hasn't started yet, countdown to start
    if (now < startDate) {
      return contest.start
    }

    // If contest is ongoing, countdown to end
    if (now >= startDate && now < endDate) {
      return contest.end
    }

    // Contest has ended
    return null
  }

  const getCountdownLabel = () => {
    if (!contest) return t("contest.timeRemaining")

    const now = new Date()
    const startDate = new Date(contest.start)
    const endDate = new Date(contest.end)

    if (now < startDate) {
      return t("contest.timeUntilStart")
    }

    if (now >= startDate && now < endDate) {
      return t("contest.timeUntilEnd")
    }

    return t("contest.contestEnded")
  }

  // Check if registration is closed
  const isRegistrationClosed = () => {
    if (!contest) return false

    // Check by status
    if (contest.status === "RegistrationClosed") {
      return true
    }

    // Check by registrationEnd date
    if (contest.registrationEnd) {
      const now = new Date()
      const registrationEnd = new Date(contest.registrationEnd)
      return now > registrationEnd
    }

    return false
  }

  const registrationClosed = isRegistrationClosed()

  const tabs = [
    {
      id: "overview",
      label: t("contest.overview"),
      icon: "mdi:information-outline",
    },
    {
      id: "rounds",
      label: t("contest.rounds"),
      icon: "mdi:clipboard-play-multiple-outline",
    },
  ]

  // Loading state
  if (loading) {
    return (
      <PageContainer breadcrumb={BREADCRUMBS.CONTESTS} bg={false}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">
              {t("contest.loadingDetails")}
            </p>
          </div>
        </div>
      </PageContainer>
    )
  }

  // Error state
  if (error) {
    return (
      <PageContainer breadcrumb={BREADCRUMBS.CONTESTS} bg={false}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <Icon
              icon="mdi:alert-circle-outline"
              className="w-20 h-20 text-red-500 mx-auto mb-4"
            />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {t("contest.failedToLoadDetail")}
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate("/contests")}
              className="button-orange"
            >
              <Icon icon="mdi:arrow-left" className="inline mr-2" />
              {t("contest.backToContests")}
            </button>
          </div>
        </div>
      </PageContainer>
    )
  }

  if (!contest) {
    return (
      <PageContainer
        breadcrumb={breadcrumbData.items}
        breadcrumbPaths={breadcrumbData.paths}
      >
        <div className="flex items-center justify-center h-[400px]">
          <p className="text-[#7A7574] text-lg">
            {t("contest.contestNotFound")}
          </p>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbData.items}
      breadcrumbPaths={breadcrumbData.paths}
      bg={false}
    >
      <div className="flex gap-5 max-w-full overflow-hidden">
        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col gap-4 min-w-0 max-w-full">
          {/* Contest Banner */}
          <div
            className="bg-center bg-cover h-[280px] rounded-[8px] overflow-hidden relative"
            style={{
              backgroundImage: `url(${contest.imgUrl})`,
            }}
          >
            {/* Overlay tối + nội dung */}
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-6">
              <div className="text-center text-white w-full max-w-full px-4">
                <h1
                  className="text-4xl font-bold mb-4 break-words overflow-hidden line-clamp-3 max-w-full mx-auto"
                  style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
                >
                  {contest.name || contest.title}
                </h1>
                <p className="text-lg opacity-90 truncate max-w-full mx-auto">
                  {t("contest.organizedBy")} {contest.createdByName}
                </p>
              </div>
            </div>
          </div>

          {/* Contest Header Info */}
          <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6 min-w-0 max-w-full overflow-hidden">
            <div className="flex items-center gap-3 flex-wrap mb-4">
              <span
                className={`px-3 py-1 rounded-[5px] text-sm font-medium ${getStatusColor(
                  contest.statusLabel || contest.status
                )}`}
              >
                {(() => {
                  const rawStatus = contest.statusLabel || contest.status
                  if (!rawStatus) return ""

                  // Normalize status to lowercase for matching
                  const statusLower = rawStatus
                    .toLowerCase()
                    .replace(/\s+/g, "")

                  // Map status to translation key
                  const statusMap = {
                    ongoing: "contest.statusLabels.ongoing",
                    upcoming: "contest.statusLabels.upcoming",
                    completed: "contest.statusLabels.completed",
                    published: "contest.statusLabels.published",
                    registrationopen: "contest.statusLabels.registrationOpen",
                    registrationclosed:
                      "contest.statusLabels.registrationClosed",
                    draft: "contest.statusLabels.draft",
                  }

                  const translationKey = statusMap[statusLower]
                  if (translationKey) {
                    return t(translationKey)
                  }

                  // Fallback: format status to readable label if no translation found
                  return rawStatus.charAt(0).toUpperCase() + rawStatus.slice(1)
                })()}
              </span>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-[200px] pt-6 mt-2 border-t border-[#E5E5E5]">
              <div className="flex items-center gap-3 text-sm min-w-0">
                <Calendar size={26} className="text-[#7A7574] flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-[#7A7574] text-nowrap text-xs whitespace-nowrap">
                    {t("contest.dateRange")}
                  </div>
                  <div className="font-medium text-[#2d3748] text-[11px] leading-relaxed">
                    <div className="whitespace-nowrap">
                      {contest.start ? formatDate(contest.start) : "TBA"}
                    </div>
                    <div className="text-gray-400 text-center my-0.5">
                      {i18n.language === "vi" ? "đến" : "to"}
                    </div>
                    <div className="whitespace-nowrap">
                      {contest.end ? formatDate(contest.end) : "TBA"}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 text-sm min-w-0">
                <NotebookPen
                  size={26}
                  className="text-[#7A7574] flex-shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-[#7A7574] text-nowrap text-xs whitespace-nowrap">
                    {t("contest.dateRegister")}
                  </div>
                  <div className="font-medium text-[#2d3748] text-[11px] leading-relaxed">
                    <div className="whitespace-nowrap">
                      {contest.registrationStart
                        ? formatDate(contest.registrationStart)
                        : "TBA"}
                    </div>
                    <div className="text-gray-400 text-center my-0.5">
                      {i18n.language === "vi" ? "đến" : "to"}
                    </div>
                    <div className="whitespace-nowrap">
                      {contest.registrationEnd
                        ? formatDate(contest.registrationEnd)
                        : "TBA"}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm min-w-0">
                <JoystickIcon
                  size={26}
                  className="text-[#7A7574] flex-shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-[#7A7574] text-xs whitespace-nowrap">
                    {t("contest.rounds")}
                  </div>
                  <div className="font-medium text-[#2d3748] whitespace-nowrap">
                    {(() => {
                      const nonRetakeRounds = Array.isArray(contest.rounds)
                        ? contest.rounds.filter((r) => !r.isRetakeRound)
                        : []
                      const count = nonRetakeRounds.length
                      return (
                        <>
                          {count}{" "}
                          {count === 1
                            ? t("contest.round")
                            : t("contest.roundsPlural")}
                        </>
                      )
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contest Timeline - Separate Box */}
          <ContestTimeline
            timeline={contestTimeline}
            loading={contestTimelineLoading}
          />

          {/* Tabs Navigation */}
          <div className="bg-white border border-[#E5E5E5] rounded-[8px] overflow-hidden min-w-0 max-w-full">
            <div className="flex border-b border-[#E5E5E5]">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 cursor-pointer px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                    activeTab === tab.id
                      ? "bg-[#ff6b35] text-white"
                      : "text-[#7A7574] hover:bg-[#f9fafb]"
                  }`}
                >
                  <Icon icon={tab.icon} width="18" className="flex-shrink-0" />
                  <span className="min-w-0 break-words">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#2d3748] mb-3">
                      {t("contest.aboutContest")}
                    </h3>
                    <p
                      className="text-[#4a5568] text-base leading-relaxed whitespace-pre-wrap break-words max-w-full"
                      style={{
                        wordBreak: "break-word",
                        overflowWrap: "anywhere",
                      }}
                    >
                      {contest.description}
                    </p>
                  </div>

                  {/* Prizes */}
                  <div>
                    <h3 className="text-lg font-semibold text-amber-500 mb-3">
                      {t("contest.prizesAwards")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <p className="text-sm text-[#4a5568] break-words line-clamp-3">
                        {contest.rewardsText}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "rounds" && (
                <div className="space-y-4 relative">
                  {/* Loading overlay when refetching with existing data */}
                  {roundsFetching &&
                    hasRoundsFromQuery &&
                    rounds.length > 0 && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center rounded-[8px]">
                        <div className="flex flex-col items-center gap-3">
                          <div className="animate-spin rounded-full h-10 w-10 border-4 border-gray-200 border-t-orange-500"></div>
                          <p className="text-sm text-[#7A7574] font-medium">
                            {t("contest.refreshingRounds")}
                          </p>
                        </div>
                      </div>
                    )}

                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-[#2d3748]">
                      {t("contest.contestRounds")}
                    </h3>
                    <div className="flex items-center gap-2">
                      {(roundsLoading || roundsFetching) && (
                        <span className="text-sm text-[#7A7574] animate-pulse font-medium">
                          {roundsFetching && hasRoundsFromQuery
                            ? t("contest.refreshing")
                            : t("common:common.loading")}
                        </span>
                      )}
                      <RefreshCcw
                        size={18}
                        className={`cursor-pointer text-[#7A7574] hover:text-orange-500 transition-all duration-300 ${
                          roundsLoading || roundsFetching
                            ? "animate-spin text-orange-500"
                            : "hover:rotate-180"
                        }`}
                        onClick={() => refetchRounds()}
                        style={{
                          transition: "transform 0.3s ease, color 0.2s ease",
                        }}
                      />
                    </div>
                  </div>

                  {roundsError ? (
                    <div className="text-center py-8">
                      <Icon
                        icon="mdi:alert-circle"
                        width="48"
                        className="mx-auto mb-2 text-red-500 opacity-50"
                      />
                      <p className="text-[#7A7574]">
                        {t("contest.failedToLoadRounds")}
                      </p>
                      <p className="text-sm text-[#7A7574] mt-1">
                        {roundsError?.data?.message ||
                          roundsError?.message ||
                          "An error occurred"}
                      </p>
                    </div>
                  ) : (roundsLoading || roundsFetching) &&
                    !hasRoundsFromQuery ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-orange-500 mx-auto mb-4"></div>
                      <p className="text-[#7A7574]">
                        {t("contest.loadingRounds")}
                      </p>
                    </div>
                  ) : rounds && rounds.length > 0 ? (
                    rounds.map((round, index) => {
                      // ✅ Check if round is completed
                      const isRoundCompleted = () => {
                        if (!round.roundId) return false

                        switch (round.problemType) {
                          case "McqTest":
                            return completedRounds.some(
                              (r) => r.roundId === round.roundId
                            )
                          case "AutoEvaluation":
                            return completedAutoTests.some(
                              (r) => r.roundId === round.roundId
                            )
                          case "Manual":
                            return completedManualProblems.some(
                              (r) => r.roundId === round.roundId
                            )
                          default:
                            return false
                        }
                      }

                      // ✅ Get result route based on problemType
                      const getResultRoute = () => {
                        switch (round.problemType) {
                          case "McqTest":
                            return `/quiz/${round.roundId}/finish`
                          case "AutoEvaluation":
                            return `/auto-test-result/${contestId}/${round.roundId}`
                          case "Manual":
                            return `/manual-problem/${contestId}/${round.roundId}`
                          default:
                            return null
                        }
                      }

                      // ✅ Determine route based on problemType
                      const getRoundRoute = () => {
                        switch (round.problemType) {
                          case "McqTest":
                            return `/mcq-test/${contestId}/${round.roundId}`
                          case "Manual":
                            return `/manual-problem/${contestId}/${round.roundId}`
                          case "AutoEvaluation":
                            return `/auto-evaluation/${contestId}/${round.roundId}`
                          default:
                            return null
                        }
                      }

                      // ✅ Get button label based on problemType and completion status
                      const getButtonLabel = () => {
                        if (isRoundCompleted()) {
                          return t("contest.viewResult")
                        }
                        switch (round.problemType) {
                          case "McqTest":
                            return t("contest.startTest")
                          case "Manual":
                            return t("contest.startProblem")
                          case "AutoEvaluation":
                            return t("contest.startChallenge")
                          default:
                            return t("contest.start")
                        }
                      }

                      const roundRoute = getRoundRoute()
                      const resultRoute = getResultRoute()
                      const isCompleted = isRoundCompleted()

                      return (
                        <div
                          key={round.roundId || index}
                          className="border border-[#E5E5E5] rounded-[5px] p-4 hover:bg-[#f9fafb] transition-colors min-w-0 max-w-full overflow-hidden"
                        >
                          <div className="flex items-start justify-between mb-3 min-w-0">
                            <div className="flex items-start gap-3 min-w-0 flex-1">
                              <div className="w-8 h-8 rounded-full bg-[#ff6b35] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                                {index + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-semibold text-[#2d3748] break-words line-clamp-2 min-w-0">
                                  {round.roundName ||
                                    round.name ||
                                    `${t("contest.round")} ${index + 1}`}
                                </h4>
                                {/* Time information directly under title */}
                                {round.start && round.end && (
                                  <div className="flex items-center gap-2 mt-1 text-xs text-[#7A7574]">
                                    <Calendar
                                      size={12}
                                      className="flex-shrink-0"
                                    />
                                    <span className="truncate">
                                      {formatDate(round.start)} -{" "}
                                      {formatDate(round.end)}
                                    </span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-2 flex-shrink-0">
                              <span
                                className={`text-xs px-2 text-center py-1 rounded ${
                                  round.status === "Closed"
                                    ? "bg-[#fde8e8] text-[#d93025]"
                                    : round.status === "Opened"
                                    ? "bg-[#e6f4ea] text-[#34a853]"
                                    : "bg-[#fef7e0] text-[#fbbc05]"
                                }`}
                              >
                                {(() => {
                                  const status = round.status
                                  if (!status) return ""

                                  const statusLower = status.toLowerCase()
                                  const translationKey = `contest.statusLabels.${statusLower}`

                                  // Try to get translation, fallback to original status
                                  const translated = t(translationKey)
                                  return translated !== translationKey
                                    ? translated
                                    : status
                                })()}
                              </span>
                              {round.status === "Opened" &&
                                role === "student" &&
                                (roundRoute || resultRoute) &&
                                myTeam &&
                                !isCompleted && (
                                  <button
                                    onClick={() => {
                                      // If not completed, proceed with normal start flow
                                      if (!roundRoute) return

                                      // Check if openCode already exists in sessionStorage
                                      const existingOpenCode =
                                        sessionStorage.getItem(
                                          `openCode_${round.roundId}`
                                        )

                                      if (existingOpenCode) {
                                        // If openCode exists, navigate directly
                                        navigate(roundRoute)
                                      } else {
                                        // If no openCode, open modal to enter it
                                        openModal("openCode", {
                                          roundName:
                                            round.roundName ||
                                            round.name ||
                                            `${t("contest.round")} ${
                                              index + 1
                                            }`,
                                          roundId: round.roundId,
                                          onConfirm: (openCode) => {
                                            // Store openCode in sessionStorage for this round
                                            sessionStorage.setItem(
                                              `openCode_${round.roundId}`,
                                              openCode
                                            )
                                            // Navigate to round
                                            navigate(roundRoute)
                                          },
                                        })
                                      }
                                    }}
                                    className="button-orange text-xs px-3 py-1 flex items-center gap-1"
                                  >
                                    <Play size={12} />
                                    {getButtonLabel()}
                                  </button>
                                )}
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 text-sm text-[#7A7574] ml-11">
                            {/* ✅ Show MCQ Test info only for McqTest type */}
                            {round.problemType === "McqTest" &&
                              round.mcqTest && (
                                <div className="flex items-center gap-2">
                                  <BookCheck
                                    size={14}
                                    className="flex-shrink-0"
                                  />
                                  <span className="truncate">
                                    {round.mcqTest.name || "MCQ Test"}
                                  </span>
                                </div>
                              )}

                            {/* ✅ Show Problem Type with icon */}
                            <div className="flex items-center gap-2">
                              <NotebookPen
                                size={14}
                                className="flex-shrink-0"
                              />
                              <span className="truncate">
                                {round.problemType === "McqTest"
                                  ? t("contest.multipleChoiceQuestions")
                                  : round.problemType === "Manual"
                                  ? t("contest.manualProblem")
                                  : round.problemType === "AutoEvaluation"
                                  ? t("contest.autoEvaluation")
                                  : round.problemType}
                              </span>
                            </div>

                            {/* Time Limit (if available) */}
                            {round.timeLimitSeconds && (
                              <div className="flex items-center gap-2">
                                <Icon
                                  icon="mdi:timer-outline"
                                  width="14"
                                  className="flex-shrink-0"
                                />
                                <span>
                                  {Math.floor(round.timeLimitSeconds / 60)}{" "}
                                  {t("contest.minutes")}
                                </span>
                              </div>
                            )}

                            {/* Rank Cutoff (if available) */}
                            {round.rankCutoff != null &&
                              round.rankCutoff > 0 && (
                                <div className="flex items-center gap-2">
                                  <Trophy
                                    size={14}
                                    className="flex-shrink-0 text-amber-500"
                                  />
                                  <span>
                                    {t("contest.rankCutoff")}:{" "}
                                    {round.rankCutoff}
                                  </span>
                                </div>
                              )}

                            {/* Round Timeline */}
                            {round.roundId && (
                              <RoundTimelineWrapper roundId={round.roundId} />
                            )}
                          </div>
                        </div>
                      )
                    })
                  ) : (
                    <div className="text-center py-8 text-[#7A7574]">
                      <Icon
                        icon="mdi:calendar-blank"
                        width="48"
                        className="mx-auto mb-2 opacity-50"
                      />
                      <p>{t("contest.noRoundsScheduled")}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="w-[320px] flex flex-col gap-4 flex-shrink-0">
          {/* Registration / Action Button - Only show if mentor doesn't have a team */}
          {role === "mentor" && !registrationClosed && !myTeam && (
            <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-5">
              <button
                onClick={() => navigate(`/mentor-team/${contestId}`)}
                className="button-orange w-full flex items-center justify-center gap-2 py-3"
              >
                <Icon icon="mdi:account-plus" width="18" />
                {t("contest.registerNow")}
              </button>
              <p className="text-xs text-[#7A7574] text-center mt-2">
                {t("contest.registrationClosesOn")}{" "}
                {contest.registrationEnd
                  ? formatDate(contest.registrationEnd).split(",")[0]
                  : "TBA"}
              </p>
            </div>
          )}
          {role === "mentor" && registrationClosed && !myTeam && (
            <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-5">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Icon
                  icon="mdi:lock"
                  width="20"
                  className="text-[#7A7574] flex-shrink-0"
                />
                <p className="text-sm font-semibold text-[#2d3748]">
                  {t("contest.registrationClosedDetail")}
                </p>
              </div>
              <p className="text-xs text-[#7A7574] text-center">
                {t("contest.registrationWindowClosed")}
              </p>
            </div>
          )}{" "}
          {/* Countdown Timer */}
          <CountdownTimer
            targetDate={getCountdownTarget()}
            label={getCountdownLabel()}
          />
          {/* Important Notice */}
          <div className="bg-[#fef7e0] border border-[#fbbc05] rounded-[8px] p-5">
            <div className="flex items-start gap-2 mb-2">
              <Icon
                icon="mdi:alert-circle"
                width="20"
                className="text-[#fbbc05] flex-shrink-0 mt-0.5"
              />
              <h3 className="text-sm font-semibold text-[#2d3748]">
                {t("contest.importantNotice")}
              </h3>
            </div>
            <p className="text-sm text-[#4a5568] leading-relaxed">
              {t("contest.registerBeforeDeadline")}
            </p>
          </div>
          {/* View Leaderboard Button */}
          <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-5">
            <button
              onClick={() => navigate(`/leaderboard/${contestId}`)}
              className="button-orange w-full flex items-center justify-center gap-2 py-3"
            >
              <Trophy size={18} />
              {t("contest.viewLeaderboard")}
            </button>
            <p className="text-xs text-[#7A7574] text-center mt-2">
              {t("contest.checkCurrentRankings")}
            </p>
          </div>
          {/* See My Result Button - Show if student has completed quiz, manual, or auto test */}
          {role === "student" &&
            !completedQuizzesLoading &&
            !completedAutoTestsLoading &&
            !completedManualProblemsLoading &&
            (completedRounds.length > 0 ||
              completedAutoTests.length > 0 ||
              completedManualProblems.length > 0) && (
              <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-5">
                {/* Combine all completed rounds */}
                {(() => {
                  const allResults = [
                    ...completedRounds.map((r) => ({
                      ...r,
                      type: "quiz",
                      route: `/quiz/${r.roundId}/finish`,
                      icon: "mdi:clipboard-check-outline",
                      label: t("contest.quiz"),
                    })),
                    ...completedAutoTests.map((r) => ({
                      ...r,
                      type: "auto",
                      route: `/auto-test-result/${contestId}/${r.roundId}`,
                      icon: "mdi:code-tags-check",
                      label: t("contest.autoTest"),
                    })),
                    ...completedManualProblems.map((r) => ({
                      ...r,
                      type: "manual",
                      route: `/manual-problem/${contestId}/${r.roundId}`,
                      icon: "mdi:file-document-check",
                      label: t("contest.manual"),
                    })),
                  ]

                  const totalCount =
                    completedRounds.length +
                    completedAutoTests.length +
                    completedManualProblems.length

                  if (totalCount === 1) {
                    // Single result - direct button
                    const result = allResults[0]
                    const roundInfo = rounds.find(
                      (r) => r.roundId === result.roundId
                    )
                    const roundName =
                      roundInfo?.roundName ||
                      result.roundName ||
                      `${result.label} ${t("contest.result")}`

                    return (
                      <>
                        <button
                          onClick={() =>
                            navigate(result.route, {
                              state: { contestId },
                            })
                          }
                          className="button-green w-full flex items-center justify-center gap-2 py-3"
                        >
                          <Icon icon={result.icon} width="18" />
                          {t("contest.seeYourResult")}
                        </button>
                        <p className="text-xs text-[#7A7574] text-center mt-2">
                          {t("contest.viewYourResults", {
                            type: result.label.toLowerCase(),
                          })}
                        </p>
                      </>
                    )
                  } else {
                    // Multiple results - show list for user to choose
                    return (
                      <>
                        <h3 className="text-sm font-semibold text-gray-800 mb-3">
                          {t("contest.yourResults")} ({totalCount})
                        </h3>
                        <div className="space-y-2">
                          {allResults.map((result, index) => {
                            const roundInfo = rounds.find(
                              (r) => r.roundId === result.roundId
                            )
                            const roundName =
                              roundInfo?.roundName ||
                              result.roundName ||
                              `${result.label} ${index + 1}`

                            return (
                              <button
                                key={result.roundId || index}
                                onClick={() =>
                                  navigate(result.route, {
                                    state: { contestId },
                                  })
                                }
                                className="button-green w-full flex items-center justify-between gap-2 py-2 px-3 text-sm"
                              >
                                <div className="flex items-center gap-2">
                                  <Icon icon={result.icon} width="16" />
                                  <span>{roundName}</span>
                                  <span className="text-xs">
                                    ({result.label})
                                  </span>
                                </div>
                                <Icon icon="mdi:chevron-right" width="16" />
                              </button>
                            )
                          })}
                        </div>
                        <p className="text-xs text-[#7A7574] text-center mt-3">
                          {t("contest.clickResultToView")}
                        </p>
                      </>
                    )
                  }
                })()}
              </div>
            )}
          {/* Your Team Status - For both student and mentor */}
          {/* Hide if registration closed and no team */}
          {(role === "student" || role === "mentor") &&
            !(registrationClosed && !myTeam) && (
              <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-[#2d3748] flex items-center gap-2">
                    <Users size={26} className="text-[#ff6b35] flex-shrink-0" />
                    <span className="min-w-0 break-words">
                      {t("contest.yourTeam")}
                    </span>
                  </h3>
                </div>

                {teamLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#ff6b35] border-t-transparent mx-auto mb-2"></div>
                    <p className="text-sm text-[#7A7574]">
                      {t("contest.loadingTeam")}
                    </p>
                  </div>
                ) : myTeam ? (
                  <div className="space-y-4">
                    {/* Ongoing Contest: Show Rank & Score */}
                    {isOngoing ? (
                      <>
                        {leaderboardLoading ? (
                          <div className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c5a] rounded-[5px] p-4 text-white">
                            <div className="flex items-center justify-center gap-2">
                              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                              <span className="text-sm">
                                {t("contest.loadingRankings")}
                              </span>
                            </div>
                          </div>
                        ) : myTeamLeaderboardEntry ? (
                          <>
                            {/* Team Performance Header */}
                            <div className="bg-gradient-to-r from-[#ff6b35] to-[#ff8c5a] rounded-[5px] p-4 text-white">
                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  {myTeamLeaderboardEntry.rank === 1 ? (
                                    <Trophy
                                      className="text-yellow-300 flex-shrink-0"
                                      size={20}
                                    />
                                  ) : myTeamLeaderboardEntry.rank === 2 ? (
                                    <Medal
                                      className="text-gray-200 flex-shrink-0"
                                      size={20}
                                    />
                                  ) : myTeamLeaderboardEntry.rank === 3 ? (
                                    <Award
                                      className="text-amber-200 flex-shrink-0"
                                      size={20}
                                    />
                                  ) : null}
                                  <span className="font-bold text-lg min-w-0 break-words">
                                    {t("contest.rank")} #
                                    {myTeamLeaderboardEntry.rank || "—"}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-baseline gap-2">
                                <span className="text-xs opacity-90">
                                  {t("contest.score")}:
                                </span>
                                <span className="text-2xl font-bold">
                                  {(myTeamLeaderboardEntry.score ?? 0).toFixed(
                                    2
                                  )}
                                </span>
                              </div>
                            </div>
                          </>
                        ) : null}
                        {/* Team Name and Stats */}
                        <div className="flex items-center justify-between gap-3 pt-2 border-t border-[#E5E5E5]">
                          <div className="flex-1 min-w-0">
                            <h4
                              className="font-semibold text-[#2d3748] truncate"
                              title={myTeam.name}
                            >
                              {myTeam.name}
                            </h4>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <div>
                              <p className="text-xs text-[#7A7574] mb-0.5">
                                {t("contest.members")}
                              </p>
                              <p className="font-semibold text-[#2d3748] text-sm">
                                {myTeam.members?.length || 0} /{" "}
                                {contest?.teamMembersMax || "∞"}
                              </p>
                            </div>
                            {myTeamLeaderboardEntry && (
                              <div>
                                <p className="text-xs text-[#7A7574] mb-0.5">
                                  {t("contest.rank")}
                                </p>
                                <p className="font-semibold text-[#2d3748] text-sm">
                                  #{myTeamLeaderboardEntry.rank || "—"}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Team Members Preview */}
                        {myTeam.members && myTeam.members.length > 0 && (
                          <div className="pt-3 border-t border-[#E5E5E5]">
                            <p className="text-xs text-[#7A7574] mb-2">
                              {t("contest.teamMembers")}
                            </p>
                            <div className="space-y-2">
                              {myTeam.members
                                .slice(0, 3)
                                .map((member, index) => {
                                  const memberName =
                                    member.studentFullname ||
                                    t("contest.unknownMember")
                                  const memberInitial =
                                    memberName?.charAt(0)?.toUpperCase() || "M"

                                  return (
                                    <div
                                      key={
                                        member.studentId ||
                                        member.student_id ||
                                        index
                                      }
                                      className="flex items-center gap-2 p-2 bg-[#f9fafb] rounded-[5px]"
                                    >
                                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#ff8c5a] text-white flex items-center justify-center font-semibold text-xs shadow-sm">
                                        {memberInitial}
                                      </div>
                                      <p className="text-sm font-medium text-[#2d3748] flex-1 truncate">
                                        {memberName}
                                      </p>
                                    </div>
                                  )
                                })}
                              {myTeam.members.length > 3 && (
                                <p className="text-xs text-[#7A7574] text-center pt-1">
                                  {t("contest.moreMembers", {
                                    count: myTeam.members.length - 3,
                                  })}
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-3 border-t border-[#E5E5E5]">
                          <button
                            onClick={() => {
                              if (role === "mentor") {
                                navigate(`/mentor-team/${contestId}`)
                              } else {
                                navigate(`/team`)
                              }
                            }}
                            className="button-orange flex-1 text-sm"
                          >
                            {t("contest.teamDetails")}
                          </button>
                        </div>
                      </>
                    ) : (
                      /* Non-Ongoing Contest: Original Display */
                      <>
                        {/* Team Name and Stats */}
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4
                              className="font-semibold text-[#2d3748] truncate"
                              title={myTeam.name}
                            >
                              {myTeam.name}
                            </h4>
                          </div>
                          <div className="flex-shrink-0">
                            <p className="text-xs text-[#7A7574] mb-0.5">
                              Members
                            </p>
                            <p className="font-semibold text-[#2d3748] text-sm">
                              {myTeam.members?.length || 0} /{" "}
                              {contest?.teamMembersMax || "∞"}
                            </p>
                          </div>
                        </div>

                        {/* Team Members Preview */}
                        {myTeam.members && myTeam.members.length > 0 ? (
                          <div className="pt-3 border-t border-[#E5E5E5]">
                            <p className="text-xs text-[#7A7574] mb-2">
                              {t("contest.teamMembers")}
                            </p>
                            <div className="space-y-2">
                              {myTeam.members
                                .slice(0, 3)
                                .map((member, index) => {
                                  const memberName =
                                    member.studentFullname ||
                                    t("contest.unknownMember")
                                  const memberInitial =
                                    memberName?.charAt(0)?.toUpperCase() || "M"

                                  return (
                                    <div
                                      key={
                                        member.studentId ||
                                        member.student_id ||
                                        index
                                      }
                                      className="flex items-center gap-2 p-2 bg-[#f9fafb] rounded-[5px]"
                                    >
                                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#ff8c5a] text-white flex items-center justify-center font-semibold text-xs shadow-sm flex-shrink-0">
                                        {memberInitial}
                                      </div>
                                      <p className="text-sm font-medium text-[#2d3748] flex-1 truncate">
                                        {memberName}
                                      </p>
                                    </div>
                                  )
                                })}
                              {myTeam.members.length > 3 && (
                                <p className="text-xs text-[#7A7574] text-center pt-1">
                                  {t("contest.moreMembers", {
                                    count: myTeam.members.length - 3,
                                  })}
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="pt-3 border-t border-[#E5E5E5]">
                            <p className="text-xs text-[#7A7574] text-center">
                              {t("contest.noMembersYet")}
                            </p>
                          </div>
                        )}

                        {/* View Team Button */}
                        <button
                          onClick={() => {
                            if (role === "mentor") {
                              navigate(`/mentor-team/${contestId}`)
                            } else {
                              navigate(`/team`)
                            }
                          }}
                          className="button-white w-full text-sm mt-3"
                        >
                          {t("contest.viewTeamDetails")}
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Icon
                      icon="mdi:account-group-outline"
                      width="48"
                      className="text-[#E5E5E5] mx-auto mb-2"
                    />
                    <p className="text-sm text-[#7A7574] mb-3">
                      {role === "student"
                        ? t("contest.haventJoinedTeamStudent")
                        : t("contest.haventCreatedTeam")}
                    </p>
                    <p className="text-xs text-[#7A7574]">
                      {role === "student"
                        ? t("contest.contactMentor")
                        : t("contest.createTeamToStart")}
                    </p>
                  </div>
                )}
              </div>
            )}
          {/* Contest Info */}
          <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-5">
            <h3 className="text-sm font-semibold text-[#2d3748] mb-4">
              {t("contest.contestInformation")}
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#7A7574]">{t("contest.format")}:</span>
                <span className="font-medium text-[#2d3748]">
                  {t("contest.team")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A7574]">{t("contest.teamSize")}:</span>
                <span className="font-medium text-[#2d3748]">
                  1-{contest.teamMembersMax || contest.maxTeamSize || 3}{" "}
                  {t("contest.members")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A7574]">{t("contest.language")}:</span>
                <span className="font-medium text-[#2d3748]">Python 3</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

export default ContestDetail
