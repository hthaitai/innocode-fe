import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageContainer from "@/shared/components/PageContainer";
import { contestsData } from "@/data/contestsData";
import { createBreadcrumbWithPaths, BREADCRUMBS } from "@/config/breadcrumbs";
import { Icon } from "@iconify/react";
import {
  Calendar,
  Users,
  Trophy,
  Clock,
  Play,
  NotebookPen,
  BookCheck,
  Medal,
  Award,
  TrophyIcon,
  JoystickIcon,
} from "lucide-react";
import useContestDetail from "../hooks/useContestDetail";
import CountdownTimer from "@/shared/components/countdowntimer/CountdownTimer";
import { useAuth } from "@/context/AuthContext";
import useTeams from "@/features/team/hooks/useTeams";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchLeaderboardByContest } from "@/features/leaderboard/store/leaderboardThunk";

const ContestDetail = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const { user } = useAuth();
  const role = user?.role || "student";

  // Fetch contest data from API
  const { contest: apiContest, loading, error } = useContestDetail(contestId);

  // Fetch team data for student
  const { getMyTeam, loading: teamLoading } = useTeams();
  const [myTeam, setMyTeam] = useState(null);

  // Redux for leaderboard
  const dispatch = useAppDispatch();
  const { entries: leaderboardEntries, loading: leaderboardLoading } =
    useAppSelector((state) => state.leaderboard);

  // Use API data if available
  const contest = apiContest;

  // Get rounds from contest data
  const rounds = contest?.rounds || [];

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

  // Fetch leaderboard if contest is ongoing
  useEffect(() => {
    if (isOngoing && contestId) {
      dispatch(
        fetchLeaderboardByContest({ contestId, pageNumber: 1, pageSize: 100 })
      );
    }
  }, [isOngoing, contestId, dispatch]);

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

  const breadcrumbData = contest
    ? createBreadcrumbWithPaths("CONTEST_DETAIL", contest.name || contest.title)
    : { items: BREADCRUMBS.NOT_FOUND, paths: ["/"] };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "upcoming":
        return "text-[#fbbc05] bg-[#fef7e0]";
      case "ongoing":
        return "text-[#34a853] bg-[#e6f4ea]";
      case "completed":
        return "text-[#7A7574] bg-[#f3f3f3]";
      default:
        return "text-[#7A7574] bg-[#f3f3f3]";
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
    { id: "rounds", label: "Rounds", icon: "mdi:trophy-outline" },
    {
      id: "rules",
      label: "Rules & Guidelines",
      icon: "mdi:file-document-outline",
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
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold text-[#2d3748]">
                      Contest Rounds
                    </h3>
                    {loading && (
                      <span className="text-sm text-[#7A7574]">Loading...</span>
                    )}
                  </div>

                  {error ? (
                    <div className="text-center py-8">
                      <Icon
                        icon="mdi:alert-circle"
                        width="48"
                        className="mx-auto mb-2 text-red-500 opacity-50"
                      />
                      <p className="text-[#7A7574]">Failed to load rounds</p>
                      <p className="text-sm text-[#7A7574] mt-1">{error}</p>
                    </div>
                  ) : rounds && rounds.length > 0 ? (
                    rounds.map((round, index) => {
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

                      // ✅ Get button label based on problemType
                      const getButtonLabel = () => {
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
                              {round.status === "Opened" &&
                                role === "student" &&
                                roundRoute &&
                                myTeam && (
                                  <button
                                    onClick={() => navigate(roundRoute)}
                                    className="button-orange text-xs px-3 p py-1 flex absolute bottom-4 right-4 items-center gap-1"
                                  >
                                    <Play size={12} />
                                    {getButtonLabel()}
                                  </button>
                                )}
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

              {activeTab === "rules" && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#2d3748] mb-3">
                    Contest Rules & Guidelines
                  </h3>
                  {(contest.rules || []).length > 0 ? (
                    <ul className="space-y-3">
                      {contest.rules.map((rule, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 text-[#4a5568]"
                        >
                          <div className="w-6 h-6 rounded-full bg-[#f9fafb] border border-[#E5E5E5] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-medium text-[#7A7574]">
                              {index + 1}
                            </span>
                          </div>
                          <span className="leading-relaxed">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-8 text-[#7A7574]">
                      <Icon
                        icon="mdi:file-document-outline"
                        width="48"
                        className="mx-auto mb-2 opacity-50"
                      />
                      <p>No rules available yet</p>
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
          {/* Your Team Status - For both student and mentor */}
          {/* Hide if registration closed and no team */}
          {(role === "student" || role === "mentor") &&
            !(registrationClosed && !myTeam) && (
              <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-5">
                <h3 className="text-sm font-semibold text-[#2d3748] mb-4 flex items-center gap-2">
                  <Users size={26} className="text-[#ff6b35] flex-shrink-0" />
                  <span className="min-w-0 break-words">Your Team</span>
                </h3>
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
