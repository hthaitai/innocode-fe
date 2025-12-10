import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import PageContainer from "@/shared/components/PageContainer";
import TabNavigation from "@/shared/components/TabNavigation";
import DropdownFluent from "@/shared/components/DropdownFluent";
import { BREADCRUMBS, createBreadcrumbWithPaths } from "@/config/breadcrumbs";
import { Icon } from "@iconify/react";
import {
  Users,
  Trophy,
  Award,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Medal,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { formatDateTime } from "@/shared/utils/dateTime";
import StatusBadge from "@/shared/components/StatusBadge";
import { useGetTeamsByContestIdQuery } from "@/services/leaderboardApi";
import { useGetMyAppealsQuery } from "@/services/appealApi";
import useContestDetail from "@/features/contest/hooks/useContestDetail";
import useContests from "@/features/contest/hooks/useContests";
import { useAuth } from "@/context/AuthContext";
import { useModal } from "@/shared/hooks/useModal";
function MentorAppeal() {
  const { contestId: urlContestId } = useParams();
  const { user } = useAuth();
  const { openModal } = useModal();
  const [activeTab, setActiveTab] = useState("student-results");
  const [expandedTeamId, setExpandedTeamId] = useState(null);

  // Fetch contests list
  const { contests, loading: contestsLoading } = useContests();

  // Get available contests (only ongoing - for appeal requests)
  const availableContests = useMemo(() => {
    if (!contests || !Array.isArray(contests)) return [];
    
    return contests.filter((c) => {
      // Filter out Draft contests
      if (c.status === 'Draft') return false;
      
      const status = c.status?.toLowerCase() || '';
      const now = new Date();
      
      // Check if ongoing - only ongoing contests can have appeals
      const isOngoing = 
        status === 'ongoing' || 
        status === 'registrationopen' || 
        status === 'registrationclosed' ||
        (c.start && c.end && now >= new Date(c.start) && now < new Date(c.end));
      
      // Only include ongoing contests
      return isOngoing;
    });
  }, [contests]);

  // Use contestId from URL or first available contest
  const [selectedContestId, setSelectedContestId] = useState(
    urlContestId || null
  );

  useEffect(() => {
    if (!selectedContestId && availableContests.length > 0) {
      setSelectedContestId(availableContests[0].contestId);
    }
  }, [availableContests, selectedContestId]);

  // Get selected contest details
  const selectedContest = availableContests.find(
    (c) => c.contestId === selectedContestId
  );

  // Fetch contest details
  const {
    contest,
    loading: contestLoading,
    error: contestError,
  } = useContestDetail(selectedContestId);

  // Fetch leaderboard data for student results using RTK Query API
  const {
    data: leaderboardData,
    isLoading: leaderboardLoading,
    error: leaderboardError,
    isFetching: leaderboardFetching,
  } = useGetTeamsByContestIdQuery(selectedContestId, {
    skip: !selectedContestId,
  });
  
  // Fetch appeals using RTK Query API
  const {
    data: appealsData,
    isLoading: appealsLoading,
    error: appealsError,
  } = useGetMyAppealsQuery(undefined, {
    skip: false, // Always fetch appeals for mentor
  });

  // Extract appeals from API response
  // API /appeals/my-appeal already returns appeals for current mentor, no need to filter
  const myAppeals = useMemo(() => {
    if (!appealsData) return [];
    return appealsData.appeals || [];
  }, [appealsData]);

  // Console log my appeals
  useEffect(() => {
    console.log("My Appeals:", myAppeals);
    console.log("Appeals Data (raw):", appealsData);
  }, [myAppeals, appealsData]);

  // Format score
  const formatScore = (score) => {
    return (score ?? 0).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Format round type
  const formatRoundType = (roundType) => {
    switch (roundType) {
      case "McqTest":
        return "MCQ Test";
      case "Manual":
        return "Manual Problem";
      case "AutoEvaluation":
        return "Auto Evaluation";
      default:
        return roundType || "—";
    }
  };

  // Process leaderboard data from RTK Query API
  // API returns { teams: [...] } after transformResponse
  const entries = useMemo(() => {
    if (!leaderboardData) return [];

    // Handle different response formats
    if (Array.isArray(leaderboardData)) {
      return leaderboardData;
    }

    // RTK Query transformResponse returns { teams: [...] }
    if (leaderboardData.teams && Array.isArray(leaderboardData.teams)) {
      return leaderboardData.teams;
    }

    // Fallback for other formats
    return leaderboardData?.teamIdList || leaderboardData?.entries || [];
  }, [leaderboardData]);

  // Toggle team expansion
  const toggleTeamExpansion = (teamId) => {
    setExpandedTeamId(expandedTeamId === teamId ? null : teamId);
  };

  // Get rank icon based on position
  const getRankIcon = (rank) => {
    switch (rank) {
      case 1:
        return <Trophy className="text-yellow-500" size={20} />;
      case 2:
        return <Medal className="text-gray-400" size={20} />;
      case 3:
        return <Award className="text-amber-600" size={20} />;
      default:
        return null;
    }
  };

  // Handle open appeal modal
  const handleOpenAppealModal = (roundId, roundName, teamId, studentId) => {
    openModal("createAppeal", {
      roundId,
      roundName,
      teamId,
      studentId,
    });
  };

  // Render team members detail (same as Leaderboard)
  const renderTeamMembers = (entry) => {
    const members = entry.members || entry.memberList || [];
    const teamId = entry.teamId || entry.team_id;

    if (members.length === 0) {
      return (
        <div className="px-4 py-3">
          <p className="text-sm text-gray-500">No members data available</p>
        </div>
      );
    }

    return (
      <div className="px-4 py-4">
        <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <Users size={16} />
          Team Members
        </h4>
        <div className="space-y-4">
          {members.map((member, idx) => {
            const memberId = member.memberId || member.member_id || member.id;
            const memberName =
              member.memberName ||
              member.member_name ||
              member.name ||
              "Unknown Member";
            const memberRole =
              member.memberRole ||
              member.member_role ||
              member.role ||
              "member";
            const totalScore =
              member.totalScore || member.total_score || member.score || 0;
            const roundScores =
              member.roundScores ||
              member.round_scores ||
              member.roundScoresList ||
              [];

            return (
              <div
                key={memberId || idx}
                className="bg-white rounded-lg border border-gray-200 p-4"
              >
                <div className="flex items-center justify-between  mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#ff8c5a] text-white flex items-center justify-center font-semibold text-sm">
                      {memberName.charAt(0).toUpperCase() || "M"}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{memberName}</p>
                      <p className="text-xs text-gray-500 capitalize">
                        {memberRole}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Total Score</p>
                    <p className="text-lg font-bold text-blue-600">
                      {formatScore(totalScore)}
                    </p>
                  </div>
                </div>

                {/* Round Scores */}
                {roundScores && roundScores.length > 0 ? (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs font-medium text-gray-600 mb-2">
                      Round Scores:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {roundScores.map((round, roundIdx) => {
                        const roundId = round.roundId || round.round_id;
                        const roundName =
                          round.roundName || round.round_name || "Round";
                        const roundScore = round.score || 0;
                        const roundType = round.roundType || round.round_type;
                        const completedAt =
                          round.completedAt || round.completed_at;

                        return (
                          <div
                            key={roundId || roundIdx}
                            className="bg-gray-50 rounded px-3 py-2 border border-gray-200"
                          >
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-xs font-medium text-gray-700 truncate">
                                {roundName}
                              </p>
                              <span className="text-xs font-bold text-blue-600 ml-2">
                                {roundScore.toFixed(2) || "0.00"}
                              </span>
                            </div>
                            <div className="flex items-center gap-1 mt-1">
                              <Icon
                                icon={
                                  roundType === "McqTest"
                                    ? "mdi:checkbox-multiple-marked-circle"
                                    : roundType === "Manual"
                                    ? "mdi:file-document-edit"
                                    : "mdi:code-tags"
                                }
                                className="text-gray-400"
                                width={12}
                              />
                              <p className="text-xs text-gray-500">
                                {formatRoundType(roundType)}
                              </p>
                              {completedAt && (
                                <span className="text-xs text-gray-400 ml-1">
                                  • {formatDateTime(completedAt)}
                                </span>
                              )}
                            </div>
                            {/* Button Request Appeal cho mỗi round */}
                            <div className="flex justify-start mt-2">
                              <button
                                onClick={() =>
                                  handleOpenAppealModal(
                                    roundId,
                                    roundName,
                                    teamId,
                                    memberId
                                  )
                                }
                                className="button-orange font-semibold flex items-center gap-2 px-3 py-1.5 text-xs whitespace-nowrap"
                              >
                                <Icon icon="mdi:bullhorn-outline" width={14} />
                                Request an appeal
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      No round scores available
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Breadcrumb setup
  const breadcrumbData = useMemo(() => {
    const currentContest = contest || selectedContest;
    if (currentContest) {
      return createBreadcrumbWithPaths(
        "APPEAL",
        currentContest.name || currentContest.title || "Appeals"
      );
    }
    return { items: BREADCRUMBS.APPEAL, paths: ["/appeal"] };
  }, [contest, selectedContest]);

  // Tab definitions
  const tabs = [
    { id: "student-results", label: "Student Results" },
    { id: "my-appeals", label: "My Appeal Submissions" },
  ];

  return (
    <PageContainer
      breadcrumb={breadcrumbData.items}
      breadcrumbPaths={breadcrumbData.paths}
    >
      <div className="space-y-6">
        {/* Header with Contest Selector */}
        <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6">
          <div className="flex gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Icon className="text-orange-500" icon="mdi:gavel" width={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#2d3748] mb-2">
                  Contest Appeals & Results
                </h1>
                {(contest || selectedContest) && (
                  <p className="text-[#7A7574] text-sm">
                    {(contest || selectedContest)?.name ||
                      (contest || selectedContest)?.title ||
                      "Select a contest"}
                  </p>
                )}
              </div>
            </div>
            {/* Contest Selector */}
            {availableContests.length > 1 && (
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-[#7A7574]">
                  Contest:
                </label>
                <DropdownFluent
                  options={availableContests.map((contest) => ({
                    value: contest.contestId,
                    label: contest.name,
                  }))}
                  value={selectedContestId}
                  onChange={(value) => setSelectedContestId(value)}
                />
              </div>
            )}
          </div>
        </div>

        {/* Tabs Navigation */}
        <div className="bg-white border border-[#E5E5E5] rounded-[8px] overflow-hidden">
          <div className="p-4 border-b border-[#E5E5E5]">
            <TabNavigation
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {/* Student Results Tab */}
            {activeTab === "student-results" && (
              <div className="space-y-6">
                {contestsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-orange-500 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading contests...</p>
                    </div>
                  </div>
                ) : availableContests.length === 0 ? (
                  <div className="bg-gray-50 border border-[#E5E5E5] rounded-[8px] p-8 text-center">
                    <Icon
                      icon="mdi:trophy-outline"
                      width="48"
                      className="mx-auto mb-3 text-gray-400"
                    />
                    <p className="text-[#7A7574] text-sm mb-2">
                      No contests available
                    </p>
                    <p className="text-[#7A7574] text-xs">
                      There are no ongoing contests to display results for. Appeals can only be requested for ongoing contests.
                    </p>
                  </div>
                ) : !selectedContestId ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-[8px] p-6 text-center">
                    <AlertCircle
                      size={48}
                      className="mx-auto mb-3 text-amber-500"
                    />
                    <p className="text-[#7A7574] text-sm mb-2">
                      Please select a contest to view student results.
                    </p>
                  </div>
                ) : leaderboardLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-orange-500 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading leaderboard...</p>
                    </div>
                  </div>
                ) : leaderboardError ? (
                  // Check if it's a 404 (no data yet) vs actual error
                  (typeof leaderboardError === "object" &&
                    (leaderboardError?.Message?.includes("Not found") ||
                      leaderboardError?.message?.includes("Not found") ||
                      leaderboardError?.status === 404 ||
                      leaderboardError?.statusCode === 404)) ||
                  (typeof leaderboardError === "string" &&
                    leaderboardError.includes("Not found")) ||
                  (typeof leaderboardError === "object" &&
                    leaderboardError?.status === "FETCH_ERROR") ? (
                    <div className="text-center py-12 text-[#7A7574]">
                      <Icon
                        icon="mdi:trophy-outline"
                        width="48"
                        className="mx-auto mb-2 opacity-50"
                      />
                      <p className="text-lg font-medium mb-1">
                        This contest has no leaderboard yet
                      </p>
                      <p className="text-sm">
                        The leaderboard will appear once teams start
                        participating in this contest
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
                        {(() => {
                          if (typeof leaderboardError === "string")
                            return leaderboardError;
                          if (leaderboardError?.Message)
                            return leaderboardError.Message;
                          if (leaderboardError?.message)
                            return leaderboardError.message;
                          if (leaderboardError?.data?.message)
                            return leaderboardError.data.message;
                          if (leaderboardError?.data?.Message)
                            return leaderboardError.data.Message;
                          if (leaderboardError?.status === "FETCH_ERROR") {
                            return "Unable to connect to server. Please check your internet connection.";
                          }
                          return "An error occurred while loading data. Please try again later.";
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
                            <div
                              className="w-full bg-white rounded-lg shadow-md p-4 mb-2 border border-[#E5E5E5] cursor-pointer hover:shadow-lg transition-shadow"
                              onClick={() =>
                                toggleTeamExpansion(
                                  entries[1]?.teamId || entries[1]?.team_id
                                )
                              }
                            >
                              <div className="flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center mb-2">
                                  <Users size={24} className="text-gray-600" />
                                </div>
                                <p className="text-sm font-semibold text-[#2d3748] text-center mb-1 truncate w-full">
                                  {entries[1]?.teamName ||
                                    entries[1]?.name ||
                                    "—"}
                                </p>
                                <p className="text-2xl font-bold text-[#ff6b35]">
                                  {formatScore(
                                    entries[1]?.score ||
                                      entries[1]?.totalScore ||
                                      entries[1]?.total_score
                                  )}{" "}
                                  pts
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
                            <div
                              className="w-full bg-white rounded-lg shadow-lg p-5 mb-2 border-2 border-yellow-300 cursor-pointer hover:shadow-xl transition-shadow"
                              onClick={() =>
                                toggleTeamExpansion(
                                  entries[0]?.teamId || entries[0]?.team_id
                                )
                              }
                            >
                              <div className="flex flex-col items-center">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center mb-3">
                                  <Trophy
                                    className="text-yellow-700"
                                    size={32}
                                  />
                                </div>
                                <p className="text-base font-bold text-[#2d3748] text-center mb-2 truncate w-full">
                                  {entries[0]?.teamName ||
                                    entries[0]?.name ||
                                    "—"}
                                </p>
                                <p className="text-3xl font-bold text-[#ff6b35]">
                                  {formatScore(
                                    entries[0]?.score ||
                                      entries[0]?.totalScore ||
                                      entries[0]?.total_score
                                  )}{" "}
                                  pts
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
                            <div
                              className="w-full bg-white rounded-lg shadow-md p-4 mb-2 border border-[#E5E5E5] cursor-pointer hover:shadow-lg transition-shadow"
                              onClick={() =>
                                toggleTeamExpansion(
                                  entries[2]?.teamId || entries[2]?.team_id
                                )
                              }
                            >
                              <div className="flex flex-col items-center">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center mb-2">
                                  <Award className="text-amber-700" size={24} />
                                </div>
                                <p className="text-sm font-semibold text-[#2d3748] text-center mb-1 truncate w-full">
                                  {entries[2]?.teamName ||
                                    entries[2]?.name ||
                                    "—"}
                                </p>
                                <p className="text-2xl font-bold text-[#ff6b35]">
                                  {formatScore(
                                    entries[2]?.score ||
                                      entries[2]?.totalScore ||
                                      entries[2]?.total_score
                                  )}{" "}
                                  pts
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

                        {/* Expanded Members for Top 3 */}
                        <AnimatePresence>
                          {expandedTeamId &&
                            [
                              entries[0]?.teamId || entries[0]?.team_id,
                              entries[1]?.teamId || entries[1]?.team_id,
                              entries[2]?.teamId || entries[2]?.team_id,
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
                                {entries.find(
                                  (e) =>
                                    (e.teamId || e.team_id) === expandedTeamId
                                ) && (
                                  <div className="bg-white rounded-lg border border-[#E5E5E5] p-4">
                                    {renderTeamMembers(
                                      entries.find(
                                        (e) =>
                                          (e.teamId || e.team_id) ===
                                          expandedTeamId
                                      )
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
                          Other Rankings
                        </h4>
                        {entries.slice(3).map((entry, index) => {
                          const actualRank =
                            entry.rank ||
                            entry.rankPosition ||
                            entry.rank_position ||
                            index + 4;
                          const teamId = entry.teamId || entry.team_id;
                          const isExpanded = expandedTeamId === teamId;

                          return (
                            <div
                              key={teamId || index + 3}
                              className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                              <div
                                className="p-4 cursor-pointer"
                                onClick={() => toggleTeamExpansion(teamId)}
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
                                      {entry.teamName || entry.name || "—"}
                                    </p>
                                    {(entry.members?.length ||
                                      entry.memberList?.length ||
                                      0) > 0 && (
                                      <p className="text-xs text-[#7A7574]">
                                        {entry.members?.length ||
                                          entry.memberList?.length ||
                                          0}{" "}
                                        member
                                        {(entry.members?.length ||
                                          entry.memberList?.length ||
                                          0) !== 1
                                          ? "s"
                                          : ""}
                                      </p>
                                    )}
                                  </div>

                                  {/* Score */}
                                  <div className="text-right flex-shrink-0">
                                    <p className="text-xl font-bold text-[#13d45d]">
                                      {formatScore(
                                        entry.score ||
                                          entry.totalScore ||
                                          entry.total_score
                                      )}{" "}
                                      <span className="text-xs text-[#13d45d]">
                                        pts
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
                          );
                        })}
                      </div>
                    )}

                    {/* Show top 3 as list if less than 3 entries */}
                    {entries.length < 3 && (
                      <div className="space-y-3">
                        {entries.map((entry, index) => {
                          const actualRank =
                            entry.rank ||
                            entry.rankPosition ||
                            entry.rank_position ||
                            index + 1;
                          const teamId = entry.teamId || entry.team_id;
                          const isExpanded = expandedTeamId === teamId;

                          return (
                            <div
                              key={teamId || index}
                              className="bg-white rounded-lg border border-[#E5E5E5] overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                            >
                              <div
                                className="p-4 cursor-pointer"
                                onClick={() => toggleTeamExpansion(teamId)}
                              >
                                <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                    {getRankIcon(actualRank) || (
                                      <span className="text-lg font-bold text-[#2d3748]">
                                        {actualRank}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-[#2d3748] truncate">
                                      {entry.teamName || entry.name || "—"}
                                    </p>
                                    {(entry.members?.length ||
                                      entry.memberList?.length ||
                                      0) > 0 && (
                                      <p className="text-xs text-[#7A7574]">
                                        {entry.members?.length ||
                                          entry.memberList?.length ||
                                          0}{" "}
                                        member
                                        {(entry.members?.length ||
                                          entry.memberList?.length ||
                                          0) !== 1
                                          ? "s"
                                          : ""}
                                      </p>
                                    )}
                                  </div>
                                  <div className="text-right flex-shrink-0">
                                    <p className="text-xl font-bold text-[#13d45d]">
                                      {formatScore(
                                        entry.score ||
                                          entry.totalScore ||
                                          entry.total_score
                                      )}{" "}
                                      <span className="text-xs text-[#13d45d]">
                                        pts
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
                      Leaderboard will appear once teams start participating
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* My Appeal Submissions Tab */}
            {activeTab === "my-appeals" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-[#2d3748] flex items-center gap-2">
                    <FileText size={20} className="text-[#ff6b35]" />
                    My Appeal Submissions
                  </h2>
                  {myAppeals.length > 0 && (
                    <span className="text-sm text-[#7A7574]">
                      {myAppeals.length} appeal
                      {myAppeals.length !== 1 ? "s" : ""}
                    </span>
                  )}
                </div>

                {appealsLoading ? (
                  <div className="text-center py-12">
                    <Icon
                      icon="mdi:loading"
                      width="48"
                      className="mx-auto mb-2 text-[#ff6b35] animate-spin"
                    />
                    <p className="text-[#7A7574]">Loading appeals...</p>
                  </div>
                ) : appealsError ? (
                  <div className="bg-red-50 border border-red-200 rounded-[8px] p-4 text-center">
                    <p className="text-red-600">
                      Error loading appeals. Please try again later.
                    </p>
                    {appealsError?.data?.message && (
                      <p className="text-sm text-red-500 mt-2">
                        {appealsError.data.message}
                      </p>
                    )}
                  </div>
                ) : myAppeals.length === 0 ? (
                  <div className="bg-gray-50 border border-[#E5E5E5] rounded-[8px] p-8 text-center">
                    <FileText
                      size={48}
                      className="mx-auto mb-3 text-gray-400"
                    />
                    <p className="text-[#7A7574] text-sm mb-2">
                      You haven't submitted any appeals yet.
                    </p>
                    <p className="text-[#7A7574] text-xs">
                      Appeals will appear here once you submit them.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {myAppeals.map((appeal) => {
                      // Handle both camelCase (API) and snake_case (fallback)
                      const appealId = appeal.appealId || appeal.appeal_id;
                      const state = appeal.state || "";
                      const targetType =
                        appeal.targetType || appeal.target_type;
                      const createdAt = appeal.createdAt || appeal.created_at;
                      const decision = appeal.decision || appeal.decisionReason;
                      const roundName = appeal.roundName || appeal.round_name;
                      const teamName = appeal.teamName || appeal.team_name;
                      const ownerName = appeal.ownerName || appeal.owner_name;

                      return (
                        <div
                          key={appealId}
                          className="bg-white border border-[#E5E5E5] rounded-[8px] p-5 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="px-3 py-1 bg-[#f9fafb] rounded-[5px] border border-[#E5E5E5]">
                                  <span className="text-xs font-medium text-[#7A7574]">
                                    Appeal #{appealId?.substring(0, 8) || "N/A"}
                                  </span>
                                </div>
                                <StatusBadge status={state} />
                              </div>

                              <div className="font-semibold text-[#2d3748] mb-2">
                              {appeal.contestName || "No contest provided"}
                              </div>
                              <div className="font-semibold text-[#2d3748] mb-2">
                                <p>Your Reason:</p>
                                <p className="text-sm text-[#4a5568]  p-3  ">{appeal.reason || "No reason provided"}</p>
                              </div>

                              <div className="flex items-center gap-4 flex-wrap mt-3 text-sm">
                                {roundName && (
                                  <div className="flex items-center gap-2">
                                    <Icon
                                      icon="mdi:flag-outline"
                                      width="16"
                                      className="text-[#7A7574]"
                                    />
                                    <span className="text-[#7A7574]">
                                      Round:
                                    </span>
                                    <span className="font-medium text-[#2d3748]">
                                      {roundName}
                                    </span>
                                  </div>
                                )}
                                {teamName && (
                                  <div className="flex items-center gap-2">
                                    <Icon
                                      icon="mdi:account-group"
                                      width="16"
                                      className="text-[#7A7574]"
                                    />
                                    <span className="text-[#7A7574]">
                                      Team:
                                    </span>
                                    <span className="font-medium text-[#2d3748]">
                                      {teamName}
                                    </span>
                                  </div>
                                )}
                                <div className="flex items-center gap-2">
                                  <Icon
                                    icon="mdi:tag-outline"
                                    width="16"
                                    className="text-[#7A7574]"
                                  />
                                  <span className="text-[#7A7574]">Type:</span>
                                  <span className="font-medium text-[#2d3748] capitalize">
                                    {targetType?.replace("_", " ") || "Unknown"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock size={16} className="text-[#7A7574]" />
                                  <span className="text-[#7A7574]">
                                    Created:
                                  </span>
                                  <span className="font-medium text-[#2d3748]">
                                    {formatDateTime(createdAt)}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Status Icon */}
                            <div className="ml-4 flex-shrink-0">
                              {state.toLowerCase() === "accepted" && (
                                <CheckCircle
                                  size={24}
                                  className="text-green-600"
                                />
                              )}
                              {state.toLowerCase() === "rejected" && (
                                <XCircle size={24} className="text-red-600" />
                              )}
                              {(state.toLowerCase() === "opened" ||
                                state.toLowerCase() === "open" ||
                                state.toLowerCase() === "under_review" ||
                                state.toLowerCase() === "underreview") && (
                                <AlertCircle
                                  size={24}
                                  className="text-amber-500"
                                />
                              )}
                              {state.toLowerCase() === "escalated" && (
                                <Icon
                                  icon="mdi:alert-circle"
                                  width="24"
                                  className="text-purple-600"
                                />
                              )}
                            </div>
                          </div>

                          {/* Decision */}
                          {decision && (
                            <div className="mt-4 pt-4 border-t border-[#E5E5E5]">
                              <p className="text-sm font-semibold text-[#2d3748] mb-2 flex items-center gap-2">
                                <Icon
                                  icon="mdi:comment-text-outline"
                                  width="16"
                                />
                                Decision
                              </p>
                              <p className="text-sm text-[#4a5568] bg-[#f9fafb] rounded-[5px] p-3 border border-[#E5E5E5]">
                                {decision}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

export default MentorAppeal;
