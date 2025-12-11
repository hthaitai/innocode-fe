import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import PageContainer from "@/shared/components/PageContainer";
import {
  Trophy,
  Medal,
  Award,
  Users,
  ChevronDown,
  ChevronUp,
  Wifi,
  WifiOff,
} from "lucide-react";
import { formatDateTime } from "@/shared/utils/dateTime";
import { BREADCRUMBS } from "@/config/breadcrumbs";
import { useGetTeamsByContestIdQuery } from "@/services/leaderboardApi";
import useContests from "../../../contest/hooks/useContests";
import { Icon } from "@iconify/react";
import DropdownFluent from "../../../../shared/components/DropdownFluent";
import { motion, AnimatePresence } from "framer-motion";
import { useLiveLeaderboard } from "../../hooks/useLiveLeaderboard";

const Leaderboard = () => {
  const { contestId: urlContestId } = useParams();

  const { contests, loading: contestsLoading } = useContests();

  const [expandedTeamId, setExpandedTeamId] = useState(null);
  const [liveData, setLiveData] = useState(null);

  // Format score with commas
  const formatScore = (score) => {
    return (score ?? 0).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Toggle team expansion
  const toggleTeamExpansion = (teamId) => {
    setExpandedTeamId(expandedTeamId === teamId ? null : teamId);
  };

  // Get available contests (ongoing or completed)
  const availableContests = useMemo(() => {
    if (!contests || !Array.isArray(contests)) return [];
    
    return contests.filter((c) => {
      // Filter out Draft contests
      if (c.status === 'Draft') return false;
      
      const status = c.status?.toLowerCase() || '';
      const now = new Date();
      
      // Check if ongoing
      const isOngoing = 
        status === 'ongoing' || 
        status === 'registrationopen' || 
        status === 'registrationclosed' ||
        (c.start && c.end && now >= new Date(c.start) && now < new Date(c.end));
      
      // Check if completed
      const isCompleted = 
        status === 'completed' || 
        (c.end && now > new Date(c.end));
      
      // Include if ongoing or completed
      return isOngoing || isCompleted;
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

  // Fetch leaderboard data using RTK Query
  const {
    data: leaderboardData,
    isLoading: loading,
    error,
    refetch,
  } = useGetTeamsByContestIdQuery(selectedContestId, {
    skip: !selectedContestId,
  });

  // Handle live updates from SignalR
  const handleLiveUpdate = useCallback((data) => {
    console.log("🔄 ========== HANDLE LIVE UPDATE ==========");
    console.log("🔄 Raw data received in component:", data);
    console.log("🔄 Data type:", typeof data);
    console.log("�� Is array:", Array.isArray(data));
    console.log("🔄 Data structure:", {
      isArray: Array.isArray(data),
      hasTeams: !!data?.teams,
      hasTeamIdList: !!data?.teamIdList,
      hasEntries: !!data?.entries,
      keys: data ? Object.keys(data) : "null"
    });
    
    // Update live data state
    // The data structure might be: { teams: [...] } or just the teams array
    const updatedData = Array.isArray(data) 
      ? { teams: data }
      : data?.teams 
        ? data 
        : { teams: data?.teamIdList || data?.entries || [] };
    
    console.log("🔄 Processed updatedData:", updatedData);
    console.log("🔄 Teams count:", updatedData?.teams?.length || 0);
    if (updatedData?.teams?.length > 0) {
      console.log("🔄 First team:", updatedData.teams[0]);
    }
    console.log("🔄 ========================================");
    
    setLiveData(updatedData);
  }, []);

  // Connect to live leaderboard hub - ensure this is always called
  const { isConnected, connectionError } = useLiveLeaderboard(
    selectedContestId || null, // Always pass a value, never undefined
    handleLiveUpdate,
    !!selectedContestId
  );

  // Reset live data and refetch when contest changes
  useEffect(() => {
    setLiveData(null);
    if (selectedContestId) {
      // Refetch leaderboard data when contest changes
      refetch();
    }
  }, [selectedContestId, refetch]);

  // Debug: Log leaderboard data
  useEffect(() => {
    if (import.meta.env.VITE_ENV === "development") {
      console.log(
        "🔍 [Leaderboard Component] selectedContestId:",
        selectedContestId
      );
      console.log(
        "🔍 [Leaderboard Component] leaderboardData:",
        leaderboardData
      );
      console.log(
        "🔍 [Leaderboard Component] leaderboardData type:",
        typeof leaderboardData
      );
      console.log(
        "🔍 [Leaderboard Component] leaderboardData isArray:",
        Array.isArray(leaderboardData)
      );
      console.log("🔍 [Leaderboard Component] loading:", loading);
      console.log("🔍 [Leaderboard Component] error:", error);
    }
  }, [leaderboardData, selectedContestId, loading, error]);

  // Handle data structure - Use live data if available, otherwise use initial data
  // Priority: liveData > leaderboardData
  const currentData = liveData || leaderboardData;
  const entries = Array.isArray(currentData)
    ? currentData // Fallback for old format
    : currentData?.teams ||
      currentData?.teamIdList ||
      currentData?.entries ||
      [];

  // Debug: Log entries
  useEffect(() => {
    if (import.meta.env.VITE_ENV === "development") {
      console.log("🔍 [Leaderboard Component] entries:", entries);
      console.log("🔍 [Leaderboard Component] entries length:", entries.length);
      if (entries.length > 0) {
        console.log("🔍 [Leaderboard Component] first entry:", entries[0]);
        console.log(
          "🔍 [Leaderboard Component] first entry keys:",
          Object.keys(entries[0] || {})
        );
      }
    }
  }, [entries]);

  // Get contest info from selected contest or from data
  const contestInfo = {
    contestName: selectedContest?.name || currentData?.contestName || null,
    contestId: selectedContestId,
    totalTeamCount: Array.isArray(entries)
      ? entries.length
      : currentData?.totalTeamCount || 0,
    snapshotAt: currentData?.snapshotAt || null,
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

  // Get rank badge color
  const getRankBadgeClass = (rank) => {
    switch (rank) {
      case 1:
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case 2:
        return "bg-gray-100 text-gray-800 border-gray-300";
      case 3:
        return "bg-amber-100 text-amber-800 border-amber-300";
      default:
        return "bg-blue-50 text-blue-800 border-blue-200";
    }
  };

  // Format round type for display
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

  // Render team members detail
  const renderTeamMembers = (entry) => {
    const members = entry.members || [];

    if (members.length === 0) {
      return (
        <div className="px-4 py-3">
          <p className="text-sm text-gray-500">
            Only member of this team can see detail information
          </p>
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
                      {member.memberName || "Unknown Member"}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {member.memberRole || "member"}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Total Score</p>
                  <p className="text-lg font-bold text-blue-600">
                    {formatScore(member.totalScore)}
                  </p>
                </div>
              </div>

              {/* Round Scores */}
              {member.roundScores && member.roundScores.length > 0 ? (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs font-medium text-gray-600 mb-2">
                    Round Scores:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                    {member.roundScores.map((round, roundIdx) => (
                      <div
                        key={round.roundId || roundIdx}
                        className="bg-gray-50 rounded px-3 py-2 border border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-xs font-medium text-gray-700 truncate">
                            {round.roundName || "Round"}
                          </p>
                          <span className="text-xs font-bold text-blue-600 ml-2">
                            {round.score?.toFixed(2) || "0.00"}
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
                    No round scores available
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (contestsLoading) {
    return (
      <PageContainer breadcrumb={BREADCRUMBS.LEADERBOARD}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading...</p>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!availableContests || availableContests.length === 0) {
    return (
      <PageContainer breadcrumb={BREADCRUMBS.LEADERBOARD}>
        <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 py-8 text-center">
          <Trophy className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Contests Available
          </h3>
          <p className="text-gray-600">
            There are no active or completed contests to display leaderboards
            for.
          </p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      breadcrumb={BREADCRUMBS.LEADERBOARD}
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
                    {contestInfo.contestName || "Contest Leaderboard"}
                  </h2>
                  {/* Live indicator */}
                  {selectedContestId && (
                    <div className="flex items-center gap-1.5">
                      {isConnected ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                          <span className="text-xs font-medium">Live</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-gray-400">
                          <WifiOff size={14} />
                          <span className="text-xs">Offline</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  {isConnected ? "Live updates enabled" : "View current standings and team rankings"}
                  {!isConnected && contestInfo.snapshotAt && (
                    <span>
                      {" "}
                      • Last updated: {formatDateTime(contestInfo.snapshotAt)}
                    </span>
                  )}
                  {isConnected && liveData && (
                    <span className="text-green-600">
                      {" "}
                      • Updated just now
                    </span>
                  )}
                </p>
              </div>
            </div>
            {/* Contest Selector */}
            {availableContests.length > 1 && (
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium text-gray-700">
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

        {/* Leaderboard Content */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading leaderboard...</p>
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
                This contest has no leaderboard yet
              </p>
              <p className="text-sm">
                The leaderboard will appear once teams start participating in
                this contest
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
                  if (typeof error === "string") return error;
                  if (error?.Message) return error.Message;
                  if (error?.message) return error.message;
                  if (error?.data?.message) return error.data.message;
                  if (error?.data?.Message) return error.data.Message;
                  if (error?.status === "FETCH_ERROR") {
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
                      onClick={() => toggleTeamExpansion(entries[1]?.teamId)}
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center mb-2">
                          <Users size={24} className="text-gray-600" />
                        </div>
                        <p className="text-sm font-semibold text-[#2d3748] text-center mb-1 truncate w-full">
                          {entries[1]?.teamName || "—"}
                        </p>
                        <p className="text-2xl font-bold text-[#ff6b35]">
                          {formatScore(entries[1]?.score)} pts
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-yellow-400 rounded-t-lg flex items-center justify-center py-4">
                      <span className="text-white font-bold text-lg">2</span>
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
                      onClick={() => toggleTeamExpansion(entries[0]?.teamId)}
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-300 to-yellow-500 flex items-center justify-center mb-3">
                          <Trophy className="text-yellow-700" size={32} />
                        </div>
                        <p className="text-base font-bold text-[#2d3748] text-center mb-2 truncate w-full">
                          {entries[0]?.teamName || "—"}
                        </p>
                        <p className="text-3xl font-bold text-[#ff6b35]">
                          {formatScore(entries[0]?.score)} pts
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-yellow-500 rounded-t-lg flex items-center justify-center py-6">
                      <span className="text-white font-bold text-xl">1</span>
                    </div>
                  </div>

                  {/* Rank 3 - Right */}
                  <div className="flex-1 max-w-[200px] flex flex-col items-center">
                    <div
                      className="w-full bg-white rounded-lg shadow-md p-4 mb-2 border border-[#E5E5E5] cursor-pointer hover:shadow-lg transition-shadow"
                      onClick={() => toggleTeamExpansion(entries[2]?.teamId)}
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-200 to-amber-300 flex items-center justify-center mb-2">
                          <Award className="text-amber-700" size={24} />
                        </div>
                        <p className="text-sm font-semibold text-[#2d3748] text-center mb-1 truncate w-full">
                          {entries[2]?.teamName || "—"}
                        </p>
                        <p className="text-2xl font-bold text-[#ff6b35]">
                          {formatScore(entries[2]?.score)} pts
                        </p>
                      </div>
                    </div>
                    <div className="w-full bg-amber-400 rounded-t-lg flex items-center justify-center py-3">
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
                              entries.find((e) => e.teamId === expandedTeamId)
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
                  const actualRank = entry.rank || index + 4;
                  const isExpanded = expandedTeamId === entry.teamId;

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
                                {entry.members?.length || 0} member
                                {(entry.members?.length || 0) !== 1 ? "s" : ""}
                              </p>
                            )}
                          </div>

                          {/* Score */}
                          <div className="text-right flex-shrink-0">
                            <p className="text-xl font-bold text-[#13d45d]">
                              {formatScore(entry.score)}{" "}
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
                  const actualRank = entry.rank || index + 1;
                  const isExpanded = expandedTeamId === entry.teamId;
                  const getRankIcon = () => {
                    if (actualRank === 1)
                      return <Trophy className="text-yellow-500" size={20} />;
                    if (actualRank === 2)
                      return <Medal className="text-gray-400" size={20} />;
                    if (actualRank === 3)
                      return <Award className="text-amber-600" size={20} />;
                    return null;
                  };

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
                                {entry.members?.length || 0} member
                                {(entry.members?.length || 0) !== 1 ? "s" : ""}
                              </p>
                            )}
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xl font-bold text-[#13d45d]">
                              {formatScore(entry.score)}{" "}
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
    </PageContainer>
  );
};

export default Leaderboard;
