import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageContainer from "@/shared/components/PageContainer";
import { createBreadcrumbWithPaths, BREADCRUMBS } from "@/config/breadcrumbs";
import { Icon } from "@iconify/react";
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
} from "lucide-react";
import useContestDetail from "../hooks/useContestDetail";
import CountdownTimer from "@/shared/components/countdowntimer/CountdownTimer";
import { useAuth } from "@/context/AuthContext";
import useTeams from "@/features/team/hooks/useTeams";
import useCompletedQuizzes from "@/features/quiz/hooks/useCompletedQuizzes";
import { formatDateTime } from "@/shared/utils/dateTime";
import { useGetTeamsByContestIdQuery } from "@/services/leaderboardApi";
import { useGetRoundsByContestIdQuery } from "@/services/roundApi";
import useCompletedAutoTests from "@/features/problem/hooks/useCompletedAutoTests";
import manualProblemApi from "@/api/manualProblemApi";
import { useModal } from "@/shared/hooks/useModal";

const ContestDetail = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();
  const role = user?.role || "student";
  const { openModal } = useModal();

  // Fetch contest data from API
  const { contest: apiContest, loading, error } = useContestDetail(contestId);

  // Fetch rounds separately using RTK Query (only when rounds tab is active or contest is loaded)
  const {
    data: roundsData,
    isLoading: roundsLoading,
    isFetching: roundsFetching,
    error: roundsError,
    refetch: refetchRounds,
  } = useGetRoundsByContestIdQuery(contestId, {
    skip: !contestId,
  });

  // Fetch team data for student
  const { getMyTeam, loading: teamLoading } = useTeams();
  const [myTeam, setMyTeam] = useState(null);

  // Use API data if available
  const contest = apiContest;

  // Get rounds from RTK Query, fallback to contest data
  const rounds = useMemo(() => {
    if (roundsData?.data && Array.isArray(roundsData.data)) {
      return roundsData.data;
    }
    // Fallback to contest rounds if RTK Query hasn't loaded yet
    return contest?.rounds || [];
  }, [roundsData, contest?.rounds]);

  // Check if we have rounds data from RTK Query (not just fallback)
  const hasRoundsFromQuery = roundsData?.data && Array.isArray(roundsData.data);

  // Check if contest is ongoing
  const isOngoing = useMemo(() => {
    if (!contest) return false;
    const now = new Date();
    const startDate = new Date(contest.start);
    const endDate = new Date(contest.end);
    const status = contest.statusLabel || contest.status || "";

    // Check by status
    if (status.toLowerCase() === "ongoing") return true;

    // Check by dates
    return now >= startDate && now < endDate;
  }, [contest]);

  // Fetch leaderboard using RTK Query (only when ongoing or ranks tab is active)
  const shouldFetchLeaderboard =
    contestId && (isOngoing || activeTab === "ranks");
  const {
    data: leaderboardData,
    isLoading: leaderboardLoading,
    error: leaderboardError,
  } = useGetTeamsByContestIdQuery(contestId, {
    skip: !shouldFetchLeaderboard,
  });

  // Debug: Log leaderboard data in ContestDetail
  useEffect(() => {
    if (import.meta.env.VITE_ENV === "development" && shouldFetchLeaderboard) {
      console.log("🔍 [ContestDetail] contestId:", contestId);
      console.log(
        "🔍 [ContestDetail] shouldFetchLeaderboard:",
        shouldFetchLeaderboard
      );
      console.log("🔍 [ContestDetail] leaderboardData:", leaderboardData);
      console.log(
        "🔍 [ContestDetail] leaderboardData type:",
        typeof leaderboardData
      );
      console.log(
        "🔍 [ContestDetail] leaderboardData isArray:",
        Array.isArray(leaderboardData)
      );
      console.log("🔍 [ContestDetail] leaderboardLoading:", leaderboardLoading);
      console.log("🔍 [ContestDetail] leaderboardError:", leaderboardError);
    }
  }, [
    leaderboardData,
    contestId,
    shouldFetchLeaderboard,
    leaderboardLoading,
    leaderboardError,
  ]);

  // Handle data structure - API returns teams array directly or wrapped
  // transformResponse now always returns object with teams array
  const leaderboardEntries = Array.isArray(leaderboardData)
    ? leaderboardData // Fallback for old format
    : leaderboardData?.teams ||
      leaderboardData?.teamIdList ||
      leaderboardData?.entries ||
      [];

  // Debug: Log entries
  useEffect(() => {
    if (import.meta.env.VITE_ENV === "development" && shouldFetchLeaderboard) {
      console.log("🔍 [ContestDetail] leaderboardEntries:", leaderboardEntries);
      console.log(
        "🔍 [ContestDetail] leaderboardEntries length:",
        leaderboardEntries.length
      );
      if (leaderboardEntries.length > 0) {
        console.log("🔍 [ContestDetail] first entry:", leaderboardEntries[0]);
      }
    }
  }, [leaderboardEntries, shouldFetchLeaderboard]);

  // Get contest info from contest data
  const leaderboardContestInfo = {
    contestName: contest?.name || leaderboardData?.contestName || null,
    contestId: contestId,
    totalTeamCount: Array.isArray(leaderboardEntries)
      ? leaderboardEntries.length
      : leaderboardData?.totalTeamCount || 0,
    snapshotAt: leaderboardData?.snapshotAt || null,
  };

  // Find my team's entry in leaderboard
  const myTeamLeaderboardEntry = useMemo(() => {
    if (!isOngoing || !myTeam || !leaderboardEntries.length) return null;

    const myTeamId = myTeam.teamId || myTeam.team_id;
    return leaderboardEntries.find(
      (entry) => entry.teamId === myTeamId || entry.teamId === String(myTeamId)
    );
  }, [isOngoing, myTeam, leaderboardEntries]);

  // Fetch my team when contestId or user changes (for both student and mentor)
  useEffect(() => {
    const fetchMyTeam = async () => {
      if (contestId && user?.id && (role === "student" || role === "mentor")) {
        try {
          const teamData = await getMyTeam(contestId);
          setMyTeam(teamData || null);
        } catch (error) {
          console.error("Error fetching my team:", error);
          setMyTeam(null);
        }
      }
    };

    fetchMyTeam();
  }, [contestId, user?.id, role, getMyTeam]);

  // Check for completed quizzes (only for students)
  const { completedRounds, loading: completedQuizzesLoading } =
    useCompletedQuizzes(role === "student" ? rounds : []);

  // Check completed AutoEvaluation rounds
  const {
    completedRounds: completedAutoTests,
    loading: completedAutoTestsLoading,
  } = useCompletedAutoTests(role === "student" ? rounds : []);

  // Check completed Manual problem rounds using RTK Query
  const manualRounds = useMemo(() => {
    if (role !== "student" || !rounds || rounds.length === 0) return [];
    return rounds.filter(
      (round) => round.problemType === "Manual" && round.roundId
    );
  }, [rounds, role]);

  // Create a stable key from roundIds to prevent infinite loops
  const manualRoundsKey = useMemo(() => {
    if (!manualRounds || manualRounds.length === 0) return "";
    return manualRounds
      .map((r) => r.roundId)
      .sort()
      .join(",");
  }, [manualRounds]);

  // Check each manual round for completion using manualProblemApi
  const [completedManualProblems, setCompletedManualProblems] = useState([]);
  const [completedManualProblemsLoading, setCompletedManualProblemsLoading] =
    useState(false);

  // Track previous key and userId to prevent unnecessary re-fetches
  const previousKeyRef = useRef("");
  const previousUserIdRef = useRef(null);
  // Store rounds in ref to avoid stale closure
  const roundsRef = useRef(rounds);

  // Update roundsRef when rounds change
  useEffect(() => {
    roundsRef.current = rounds;
  }, [rounds]);

  useEffect(() => {
    const currentUserId = user?.id;

    // Skip if key and userId haven't changed
    if (
      manualRoundsKey === previousKeyRef.current &&
      currentUserId === previousUserIdRef.current
    ) {
      return;
    }

    // Update previous values
    previousKeyRef.current = manualRoundsKey;
    previousUserIdRef.current = currentUserId;

    if (manualRounds.length === 0 || !currentUserId) {
      setCompletedManualProblems([]);
      setCompletedManualProblemsLoading(false);
      return;
    }

    const checkCompletedManualProblems = async () => {
      setCompletedManualProblemsLoading(true);
      try {
        // Filter rounds from ref to get latest value
        const manualRoundsFiltered = (roundsRef.current || []).filter(
          (round) => round.problemType === "Manual" && round.roundId
        );

        const checkPromises = manualRoundsFiltered.map(async (round) => {
          try {
            const res = await manualProblemApi.getManualTestResults(
              round.roundId,
              {
                pageNumber: 1,
                pageSize: 1,
                studentIdSearch: currentUserId,
              }
            );
            const results = res.data?.data || res.data || [];
            return results.length > 0 ? round : null;
          } catch (err) {
            if (err?.response?.status === 404) {
              return null;
            }
            console.warn(
              `Error checking manual result for round ${round.roundId}:`,
              err
            );
            return null;
          }
        });

        const results = await Promise.all(checkPromises);
        const completed = results.filter((round) => round !== null);
        setCompletedManualProblems(completed);
      } catch (err) {
        console.error("Error checking completed manual problems:", err);
      } finally {
        setCompletedManualProblemsLoading(false);
      }
    };

    checkCompletedManualProblems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [manualRoundsKey, user?.id]); // Only depend on manualRoundsKey and userId, rounds is used inside effect to avoid stale closure

  const breadcrumbData = contest
    ? createBreadcrumbWithPaths("CONTEST_DETAIL", contest.name || contest.title)
    : { items: BREADCRUMBS.NOT_FOUND, paths: ["/"] };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "upcoming":
        return "text-amber-500 bg-amber-500/10";
      case "ongoing":
        return "text-blue-500 bg-blue-500/10";
      case "completed":
        return "text-green-500 bg-green-500/10";
      default:
        return "text-gray-500 bg-gray-500/10";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatScore = (score) => {
    return (score ?? 0).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  // Determine countdown target and label based on contest status
  const getCountdownTarget = () => {
    if (!contest) return null;

    const now = new Date();
    const startDate = new Date(contest.start);
    const endDate = new Date(contest.end);

    // If contest hasn't started yet, countdown to start
    if (now < startDate) {
      return contest.start;
    }

    // If contest is ongoing, countdown to end
    if (now >= startDate && now < endDate) {
      return contest.end;
    }

    // Contest has ended
    return null;
  };

  const getCountdownLabel = () => {
    if (!contest) return "Time Remaining";

    const now = new Date();
    const startDate = new Date(contest.start);
    const endDate = new Date(contest.end);

    if (now < startDate) {
      return "Time Until Start";
    }

    if (now >= startDate && now < endDate) {
      return "Time Until End";
    }

    return "Contest Ended";
  };

  // Check if registration is closed
  const isRegistrationClosed = () => {
    if (!contest) return false;

    // Check by status
    if (contest.status === "RegistrationClosed") {
      return true;
    }

    // Check by registrationEnd date
    if (contest.registrationEnd) {
      const now = new Date();
      const registrationEnd = new Date(contest.registrationEnd);
      return now > registrationEnd;
    }

    return false;
  };

  const registrationClosed = isRegistrationClosed();

  const tabs = [
    { id: "overview", label: "Overview", icon: "mdi:information-outline" },
    {
      id: "rounds",
      label: "Rounds",
      icon: "mdi:clipboard-play-multiple-outline",
    },
    {
      id: "ranks",
      label: "Ranking",
      icon: "mdi:trophy-outline",
    },
  ];

  // Loading state
  if (loading) {
    return (
      <PageContainer breadcrumb={BREADCRUMBS.CONTESTS} bg={false}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">
              Loading contest details...
            </p>
          </div>
        </div>
      </PageContainer>
    );
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
              Failed to Load Contest
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate("/contests")}
              className="button-orange"
            >
              <Icon icon="mdi:arrow-left" className="inline mr-2" />
              Back to Contests
            </button>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!contest) {
    return (
      <PageContainer
        breadcrumb={breadcrumbData.items}
        breadcrumbPaths={breadcrumbData.paths}
      >
        <div className="flex items-center justify-center h-[400px]">
          <p className="text-[#7A7574] text-lg">Contest not found</p>
        </div>
      </PageContainer>
    );
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
                  Organized by {contest.createdByName}
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
                {(contest.statusLabel || contest.status || "")
                  .charAt(0)
                  .toUpperCase() +
                  (contest.statusLabel || contest.status || "").slice(1)}
              </span>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#E5E5E5]">
              <div className="flex items-center gap-2 text-sm min-w-0">
                <Calendar size={26} className="text-[#7A7574] flex-shrink-0" />
                <div className="min-w-0">
                  <div className="text-[#7A7574] text-xs">Start Date</div>
                  <div className="font-medium text-[#2d3748] break-words">
                    {contest.start
                      ? formatDate(contest.start).split(",")[0]
                      : "TBA"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm min-w-0">
                <TrophyIcon
                  size={26}
                  className="text-[#7A7574] flex-shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-[#7A7574] text-xs">Prize Pool</div>
                  <div
                    className="font-medium text-[#2d3748] break-words line-clamp-2"
                    title={contest.rewardsText || "TBA"}
                  >
                    {contest.rewardsText || "TBA"}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm min-w-0">
                <JoystickIcon
                  size={26}
                  className="text-[#7A7574] flex-shrink-0"
                />
                <div className="min-w-0">
                  <div className="text-[#7A7574] text-xs">Rounds</div>
                  <div className="font-medium text-[#2d3748] break-words">
                    {Array.isArray(contest.rounds) ? contest.rounds.length : 0}{" "}
                    Round
                    {Array.isArray(contest.rounds) &&
                    contest.rounds.length !== 1
                      ? "s"
                      : ""}
                  </div>
                </div>
              </div>
            </div>
          </div>

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
                      About the Contest
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
                      Prizes & Awards
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
                            Refreshing rounds...
                          </p>
                        </div>
                      </div>
                    )}

                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-[#2d3748]">
                      Contest Rounds
                    </h3>
                    <div className="flex items-center gap-2">
                      {(roundsLoading || roundsFetching) && (
                        <span className="text-sm text-[#7A7574] animate-pulse font-medium">
                          {roundsFetching && hasRoundsFromQuery
                            ? "Refreshing..."
                            : "Loading..."}
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
                      <p className="text-[#7A7574]">Failed to load rounds</p>
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
                      <p className="text-[#7A7574]">Loading rounds...</p>
                    </div>
                  ) : rounds && rounds.length > 0 ? (
                    rounds.map((round, index) => {
                      // ✅ Check if round is completed
                      const isRoundCompleted = () => {
                        if (!round.roundId) return false;

                        switch (round.problemType) {
                          case "McqTest":
                            return completedRounds.some(
                              (r) => r.roundId === round.roundId
                            );
                          case "AutoEvaluation":
                            return completedAutoTests.some(
                              (r) => r.roundId === round.roundId
                            );
                          case "Manual":
                            return completedManualProblems.some(
                              (r) => r.roundId === round.roundId
                            );
                          default:
                            return false;
                        }
                      };

                      // ✅ Get result route based on problemType
                      const getResultRoute = () => {
                        switch (round.problemType) {
                          case "McqTest":
                            return `/quiz/${round.roundId}/finish`;
                          case "AutoEvaluation":
                            return `/auto-test-result/${contestId}/${round.roundId}`;
                          case "Manual":
                            return `/manual-problem/${contestId}/${round.roundId}`;
                          default:
                            return null;
                        }
                      };

                      // ✅ Determine route based on problemType
                      const getRoundRoute = () => {
                        switch (round.problemType) {
                          case "McqTest":
                            return `/mcq-test/${contestId}/${round.roundId}`;
                          case "Manual":
                            return `/manual-problem/${contestId}/${round.roundId}`;
                          case "AutoEvaluation":
                            return `/auto-evaluation/${contestId}/${round.roundId}`;
                          default:
                            return null;
                        }
                      };

                      // ✅ Get button label based on problemType and completion status
                      const getButtonLabel = () => {
                        if (isRoundCompleted()) {
                          return "View Result";
                        }
                        switch (round.problemType) {
                          case "McqTest":
                            return "Start Test";
                          case "Manual":
                            return "Start Problem";
                          case "AutoEvaluation":
                            return "Start Challenge";
                          default:
                            return "Start";
                        }
                      };

                      const roundRoute = getRoundRoute();
                      const resultRoute = getResultRoute();
                      const isCompleted = isRoundCompleted();

                      return (
                        <div
                          key={round.roundId || index}
                          className="border border-[#E5E5E5] rounded-[5px] relative p-4 hover:bg-[#f9fafb] transition-colors min-w-0 max-w-full overflow-hidden"
                        >
                          <div className="flex items-center justify-between mb-2 min-w-0">
                            <div className="flex items-center gap-2 min-w-0 flex-1">
                              <div className="w-8 h-8 rounded-full bg-[#ff6b35] text-white flex items-center justify-center text-sm font-bold flex-shrink-0">
                                {index + 1}
                              </div>
                              <h4 className="font-semibold text-[#2d3748] break-words line-clamp-2 min-w-0 flex-1">
                                {round.roundName ||
                                  round.name ||
                                  `Round ${index + 1}`}
                              </h4>
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
                                {round.status}
                              </span>
                              <div className="flex gap-2 absolute bottom-4 right-4">
                            
                                {round.status === "Opened" &&
                                  role === "student" &&
                                  (roundRoute || resultRoute) &&
                                  myTeam &&
                                  !isCompleted && (
                                    <button
                                      onClick={() => {
                                        // If not completed, proceed with normal start flow
                                        if (!roundRoute) return;

                                        // Check if openCode already exists in sessionStorage
                                        const existingOpenCode =
                                          sessionStorage.getItem(
                                            `openCode_${round.roundId}`
                                          );

                                        if (existingOpenCode) {
                                          // If openCode exists, navigate directly
                                          navigate(roundRoute);
                                        } else {
                                          // If no openCode, open modal to enter it
                                          openModal("openCode", {
                                            roundName:
                                              round.roundName ||
                                              round.name ||
                                              `Round ${index + 1}`,
                                            roundId: round.roundId,
                                            onConfirm: (openCode) => {
                                              // Store openCode in sessionStorage for this round
                                              sessionStorage.setItem(
                                                `openCode_${round.roundId}`,
                                                openCode
                                              );
                                              // Navigate to round
                                              navigate(roundRoute);
                                            },
                                          });
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
                          </div>

                          <div className="flex flex-col gap-2 text-sm text-[#7A7574] ml-10">
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
                                  ? "Multiple Choice Questions"
                                  : round.problemType === "Manual"
                                  ? "Manual Problem"
                                  : round.problemType === "AutoEvaluation"
                                  ? "Auto Evaluation"
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
                                  minutes
                                </span>
                              </div>
                            )}

                            {/* Date Range */}
                            {round.start && round.end && (
                              <div className="flex items-center gap-2">
                                <Calendar size={14} className="flex-shrink-0" />
                                <span className="truncate">
                                  {formatDate(round.start)} -{" "}
                                  {formatDate(round.end)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center py-8 text-[#7A7574]">
                      <Icon
                        icon="mdi:calendar-blank"
                        width="48"
                        className="mx-auto mb-2 opacity-50"
                      />
                      <p>No rounds scheduled yet</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "ranks" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-[#2d3748]">
                      Ranking and team standings
                    </h3>
                    {leaderboardContestInfo?.snapshotAt && (
                      <p className="text-sm text-[#7A7574]">
                        Last updated:{" "}
                        {formatDateTime(leaderboardContestInfo.snapshotAt)}
                      </p>
                    )}
                  </div>
                  {leaderboardLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-orange-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">Loading leaderboard...</p>
                      </div>
                    </div>
                  ) : leaderboardError ? (
                    // Check if it's a 404 (no data yet) vs actual error
                    (typeof leaderboardError === "object" &&
                      leaderboardError?.Message?.includes("Not found")) ||
                    (typeof leaderboardError === "string" &&
                      leaderboardError.includes("Not found")) ? (
                      <div className="text-center py-12 text-[#7A7574]">
                        <Icon
                          icon="mdi:trophy-outline"
                          width="48"
                          className="mx-auto mb-2 opacity-50"
                        />
                        <p className="text-lg font-medium mb-1">
                          No rankings available yet
                        </p>
                        <p className="text-sm">
                          {isOngoing
                            ? "Leaderboard will appear once teams start participating"
                            : "This contest has not started yet"}
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
                          Failed to load leaderboard
                        </p>
                        <p className="text-sm text-[#7A7574]">
                          {typeof leaderboardError === "string"
                            ? leaderboardError
                            : leaderboardError?.Message ||
                              leaderboardError?.message ||
                              "An error occurred"}
                        </p>
                      </div>
                    )
                  ) : leaderboardEntries && leaderboardEntries.length > 0 ? (
                    <div className="space-y-6">
                      {/* Top 3 Podium */}
                      {leaderboardEntries.length >= 3 && (
                        <div className="relative">
                          <div className="flex items-end justify-center gap-2 mb-4">
                            {/* Rank 2 - Left */}
                            <div className="flex-1 max-w-[200px] flex flex-col items-center">
                              <div className="w-full bg-white rounded-lg shadow-md p-4 mb-2 border border-[#E5E5E5]">
                                <div className="flex flex-col items-center">
                                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center mb-2">
                                    <Users
                                      size={24}
                                      className="text-gray-600"
                                    />
                                  </div>
                                  <p className="text-sm font-semibold text-[#2d3748] text-center mb-1 truncate w-full">
                                    {leaderboardEntries[1]?.teamName || "—"}
                                  </p>
                                  <p className="text-2xl font-bold text-[#ff6b35]">
                                    {formatScore(leaderboardEntries[1]?.score)}
                                  </p>
                                </div>
                              </div>
                              <div className="w-full bg-yellow-400 rounded-t-lg flex items-center justify-center py-4">
                                <span className="text-white font-bold text-lg">
                                  2
                                </span>
                              </div>
                            </div>

                            {/* Rank 1 - Center (Tallest) */}
                            <div className="flex-1 max-w-[220px] flex flex-col items-center relative">
                              <div className="absolute -top-2 right-2 z-10">
                                <Icon
                                  icon="mdi:star"
                                  className="text-yellow-400"
                                  width={32}
                                />
                              </div>
                              <div className="w-full bg-white rounded-lg shadow-lg p-5 mb-2 border-2 border-yellow-300">
                                <div className="flex flex-col items-center">
                                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center mb-3">
                                    <Trophy
                                      className="text-yellow-700"
                                      size={32}
                                    />
                                  </div>
                                  <p className="text-base font-bold text-[#2d3748] text-center mb-2 truncate w-full">
                                    {leaderboardEntries[0]?.teamName || "—"}
                                  </p>
                                  <p className="text-3xl font-bold text-[#ff6b35]">
                                    {formatScore(leaderboardEntries[0]?.score)}
                                  </p>
                                </div>
                              </div>
                              <div className="w-full bg-yellow-500 rounded-t-lg flex items-center justify-center py-6">
                                <span className="text-white font-bold text-xl">
                                  1
                                </span>
                              </div>
                            </div>

                            {/* Rank 3 - Right */}
                            <div className="flex-1 max-w-[200px] flex flex-col items-center">
                              <div className="w-full bg-white rounded-lg shadow-md p-4 mb-2 border border-[#E5E5E5]">
                                <div className="flex flex-col items-center">
                                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center mb-2">
                                    <Award
                                      className="text-amber-700"
                                      size={24}
                                    />
                                  </div>
                                  <p className="text-sm font-semibold text-[#2d3748] text-center mb-1 truncate w-full">
                                    {leaderboardEntries[2]?.teamName || "—"}
                                  </p>
                                  <p className="text-2xl font-bold text-[#ff6b35]">
                                    {formatScore(leaderboardEntries[2]?.score)}
                                  </p>
                                </div>
                              </div>
                              <div className="w-full bg-amber-400 rounded-t-lg flex items-center justify-center py-3">
                                <span className="text-white font-bold text-lg">
                                  3
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Rest of the ranks list (from rank 4+) */}
                      {leaderboardEntries.length > 3 && (
                        <div className="space-y-3">
                          <h4 className="text-md font-semibold text-[#2d3748] mb-3">
                            Other Rankings
                          </h4>
                          {leaderboardEntries.slice(3).map((entry, index) => {
                            const actualRank = entry.rank || index + 4;
                            return (
                              <div
                                key={entry.teamId || index + 3}
                                className="bg-white rounded-lg border border-[#E5E5E5] p-4 shadow-sm hover:shadow-md transition-shadow"
                              >
                                <div className="flex items-center gap-4">
                                  {/* Rank Circle */}
                                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                    <span className="text-lg font-bold text-[#2d3748]">
                                      {actualRank}
                                    </span>
                                  </div>

                                  {/* Team Icon */}
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-200 to-purple-300 flex items-center justify-center flex-shrink-0">
                                    <Users
                                      size={20}
                                      className="text-purple-700"
                                    />
                                  </div>

                                  {/* Team Name */}
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-[#2d3748] truncate">
                                      {entry.teamName || "—"}
                                    </p>
                                  </div>

                                  {/* Score */}
                                  <div className="text-right flex-shrink-0">
                                    <p className="text-xl font-bold text-[#ff6b35]">
                                      {formatScore(entry.score)} pts
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}

                      {/* Show top 3 as list if less than 3 entries */}
                      {leaderboardEntries.length < 3 && (
                        <div className="space-y-3">
                          {leaderboardEntries.map((entry, index) => {
                            const actualRank = entry.rank || index + 1;
                            const getRankIcon = () => {
                              if (actualRank === 1)
                                return (
                                  <Trophy
                                    className="text-yellow-500"
                                    size={20}
                                  />
                                );
                              if (actualRank === 2)
                                return (
                                  <Medal className="text-gray-400" size={20} />
                                );
                              if (actualRank === 3)
                                return (
                                  <Award className="text-amber-600" size={20} />
                                );
                              return null;
                            };

                            return (
                              <div
                                key={entry.teamId || index}
                                className="bg-white rounded-lg border border-[#E5E5E5] p-4 shadow-sm hover:shadow-md transition-shadow"
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
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <p className="text-xl font-bold text-[#13d45d]">
                                      {formatScore(entry.score)}{" "}
                                      <span className="text-xs text-[#13d45d]">
                                        pts
                                      </span>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            );
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
                        No rankings available yet
                      </p>
                      <p className="text-sm">
                        {isOngoing
                          ? "Leaderboard will appear once teams start participating"
                          : "This contest has not started yet"}
                      </p>
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
                Register Now
              </button>
              <p className="text-xs text-[#7A7574] text-center mt-2">
                Registration closes on{" "}
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
                  Registration Closed
                </p>
              </div>
              <p className="text-xs text-[#7A7574] text-center">
                The registration window has closed. You can no longer create new
                teams for this contest.
              </p>
            </div>
          )}{" "}
          {/* Countdown Timer */}
          <CountdownTimer
            targetDate={getCountdownTarget()}
            label={getCountdownLabel()}
          />
          {/* View Leaderboard Button */}
          <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-5">
            <button
              onClick={() => navigate(`/leaderboard/${contestId}`)}
              className="button-orange w-full flex items-center justify-center gap-2 py-3"
            >
              <Trophy size={18} />
              View Leaderboard
            </button>
            <p className="text-xs text-[#7A7574] text-center mt-2">
              Check current rankings and team standings
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
                      label: "Quiz",
                    })),
                    ...completedAutoTests.map((r) => ({
                      ...r,
                      type: "auto",
                      route: `/auto-test-result/${contestId}/${r.roundId}`,
                      icon: "mdi:code-tags-check",
                      label: "Auto Test",
                    })),
                    ...completedManualProblems.map((r) => ({
                      ...r,
                      type: "manual",
                      route: `/manual-problem/${contestId}/${r.roundId}`,
                      icon: "mdi:file-document-check",
                      label: "Manual",
                    })),
                  ];

                  const totalCount =
                    completedRounds.length +
                    completedAutoTests.length +
                    completedManualProblems.length;

                  if (totalCount === 1) {
                    // Single result - direct button
                    const result = allResults[0];
                    const roundInfo = rounds.find(
                      (r) => r.roundId === result.roundId
                    );
                    const roundName =
                      roundInfo?.roundName ||
                      result.roundName ||
                      `${result.label} Result`;

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
                          See Your Result
                        </button>
                        <p className="text-xs text-[#7A7574] text-center mt-2">
                          View your {result.label.toLowerCase()} results and
                          scores
                        </p>
                      </>
                    );
                  } else {
                    // Multiple results - show list for user to choose
                    return (
                      <>
                        <h3 className="text-sm font-semibold text-gray-800 mb-3">
                          Your Results ({totalCount})
                        </h3>
                        <div className="space-y-2">
                          {allResults.map((result, index) => {
                            const roundInfo = rounds.find(
                              (r) => r.roundId === result.roundId
                            );
                            const roundName =
                              roundInfo?.roundName ||
                              result.roundName ||
                              `${result.label} ${index + 1}`;

                            return (
                              <button
                                key={result.roundId || index}
                                onClick={() =>
                                  navigate(result.route, {
                                    state: { contestId },
                                  })
                                }
                                className="button-orange w-full flex items-center justify-between gap-2 py-2 px-3 text-sm"
                              >
                                <div className="flex items-center gap-2">
                                  <Icon icon={result.icon} width="16" />
                                  <span>{roundName}</span>
                                  <span className="text-xs text-[#7A7574]">
                                    ({result.label})
                                  </span>
                                </div>
                                <Icon icon="mdi:chevron-right" width="16" />
                              </button>
                            );
                          })}
                        </div>
                        <p className="text-xs text-[#7A7574] text-center mt-3">
                          Click on a result to view detailed information
                        </p>
                      </>
                    );
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
                    <span className="min-w-0 break-words">Your Team</span>
                  </h3>
                </div>
                {teamLoading ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#ff6b35] border-t-transparent mx-auto mb-2"></div>
                    <p className="text-sm text-[#7A7574]">Loading team...</p>
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
                                Loading rankings...
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
                                    Rank #{myTeamLeaderboardEntry.rank || "—"}
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-baseline gap-2">
                                <span className="text-xs opacity-90">
                                  Score:
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
                                Members
                              </p>
                              <p className="font-semibold text-[#2d3748] text-sm">
                                {myTeam.members?.length || 0} /{" "}
                                {contest?.teamMembersMax || "∞"}
                              </p>
                            </div>
                            {myTeamLeaderboardEntry && (
                              <div>
                                <p className="text-xs text-[#7A7574] mb-0.5">
                                  Rank
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
                              Team Members
                            </p>
                            <div className="space-y-2">
                              {myTeam.members
                                .slice(0, 3)
                                .map((member, index) => {
                                  const memberName =
                                    member.studentFullname || "Unknown Member";
                                  const memberInitial =
                                    memberName?.charAt(0)?.toUpperCase() || "M";

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
                                  );
                                })}
                              {myTeam.members.length > 3 && (
                                <p className="text-xs text-[#7A7574] text-center pt-1">
                                  +{myTeam.members.length - 3} more member
                                  {myTeam.members.length - 3 > 1 ? "s" : ""}
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
                                navigate(`/mentor-team/${contestId}`);
                              } else {
                                navigate(`/team`);
                              }
                            }}
                            className="button-orange flex-1 text-sm"
                          >
                            Team Details
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
                              Team Members
                            </p>
                            <div className="space-y-2">
                              {myTeam.members
                                .slice(0, 3)
                                .map((member, index) => {
                                  const memberName =
                                    member.studentFullname || "Unknown Member";
                                  const memberInitial =
                                    memberName?.charAt(0)?.toUpperCase() || "M";

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
                                  );
                                })}
                              {myTeam.members.length > 3 && (
                                <p className="text-xs text-[#7A7574] text-center pt-1">
                                  +{myTeam.members.length - 3} more member
                                  {myTeam.members.length - 3 > 1 ? "s" : ""}
                                </p>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="pt-3 border-t border-[#E5E5E5]">
                            <p className="text-xs text-[#7A7574] text-center">
                              No members yet
                            </p>
                          </div>
                        )}

                        {/* View Team Button */}
                        <button
                          onClick={() => {
                            if (role === "mentor") {
                              navigate(`/mentor-team/${contestId}`);
                            } else {
                              navigate(`/team`);
                            }
                          }}
                          className="button-white w-full text-sm mt-3"
                        >
                          View Team Details
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
                        ? "You haven't joined a team yet"
                        : "You haven't created a team yet"}
                    </p>
                    <p className="text-xs text-[#7A7574]">
                      {role === "student"
                        ? "Contact your mentor to get more information"
                        : "Create a team to get started"}
                    </p>
                  </div>
                )}
              </div>
            )}
          {/* Contest Info */}
          <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-5">
            <h3 className="text-sm font-semibold text-[#2d3748] mb-4">
              Contest Information
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#7A7574]">Format:</span>
                <span className="font-medium text-[#2d3748]">Team</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A7574]">Team Size:</span>
                <span className="font-medium text-[#2d3748]">
                  1-{contest.teamMembersMax || contest.maxTeamSize || 3} members
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A7574]">Language:</span>
                <span className="font-medium text-[#2d3748]">Python 3</span>
              </div>
            </div>
          </div>
          {/* Important Notice */}
          <div className="bg-[#fef7e0] border border-[#fbbc05] rounded-[8px] p-5">
            <div className="flex items-start gap-2 mb-2">
              <Icon
                icon="mdi:alert-circle"
                width="20"
                className="text-[#fbbc05] flex-shrink-0 mt-0.5"
              />
              <h3 className="text-sm font-semibold text-[#2d3748]">
                Important Notice
              </h3>
            </div>
            <p className="text-sm text-[#4a5568] leading-relaxed">
              Make sure to register before the deadline. Late registrations will
              not be accepted.
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ContestDetail;
