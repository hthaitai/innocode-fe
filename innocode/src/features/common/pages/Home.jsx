import React, { useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import useContests from "../../contest/hooks/useContests"
import { useGetTeamsByContestIdQuery } from "@/services/leaderboardApi"
import Footer from "../../../shared/components/footer/Footer"
import HomeHero from "../components/home/HomeHero"
import HomeContestSection from "../components/home/HomeContestSection"
import HomeLeaderboard from "../components/home/HomeLeaderboard"

const Home = () => {
  const { t } = useTranslation("home")
  const navigate = useNavigate()
  const { contests, loading: contestsLoading } = useContests()

  // Filter and group contests
  const filteredContests = useMemo(() => {
    if (!contests || !Array.isArray(contests)) {
      return []
    }
    return contests.filter((contest) => contest.status !== "Draft")
  }, [contests])

  const ongoingContests = useMemo(() => {
    return filteredContests
      .filter((c) => {
        const status = c.status?.toLowerCase() || ""
        return (
          status === "ongoing" ||
          status === "registrationopen" ||
          status === "registrationclosed"
        )
      })
      .slice(0, 3) // Show max 3 for side layout
  }, [filteredContests])

  const upcomingContests = useMemo(() => {
    return filteredContests
      .filter((c) => {
        const status = c.status?.toLowerCase() || ""
        if (status === "published" || status === "registrationopen") {
          if (c.start) {
            const now = new Date()
            const start = new Date(c.start)
            return now < start
          }
          return true
        }
        return false
      })
      .slice(0, 3) // Show max 3 for side layout
  }, [filteredContests])

  const completedContests = useMemo(() => {
    return filteredContests
      .filter((c) => {
        const status = c.status?.toLowerCase() || ""
        return status === "completed" || (c.end && new Date() > new Date(c.end))
      })
      .slice(0, 3) // Show max 3 for side layout
  }, [filteredContests])

  // Get first available contest for leaderboard preview
  const leaderboardContest = useMemo(() => {
    const allAvailable = [...ongoingContests, ...completedContests].filter(
      (c) => c.status !== "Draft"
    )
    return allAvailable.length > 0 ? allAvailable[0] : null
  }, [ongoingContests, completedContests])

  // Fetch leaderboard data
  const { data: leaderboardData, isLoading: leaderboardLoading } =
    useGetTeamsByContestIdQuery(leaderboardContest?.contestId, {
      skip: !leaderboardContest?.contestId,
    })

  const handleContestClick = (contest) => {
    navigate(`/contest-detail/${contest.contestId}`)
  }

  const handleViewAllContests = () => {
    navigate("/contests")
  }

  const handleViewLeaderboard = () => {
    if (leaderboardContest) {
      navigate(`/leaderboard/${leaderboardContest.contestId}`)
    } else {
      navigate("/leaderboard")
    }
  }

  // Get top teams for leaderboard preview
  const topTeams = useMemo(() => {
    if (!leaderboardData?.teams || !Array.isArray(leaderboardData.teams)) {
      return []
    }
    return leaderboardData.teams.slice(0, 5) // Show top 5 teams
  }, [leaderboardData])

  return (
    <div className="min-h-screen bg-[#f3f3f3] w-full overflow-x-hidden">
      <HomeHero
        onViewAllContests={handleViewAllContests}
        onViewLeaderboard={handleViewLeaderboard}
      />

      <div className="w-full px-4 md:px-8 lg:px-12 py-12">
        {/* Main Content: Contests (Left) and Leaderboard (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {/* Left Side: Contest Cards */}
          <div className="lg:col-span-2 space-y-12">
            <HomeContestSection
              title={t("ongoingContests")}
              subtitle={t("joinNow")}
              contests={ongoingContests}
              loading={contestsLoading}
              indicatorColor="bg-[#ff6b35]"
              loadingColor="border-t-orange-500"
              onViewAll={handleViewAllContests}
              onContestClick={handleContestClick}
            />

            <HomeContestSection
              title={t("upcomingContests")}
              subtitle={t("upcomingContests")}
              contests={upcomingContests}
              loading={contestsLoading}
              indicatorColor="bg-amber-500"
              loadingColor="border-t-amber-500"
              onViewAll={handleViewAllContests}
              onContestClick={handleContestClick}
            />

            <HomeContestSection
              title={t("completedContests")}
              subtitle={t("viewAll")}
              contests={completedContests}
              loading={contestsLoading}
              indicatorColor="bg-green-500"
              loadingColor="border-t-green-500"
              onViewAll={handleViewAllContests}
              onContestClick={handleContestClick}
            />
          </div>

          {/* Right Side: Leaderboard Preview */}
          <div className="lg:col-span-1">
            <HomeLeaderboard
              contest={leaderboardContest}
              teams={topTeams}
              loading={leaderboardLoading}
              onViewFull={handleViewLeaderboard}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Home
