import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import bannerImage from "../../../assets/banner.jpg";
import ContestCard from "../../../shared/components/contest/ContestCard";
import useContests from "../../contest/hooks/useContests";
import { useGetTeamsByContestIdQuery } from "@/services/leaderboardApi";
import { Trophy, Medal, Award, Users, ArrowRight, Headset } from "lucide-react";
import { Icon } from "@iconify/react";

const Home = () => {
  const { t } = useTranslation("home");
  const navigate = useNavigate();
  const { contests, loading: contestsLoading } = useContests();

  // Filter and group contests
  const filteredContests = useMemo(() => {
    if (!contests || !Array.isArray(contests)) {
      return [];
    }
    return contests.filter((contest) => contest.status !== "Draft");
  }, [contests]);

  const ongoingContests = useMemo(() => {
    return filteredContests
      .filter((c) => {
        const status = c.status?.toLowerCase() || "";
        return (
          status === "ongoing" ||
          status === "registrationopen" ||
          status === "registrationclosed"
        );
      })
      .slice(0, 3); // Show max 3 for side layout
  }, [filteredContests]);

  const upcomingContests = useMemo(() => {
    return filteredContests
      .filter((c) => {
        const status = c.status?.toLowerCase() || "";
        if (status === "published" || status === "registrationopen") {
          if (c.start) {
            const now = new Date();
            const start = new Date(c.start);
            return now < start;
          }
          return true;
        }
        return false;
      })
      .slice(0, 3); // Show max 3 for side layout
  }, [filteredContests]);

  const completedContests = useMemo(() => {
    return filteredContests
      .filter((c) => {
        const status = c.status?.toLowerCase() || "";
        return (
          status === "completed" || (c.end && new Date() > new Date(c.end))
        );
      })
      .slice(0, 3); // Show max 3 for side layout
  }, [filteredContests]);

  // Get first available contest for leaderboard preview
  const leaderboardContest = useMemo(() => {
    const allAvailable = [...ongoingContests, ...completedContests].filter(
      (c) => c.status !== "Draft"
    );
    return allAvailable.length > 0 ? allAvailable[0] : null;
  }, [ongoingContests, completedContests]);

  // Fetch leaderboard data
  const { data: leaderboardData, isLoading: leaderboardLoading } =
    useGetTeamsByContestIdQuery(leaderboardContest?.contestId, {
      skip: !leaderboardContest?.contestId,
    });

  const formatScore = (score) => {
    return (score ?? 0).toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const handleContestClick = (contest) => {
    navigate(`/contest-detail/${contest.contestId}`);
  };

  const handleViewAllContests = () => {
    navigate("/contests");
  };

  const handleViewLeaderboard = () => {
    if (leaderboardContest) {
      navigate(`/leaderboard/${leaderboardContest.contestId}`);
    } else {
      navigate("/leaderboard");
    }
  };

  // Get top teams for leaderboard preview
  const topTeams = useMemo(() => {
    if (!leaderboardData?.teams || !Array.isArray(leaderboardData.teams)) {
      return [];
    }
    return leaderboardData.teams.slice(0, 5); // Show top 5 teams
  }, [leaderboardData]);

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Award className="w-5 h-5 text-amber-600" />;
    return null;
  };

  return (
    <div className="min-h-screen bg-[#f3f3f3] w-full overflow-x-hidden">
      {/* Banner Section */}
      <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${bannerImage})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30" />
        </div>

        <div className="relative z-10 h-full flex items-center">
          <div className="container mx-auto px-4 md:px-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl text-white"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                {t("title")}
                <span className="block text-[#ff6b35]">{t("subtitle")}</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-200 leading-relaxed">
                {t("description")}
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={handleViewAllContests}
                  className="px-6 py-3 bg-[#ff6b35] hover:bg-[#ff8c5a] text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  {t("viewContests")}
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={handleViewLeaderboard}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-colors duration-200 backdrop-blur-sm flex items-center gap-2"
                >
                  <Trophy className="w-5 h-5" />
                  {t("leaderboard")}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="w-full px-4 md:px-8 lg:px-12 py-12">
        {/* Main Content: Contests (Left) and Leaderboard (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Left Side: Contest Cards */}
          <div className="lg:col-span-2 space-y-12">
            {/* Ongoing Contests Section */}
            {ongoingContests.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                      <div className="w-1 h-8 bg-[#ff6b35] rounded-full"></div>
                      {t("ongoingContests")}
                    </h2>
                    <p className="text-gray-600">{t("joinNow")}</p>
                  </div>
                  <button
                    onClick={handleViewAllContests}
                    className="text-[#ff6b35] hover:text-[#ff8c5a] font-semibold flex items-center gap-2 transition-colors text-sm"
                  >
                    {t("viewAll")}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {contestsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-orange-500"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {ongoingContests.map((contest) => (
                      <motion.div
                        key={contest.contestId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ContestCard
                          contest={contest}
                          onClick={() => handleContestClick(contest)}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Upcoming Contests Section */}
            {upcomingContests.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                      <div className="w-1 h-8 bg-amber-500 rounded-full"></div>
                      {t("upcomingContests")}
                    </h2>
                    <p className="text-gray-600">{t("upcomingContests")}</p>
                  </div>
                  <button
                    onClick={handleViewAllContests}
                    className="text-[#ff6b35] hover:text-[#ff8c5a] font-semibold flex items-center gap-2 transition-colors text-sm"
                  >
                    {t("viewAll")}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {contestsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-amber-500"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {upcomingContests.map((contest) => (
                      <motion.div
                        key={contest.contestId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ContestCard
                          contest={contest}
                          onClick={() => handleContestClick(contest)}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {/* Completed Contests Section */}
            {completedContests.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                      <div className="w-1 h-8 bg-green-500 rounded-full"></div>
                      {t("completedContests")}
                    </h2>
                    <p className="text-gray-600">
                      {t("viewAll")}
                    </p>
                  </div>
                  <button
                    onClick={handleViewAllContests}
                    className="text-[#ff6b35] hover:text-[#ff8c5a] font-semibold flex items-center gap-2 transition-colors text-sm"
                  >
                    {t("viewAll")}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {contestsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-green-500"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {completedContests.map((contest) => (
                      <motion.div
                        key={contest.contestId}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ContestCard
                          contest={contest}
                          onClick={() => handleContestClick(contest)}
                        />
                      </motion.div>
                    ))}
                  </div>
                )}
              </section>
            )}
          </div>

          {/* Right Side: Leaderboard Preview */}
          <div className="lg:col-span-1">
            {leaderboardContest && (
              <section>
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                    <Trophy className="w-7 h-7 text-yellow-500" />
                    Leaderboard
                  </h2>
                  <p className="text-sm text-gray-600 mb-4">
                    Top teams in:{" "}
                    <span className="font-semibold text-[#ff6b35]">
                      {leaderboardContest.name}
                    </span>
                  </p>
                  <button
                    onClick={handleViewLeaderboard}
                    className="text-[#ff6b35] hover:text-[#ff8c5a] font-semibold flex items-center gap-2 transition-colors text-sm w-full justify-end"
                  >
                    View full
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {leaderboardLoading ? (
                  <div className="flex items-center justify-center py-12 bg-white rounded-xl shadow-sm">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200 border-t-orange-500"></div>
                  </div>
                ) : topTeams.length > 0 ? (
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
                          {topTeams.map((team, index) => {
                            const rank = index + 1;
                            return (
                              <motion.tr
                                key={team.teamId || index}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{
                                  duration: 0.3,
                                  delay: index * 0.1,
                                }}
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
                                      {team.teamName
                                        ?.charAt(0)
                                        ?.toUpperCase() || "T"}
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
                              </motion.tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                    <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-600 text-sm">
                      {t("noLeaderboardData")}
                    </p>
                  </div>
                )}
              </section>
            )}
          </div>
        </div>
      </div>
      {/* Footer */}
      <footer className="w-full bg-gray-800 text-white py-6 mt-16">
        <div className="w-full px-4 md:px-8 lg:px-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-[#ff6b35]">
                InnoCode
              </span>
              <span className="text-gray-400">
                © 2025. All rights reserved.
              </span>
            </div>
            <span className=" flex items-center gap-2 text-gray-400">
              <Headset className="w-6 h-6" />
              <p className="font-semibold"> Contact for support :</p>
              <span className="text-gray-400">
                innocodechallenge@gmail.com
              </span>{" "}
            </span>
            <div className="flex items-center gap-6 text-gray-400">
              <span>Programming Contest Platform</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
