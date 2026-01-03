import React, { useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PageContainer from "@/shared/components/PageContainer";
import TabNavigation from "@/shared/components/TabNavigation";
import DropdownFluent from "@/shared/components/DropdownFluent";
import { BREADCRUMBS, createBreadcrumbWithPaths } from "@/config/breadcrumbs";
import { Icon } from "@iconify/react";
import {
  Users,
  Trophy,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { formatDateTime } from "@/shared/utils/dateTime";
import { formatScore } from "@/shared/utils/formatNumber";
import StatusBadge from "@/shared/components/StatusBadge";
import { useGetTeamsByContestIdQuery } from "@/services/leaderboardApi";
import { useGetMyAppealsQuery } from "@/services/appealApi";
import { useGetRoundsByContestIdQuery } from "@/services/roundApi";
import { useGetMyTeamQuery } from "@/services/teamApi";
import useContestDetail from "@/features/contest/hooks/useContestDetail";
import useContests from "@/features/contest/hooks/useContests";
import { useAuth } from "@/context/AuthContext";
import { useModal } from "@/shared/hooks/useModal";
function MentorAppeal() {
  const { t } = useTranslation("pages");
  const { contestId: urlContestId } = useParams();
  const { user } = useAuth();
  const { openModal } = useModal();
  const [activeTab, setActiveTab] = useState("student-results");

  // Fetch mentor's team
  const {
    data: myTeamsData,
    isLoading: myTeamLoading,
  } = useGetMyTeamQuery(undefined, {
    skip: !user?.id,
  });

  // Fetch contests list
  const { contests, loading: contestsLoading } = useContests();

  // Get available contests (only ongoing - for appeal requests)
  const availableContests = useMemo(() => {
    if (!contests || !Array.isArray(contests)) return [];

    return contests.filter((c) => {
      // Filter out Draft contests
      if (c.status === "Draft") return false;

      const status = c.status?.toLowerCase() || "";
      const now = new Date();

    return true;
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
  } = useGetMyAppealsQuery(selectedContestId, {
    skip: !selectedContestId, // Skip if no contest selected
  });

  // Fetch rounds for the contest
  const {
    data: roundsData,
    isLoading: roundsLoading,
    error: roundsError,
  } = useGetRoundsByContestIdQuery(selectedContestId, {
    skip: !selectedContestId,
  });

  const rounds = useMemo(() => {
    if (!roundsData) return [];
    return roundsData.data || [];
  }, [roundsData]);

  // Extract appeals from API response
  // API /appeals/my-appeal already returns appeals for current mentor, no need to filter
  const myAppeals = useMemo(() => {
    if (!appealsData) {
      console.log("No appealsData available");
      return [];
    }
    
    // Handle different response structures
    if (Array.isArray(appealsData)) {
      console.log("appealsData is array, using directly");
      return appealsData;
    }
    
    if (appealsData.appeals && Array.isArray(appealsData.appeals)) {
      console.log("Using appealsData.appeals");
      return appealsData.appeals;
    }
    
    if (appealsData.data && Array.isArray(appealsData.data)) {
      console.log("Using appealsData.data");
      return appealsData.data;
    }
    
    console.warn("Unknown appealsData structure:", appealsData);
    return [];
  }, [appealsData]);

  // Console log my appeals - Debug API response
  useEffect(() => {
    console.log("=== APPEALS API DEBUG ===");
    console.log("Selected Contest ID:", selectedContestId);
    console.log("Appeals Loading:", appealsLoading);
    console.log("Appeals Error:", appealsError);
    console.log("Appeals Data (raw):", appealsData);
    console.log("My Appeals (processed):", myAppeals);
    console.log("=========================");
  }, [selectedContestId, appealsLoading, appealsError, appealsData, myAppeals]);


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

  // Get mentor's team for selected contest
  const myTeam = useMemo(() => {
    if (!myTeamsData || !selectedContestId || !Array.isArray(myTeamsData)) return null;
    return myTeamsData.find((team) => {
      const teamContestId = team.contestId || team.contest_id;
      return String(teamContestId) === String(selectedContestId);
    });
  }, [myTeamsData, selectedContestId]);

  // Process leaderboard data from RTK Query API
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

  // Extract rounds from mentor's students from leaderboard data
  // Includes all rounds that students have attempted (have roundScores), regardless of completion status
  // This allows appeal requests even during ongoing rounds
  const studentRounds = useMemo(() => {
    if (!myTeam || !entries || !rounds) return [];

    // Find mentor's team in leaderboard entries
    const mentorTeam = entries.find((entry) => {
      const entryTeamId = entry.teamId || entry.team_id;
      const myTeamId = myTeam.teamId || myTeam.team_id;
      return String(entryTeamId) === String(myTeamId);
    });

    if (!mentorTeam) return [];

    const members = mentorTeam.members || mentorTeam.memberList || [];
    const studentRoundsList = [];

    // Extract rounds from each member's roundScores
    // Include all rounds that students have attempted (have roundId in roundScores)
    // No need to check completedAt - allows appeals during ongoing rounds
    members.forEach((member) => {
      const memberId = member.memberId || member.member_id || member.id;
      const memberName = member.memberName || member.member_name || member.name || "Unknown";
      const roundScores = member.roundScores || member.round_scores || member.roundScoresList || [];

      roundScores.forEach((roundScore) => {
        const roundId = roundScore.roundId || roundScore.round_id;
        const roundName = roundScore.roundName || roundScore.round_name;
        const roundType = roundScore.roundType || roundScore.round_type;
        const completedAt = roundScore.completedAt || roundScore.completed_at;

        // Include round if it has roundId (student has attempted it)
        // No need to check completedAt - allows appeals during ongoing rounds
        if (roundId) {
          studentRoundsList.push({
            roundId,
            roundName,
            roundType,
            studentId: memberId,
            studentName: memberName,
            teamId: mentorTeam.teamId || mentorTeam.team_id,
            contestName: contest?.name || selectedContest?.name || "",
            completedAt, // May be null if round is still ongoing
            score: roundScore.score,
          });
        }
      });
    });

    return studentRoundsList;
  }, [myTeam, entries, rounds, contest, selectedContest]);



  // Handle open appeal modal
  const handleOpenAppealModal = (roundId, roundName, teamId, studentId, roundType) => {
    openModal("createAppeal", {
      contestId: selectedContestId,
      roundId,
      roundName,
      teamId,
      studentId,
      roundType,
    });
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
    { id: "student-results", label: t("appeal.studentResults") },
    { id: "my-appeals", label: t("appeal.myAppealSubmissions") },
  ];

  return (
    <PageContainer
      breadcrumb={breadcrumbData.items}
      breadcrumbPaths={breadcrumbData.paths}
    >
      <div className="space-y-6">
        {/* Header with Contest Selector */}
        <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6">
          <div className="flex gap-4 items-center justify-between flex-wrap">
            <div className="flex gap-4 items-center">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Icon className="text-orange-500" icon="mdi:gavel" width={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-[#2d3748] mb-2">
                  {t("appeal.contestAppealsResults")}
                </h1>
                {(contest || selectedContest) && (
                  <p className="text-[#7A7574] text-sm">
                    {(contest || selectedContest)?.name ||
                      (contest || selectedContest)?.title ||
                      t("appeal.selectContest")}
                  </p>
                )}
              </div>
            </div>
            {/* Contest Selector */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <label className="text-sm font-medium text-[#7A7574] whitespace-nowrap">
                {t("appeal.contest")}
              </label>
              <div className="min-w-[200px]">
                <DropdownFluent
                  options={availableContests.map((contest) => ({
                    value: contest.contestId,
                    label: contest.name,
                  }))}
                  value={selectedContestId}
                  onChange={(value) => setSelectedContestId(value)}
                  placeholder={availableContests.length === 0 ? t("appeal.selectContest") : undefined}
                />
              </div>
            </div>
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
                {contestsLoading || myTeamLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-orange-500 mx-auto mb-4"></div>
                      <p className="text-gray-600">{t("appeal.loadingContests")}</p>
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
                      {t("appeal.noContestsAvailable")}
                    </p>
                  </div>
                ) : !selectedContestId ? (
                  <div className="bg-amber-50 border border-amber-200 rounded-[8px] p-6 text-center">
                    <AlertCircle
                      size={48}
                      className="mx-auto mb-3 text-amber-500"
                    />
                    <p className="text-[#7A7574] text-sm mb-2">
                      {t("appeal.pleaseSelectContest")}
                    </p>
                  </div>
                ) : leaderboardLoading || roundsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-orange-500 mx-auto mb-4"></div>
                      <p className="text-gray-600">{t("appeal.loadingLeaderboard")}</p>
                    </div>
                  </div>
                ) : !myTeam ? (
                  <div className="bg-gray-50 border border-[#E5E5E5] rounded-[8px] p-8 text-center">
                    <Users
                      size={48}
                      className="mx-auto mb-3 text-gray-400"
                    />
                    <p className="text-[#7A7574] text-sm mb-2">
                      You don't have a team in this contest
                    </p>
                    <p className="text-[#7A7574] text-xs">
                      Create or join a team to see student results
                    </p>
                  </div>
                ) : studentRounds.length === 0 ? (
                  <div className="bg-gray-50 border border-[#E5E5E5] rounded-[8px] p-8 text-center">
                    <Icon
                      icon="mdi:file-document-outline"
                      width="48"
                      className="mx-auto mb-3 text-gray-400"
                    />
                    <p className="text-[#7A7574] text-sm mb-2">
                      No rounds attempted yet
                    </p>
                    <p className="text-[#7A7574] text-xs">
                      Rounds will appear here once students start attempting them
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-[#2d3748]">
                        Student Rounds
                      </h3>
                      <span className="text-sm text-[#7A7574]">
                        {studentRounds.length} round{studentRounds.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                    
                    {studentRounds.map((round, idx) => (
                      <div
                        key={`${round.studentId}-${round.roundId}-${idx}`}
                        className="bg-white border border-[#E5E5E5] rounded-[8px] p-5 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="p-2 bg-blue-50 rounded-lg">
                                <Icon
                                  icon={
                                    round.roundType === "McqTest"
                                      ? "mdi:checkbox-multiple-marked-circle"
                                      : round.roundType === "Manual"
                                      ? "mdi:file-document-edit"
                                      : "mdi:code-tags"
                                  }
                                  className="text-blue-600"
                                  width={20}
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-semibold text-[#2d3748] mb-1">
                                  {round.roundName}
                                </h4>
                                <p className="text-sm text-[#7A7574]">
                                  {round.contestName}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 flex-wrap text-sm">
                              <div className="flex items-center gap-2">
                                <Users size={16} className="text-[#7A7574]" />
                                <span className="text-[#7A7574]">Student:</span>
                                <span className="font-medium text-[#2d3748]">
                                  {round.studentName}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Icon
                                  icon="mdi:tag-outline"
                                  width={16}
                                  className="text-[#7A7574]"
                                />
                                <span className="text-[#7A7574]">Type:</span>
                                <span className="font-medium text-[#2d3748] capitalize">
                                  {formatRoundType(round.roundType)}
                                </span>
                              </div>
                              {round.completedAt && (
                                <div className="flex items-center gap-2">
                                  <Clock size={16} className="text-[#7A7574]" />
                                  <span className="text-[#7A7574]">Completed:</span>
                                  <span className="font-medium text-[#2d3748]">
                                    {formatDateTime(round.completedAt)}
                                  </span>
                                </div>
                              )}
                              {round.score !== undefined && round.score !== null && (
                                <div className="flex items-center gap-2">
                                  <Trophy size={16} className="text-[#7A7574]" />
                                  <span className="text-[#7A7574]">Score:</span>
                                  <span className="font-medium text-blue-600">
                                    {round.score}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          
                          <button
                            onClick={() =>
                              handleOpenAppealModal(
                                round.roundId,
                                round.roundName,
                                round.teamId,
                                round.studentId,
                                round.roundType
                              )
                            }
                            className="button-orange font-semibold flex items-center gap-2 px-4 py-2 ml-4 whitespace-nowrap"
                          >
                            <Icon
                              icon="mdi:bullhorn-outline"
                              width={16}
                            />
                            {t("appeal.requestAnAppeal")}
                          </button>
                        </div>
                      </div>
                    ))}
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
                    {t("appeal.myAppealSubmissions")}
                  </h2>
                  {myAppeals.length > 0 && (
                    <span className="text-sm text-[#7A7574]">
                      {myAppeals.length} {myAppeals.length !== 1 ? t("appeal.appeals") : t("appeal.appeal")}
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
                    <p className="text-[#7A7574]">{t("appeal.loadingAppeals")}</p>
                  </div>
                ) : appealsError ? (
                  <div className="bg-red-50 border border-red-200 rounded-[8px] p-4 text-center">
                    <Icon
                      icon="mdi:alert-circle"
                      width="48"
                      className="mx-auto mb-2 text-red-500"
                    />
                    <p className="text-red-600 font-semibold mb-2">
                      {t("appeal.errorLoadingAppeals")}
                    </p>
                    <div className="text-sm text-red-500 space-y-1">
                      {appealsError?.data?.message && (
                        <p>{appealsError.data.message}</p>
                      )}
                      {appealsError?.data?.Message && (
                        <p>{appealsError.data.Message}</p>
                      )}
                      {typeof appealsError === "string" && (
                        <p>{appealsError}</p>
                      )}
                      {appealsError?.status && (
                        <p className="text-xs">Status: {appealsError.status}</p>
                      )}
                      {appealsError?.statusCode && (
                        <p className="text-xs">Status Code: {appealsError.statusCode}</p>
                      )}
                    </div>
                    {process.env.NODE_ENV === "development" && (
                      <details className="mt-4 text-left">
                        <summary className="text-xs text-red-400 cursor-pointer">
                          Debug Info (Dev Only)
                        </summary>
                        <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto max-h-40">
                          {JSON.stringify(appealsError, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ) : myAppeals.length === 0 ? (
                  <div className="bg-gray-50 border border-[#E5E5E5] rounded-[8px] p-8 text-center">
                    <FileText
                      size={48}
                      className="mx-auto mb-3 text-gray-400"
                    />
                    <p className="text-[#7A7574] text-sm mb-2">
                      {t("appeal.noAppealsSubmitted")}
                    </p>
                    <p className="text-[#7A7574] text-xs">
                      {t("appeal.appealsWillAppearHere")}
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
                                {appeal.contestName || t("appeal.noContestProvided")}
                              </div>
                              <div className="font-semibold text-[#2d3748] mb-2">
                                <p>{t("appeal.yourReason")}</p>
                                <p className="text-sm text-[#4a5568]  p-3  ">
                                  {appeal.reason || t("appeal.noReasonProvided")}
                                </p>
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
                                      {t("appeal.round")}
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
                                      {t("appeal.team")}
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
                                  <span className="text-[#7A7574]">{t("appeal.type")}</span>
                                  <span className="font-medium text-[#2d3748] capitalize">
                                    {targetType?.replace("_", " ") || "Unknown"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock size={16} className="text-[#7A7574]" />
                                  <span className="text-[#7A7574]">
                                    {t("appeal.created")}
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
                                {t("appeal.decision")}
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
