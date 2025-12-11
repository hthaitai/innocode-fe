import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageContainer from "@/shared/components/PageContainer";
import { createBreadcrumbWithPaths, BREADCRUMBS } from "@/config/breadcrumbs";
import {
  Trophy,
  Medal,
  Award,
  Users,
  ChevronDown,
  ChevronUp,
  WifiOff,
} from "lucide-react";
import { formatDateTime } from "@/shared/utils/dateTime";
import { useGetTeamsByContestIdQuery } from "@/services/leaderboardApi";
import useContestDetail from "../hooks/useContestDetail";
import { Icon } from "@iconify/react";
import { useLiveLeaderboard } from "@/features/leaderboard/hooks/useLiveLeaderboard";

const Leaderboard = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const [expandedTeamId, setExpandedTeamId] = useState(null);
  const [liveData, setLiveData] = useState(null);

  // Fetch contest details
  const {
    contest,
    loading: contestLoading,
    error: contestError,
  } = useContestDetail(contestId);

  // Fetch leaderboard data using RTK Query
  const {
    data: leaderboardData,
    isLoading: loading,
    error,
  } = useGetTeamsByContestIdQuery(contestId, {
    skip: !contestId,
  });

  // Handle live updates from SignalR
  const handleLiveUpdate = useCallback((data) => {
    if (import.meta.env.VITE_ENV === "development") {
      console.log("🔄 Live leaderboard update received:", data);
    }
    
    // Update live data state
    // The data structure might be: { teams: [...] } or just the teams array
    const updatedData = Array.isArray(data) 
      ? { teams: data }
      : data?.teams 
        ? data 
        : { teams: data?.teamIdList || data?.entries || [] };
    
    setLiveData(updatedData);
  }, []);

  // Connect to live leaderboard hub
  const { isConnected, connectionError } = useLiveLeaderboard(
    contestId,
    handleLiveUpdate,
    !!contestId
  );

  // Reset live data when contest changes
  useEffect(() => {
    setLiveData(null);
  }, [contestId]);

  // Format score with commas
  const formatScore = (score) => {
    return (score ?? 0).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Toggle team expansion
  const toggleTeamExpansion = (teamId) => {
    setExpandedTeamId(expandedTeamId === teamId ? null : teamId);
  };

  // Handle data structure - Use live data if available, otherwise use initial data
  // Priority: liveData > leaderboardData
  const currentData = liveData || leaderboardData;
  const entries = Array.isArray(currentData)
    ? currentData // Fallback for old format
    : currentData?.teams || 
      currentData?.teamIdList || 
      currentData?.entries || 
      [];

  // Get contest info
  const contestInfo = {
    contestName: contest?.name || currentData?.contestName || null,
    contestId: contestId,
    totalTeamCount: Array.isArray(entries) ? entries.length : (currentData?.totalTeamCount || 0),
    snapshotAt: currentData?.snapshotAt || null,
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

  // Breadcrumb setup
  const breadcrumbData = contest
    ? createBreadcrumbWithPaths(
        "CONTEST_LEADERBOARD",
        contest.name || contest.title
      )
    : { items: BREADCRUMBS.LEADERBOARD, paths: ["/leaderboard"] };

  if (contestLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbData.items}
        breadcrumbPaths={breadcrumbData.paths}
        loading={true}
      >
        <div>Loading contest...</div>
      </PageContainer>
    );
  }

  if (contestError || !contest) {
    return (
      <PageContainer
        breadcrumb={breadcrumbData.items}
        breadcrumbPaths={breadcrumbData.paths}
      >
        <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 py-8 text-center">
          <Icon
            icon="mdi:alert-circle-outline"
            width="48"
            className="mx-auto mb-2 text-red-500 opacity-50"
          />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Contest Not Found
          </h3>
          <p className="text-gray-600 mb-4">
            {contestError || "The contest you're looking for doesn't exist."}
          </p>
          <button
            onClick={() => navigate("/contests")}
            className="button-orange"
          >
            Back to Contests
          </button>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbData.items}
      breadcrumbPaths={breadcrumbData.paths}
      loading={loading}
      error={null}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="border border-[#E5E5E5] rounded-[5px] bg-white px-5 py-4">
          <div className="flex gap-4 items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Trophy className="text-blue-600" size={24} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {contestInfo.contestName || "Contest Leaderboard"}
                  </h2>
                  {/* Live indicator */}
                  {contestId && (
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
            <button
              onClick={() => navigate(`/contest-detail/${contestId}`)}
              className="button-white text-sm px-4 py-2"
            >
              Back to Contest
            </button>
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
                The leaderboard will appear once teams start participating in this contest
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
                {expandedTeamId &&
                  [
                    entries[0]?.teamId,
                    entries[1]?.teamId,
                    entries[2]?.teamId,
                  ].includes(expandedTeamId) && (
                    <div className="mt-4">
                      {entries.find((e) => e.teamId === expandedTeamId) && (
                        <div className="bg-white rounded-lg border border-[#E5E5E5] p-4">
                          {renderTeamMembers(
                            entries.find((e) => e.teamId === expandedTeamId)
                          )}
                        </div>
                      )}
                    </div>
                  )}
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
                            <p className="text-xs text-[#7A7574]">
                              {entry.members?.length || 0} member
                              {(entry.members?.length || 0) !== 1 ? "s" : ""}
                            </p>
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
                            {isExpanded ? (
                              <ChevronUp className="text-[#7A7574]" size={20} />
                            ) : (
                              <ChevronDown
                                className="text-[#7A7574]"
                                size={20}
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Members Section */}
                      {isExpanded && renderTeamMembers(entry)}
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
                            <p className="text-xs text-[#7A7574]">
                              {entry.members?.length || 0} member
                              {(entry.members?.length || 0) !== 1 ? "s" : ""}
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
                          <div className="flex-shrink-0">
                            {isExpanded ? (
                              <ChevronUp className="text-[#7A7574]" size={20} />
                            ) : (
                              <ChevronDown
                                className="text-[#7A7574]"
                                size={20}
                              />
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Members Section */}
                      {isExpanded && renderTeamMembers(entry)}
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
