import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Icon } from "@iconify/react"
import {
  Users,
  Mail,
  Trophy,
  Calendar,
  School,
  Search,
  UserCheck,
  MapPin,
} from "lucide-react"
import PageContainer from "@/shared/components/PageContainer"
import { BREADCRUMBS } from "@/config/breadcrumbs"
import { useAuth } from "@/context/AuthContext"
import { ROLES } from "@/context/AuthContext"
import useTeams from "@/features/team/hooks/useTeams"
import useContests from "@/features/contest/hooks/useContests"

const MyTeamView = () => {
  const { t } = useTranslation("common")
  const navigate = useNavigate()
  const { user } = useAuth()
  const role = user?.role || "student"
  const { getMyTeam, loading: teamsLoading } = useTeams()
  const { contests, loading: contestsLoading } = useContests()
  const [myTeams, setMyTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedContestId, setSelectedContestId] = useState(null)

  // Fetch all teams for user
  useEffect(() => {
    const fetchMyTeams = async () => {
      setLoading(true)
      try {
        if (contests && contests.length > 0) {
          const teamsPromises = contests.map(async (contest) => {
            try {
              const team = await getMyTeam(contest.contestId || contest.id)
              if (team) {
                return { ...team, contest }
              }
              return null
            } catch (error) {
              console.error(
                `Error fetching team for contest ${contest.contestId}:`,
                error,
              )
              return null
            }
          })

          const teams = await Promise.all(teamsPromises)
          const validTeams = teams.filter((team) => team !== null)
          setMyTeams(validTeams)

          // Auto-select first contest if available
          if (validTeams.length > 0 && !selectedContestId) {
            setSelectedContestId(
              validTeams[0].contestId || validTeams[0].contest_id,
            )
          }
        }
      } catch (error) {
        console.error("Error fetching teams:", error)
      } finally {
        setLoading(false)
      }
    }

    if (user?.id && contests) {
      fetchMyTeams()
    }
  }, [user?.id, contests, getMyTeam])

  const selectedTeam = myTeams.find(
    (team) =>
      (team.contestId === selectedContestId ||
        team.contest_id === selectedContestId) &&
      (String(team.contestId) === String(selectedContestId) ||
        String(team.contest_id) === String(selectedContestId)),
  )

  if (loading || contestsLoading) {
    return (
      <PageContainer breadcrumb={BREADCRUMBS.TEAM}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">{t("common.loading")}</p>
          </div>
        </div>
      </PageContainer>
    )
  }

  // For mentor: show all teams or allow filtering by contest
  if (role === ROLES.MENTOR) {
    return (
      <PageContainer breadcrumb={BREADCRUMBS.TEAM}>
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-semibold text-[#2d3748] mb-2">
                  {t("team.myTeams")}
                </h2>
                <p className="text-sm text-[#7A7574]">
                  {myTeams.length > 0
                    ? t("team.youHaveTeams", {
                        count: myTeams.length,
                        plural: myTeams.length > 1 ? "s" : "",
                        contestCount: new Set(
                          myTeams.map((t) => t.contestId || t.contest_id),
                        ).size,
                        contestPlural:
                          new Set(
                            myTeams.map((t) => t.contestId || t.contest_id),
                          ).size > 1
                            ? "s"
                            : "",
                      })
                    : t("team.viewManageTeams")}
                </p>
              </div>
            </div>

            {/* Contest Filter */}
            {contests && contests.length > 0 && myTeams.length > 0 && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#2d3748] mb-2">
                  {t("team.filterByContest")}
                </label>
                <select
                  value={selectedContestId || ""}
                  onChange={(e) => setSelectedContestId(e.target.value || null)}
                  className="w-full px-4 py-2 border border-[#E5E5E5] rounded-[5px] focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
                >
                  <option value="">
                    {t("team.allContestsWithCount", {
                      count: myTeams.length,
                      plural: myTeams.length > 1 ? "s" : "",
                    })}
                  </option>
                  {contests
                    .filter((contest) =>
                      myTeams.some(
                        (team) =>
                          team.contestId ===
                            (contest.contestId || contest.id) ||
                          team.contest_id === (contest.contestId || contest.id),
                      ),
                    )
                    .map((contest) => {
                      const teamCount = myTeams.filter(
                        (team) =>
                          team.contestId ===
                            (contest.contestId || contest.id) ||
                          team.contest_id === (contest.contestId || contest.id),
                      ).length
                      return (
                        <option
                          key={contest.contestId || contest.id}
                          value={contest.contestId || contest.id}
                        >
                          {contest.name || contest.title}
                        </option>
                      )
                    })}
                </select>
              </div>
            )}

            {/* Teams List */}
            {myTeams.length > 0 ? (
              <div className="space-y-6">
                {(selectedContestId
                  ? myTeams.filter(
                      (team) =>
                        (team.contestId === selectedContestId ||
                          team.contest_id === selectedContestId) &&
                        (String(team.contestId) === String(selectedContestId) ||
                          String(team.contest_id) ===
                            String(selectedContestId)),
                    )
                  : myTeams
                ).map((team) => {
                  const contestId = team.contestId || team.contest_id
                  return (
                    <div
                      key={team.teamId || team.team_id}
                      className="border border-[#E5E5E5] rounded-[8px] p-6 bg-white"
                    >
                      {/* Team Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#ff8c5a] text-white flex items-center justify-center font-semibold text-xl shadow-md">
                              <Users size={32} />
                            </div>
                            <div>
                              <h4 className="text-2xl font-bold text-[#2d3748] mb-1">
                                {team.name}
                              </h4>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="p-3 bg-[#f9fafb] rounded-[5px]">
                              <p className="text-xs text-[#7A7574] mb-1">
                                {t("team.contest")}
                              </p>
                              <p className="font-semibold text-[#2d3748]">
                                {team.contest?.name ||
                                  team.contest?.title ||
                                  team.contestName ||
                                  "N/A"}
                              </p>
                            </div>
                            <div className="p-3 bg-[#f9fafb] rounded-[5px]">
                              <p className="text-xs text-[#7A7574] mb-1">
                                {t("team.members")}
                              </p>
                              <p className="font-semibold text-[#2d3748]">
                                {team.members?.length || 0} /{" "}
                                {team.contest?.teamMembersMax || "∞"}
                              </p>
                            </div>
                            <div className="p-3 bg-[#f9fafb] rounded-[5px]">
                              <div className="flex items-center gap-2 mb-1">
                                <UserCheck
                                  size={16}
                                  className="text-[#7A7574]"
                                />
                                <p className="text-xs text-[#7A7574]">
                                  {t("team.mentor")}
                                </p>
                              </div>
                              <p className="font-semibold text-[#2d3748]">
                                {team.mentorName || "N/A"}
                              </p>
                            </div>
                            <div className="p-3 bg-[#f9fafb] rounded-[5px]">
                              <div className="flex items-center gap-2 mb-1">
                                <School size={16} className="text-[#7A7574]" />
                                <p className="text-xs text-[#7A7574]">
                                  {t("team.school")}
                                </p>
                              </div>
                              <p className="font-semibold text-[#2d3748]">
                                {team.schoolName || "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => navigate(`/mentor-team/${contestId}`)}
                          className="px-4 py-2 bg-[#ff6b35] text-white rounded-[5px] hover:bg-[#ff5722] transition-colors text-sm font-medium flex items-center gap-2"
                        >
                          <Icon icon="mdi:pencil" width="18" />
                          {t("team.manageTeam")}
                        </button>
                      </div>

                      {/* Team Members */}
                      {team.members && team.members.length > 0 && (
                        <div className="mt-6">
                          <h5 className="text-lg font-semibold text-[#2d3748] mb-4">
                            {t("team.teamMembers")}
                          </h5>
                          <div className="space-y-3">
                            {team.members.map((member, index) => {
                              const memberName =
                                member.studentFullname ||
                                member.student_fullname ||
                                member.userFullname ||
                                member.user_fullname ||
                                member.user?.name ||
                                t("team.unknownMember")

                              const memberEmail =
                                member.studentEmail ||
                                member.student_email ||
                                member.userEmail ||
                                member.user_email ||
                                member.user?.email ||
                                ""

                              const memberInitial =
                                memberName?.charAt(0)?.toUpperCase() || "M"

                              return (
                                <div
                                  key={
                                    member.studentId ||
                                    member.student_id ||
                                    index
                                  }
                                  className="flex items-center justify-between p-4 bg-[#f9fafb] rounded-[5px] hover:bg-[#f3f4f6] transition-colors"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#ff8c5a] text-white flex items-center justify-center font-semibold shadow-sm">
                                      {memberInitial}
                                    </div>
                                    <div>
                                      <p className="font-semibold text-[#2d3748]">
                                        {memberName}
                                      </p>
                                      {memberEmail && (
                                        <div className="flex items-center gap-2 mt-1">
                                          <Mail
                                            size={14}
                                            className="text-[#7A7574]"
                                          />
                                          <p className="text-sm text-[#7A7574]">
                                            {memberEmail}
                                          </p>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium whitespace-nowrap">
                                    {t("team.active")}
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : selectedContestId ? (
              <div className="text-center py-12 border border-[#E5E5E5] rounded-[8px] bg-white">
                <Icon
                  icon="mdi:account-group-outline"
                  width="64"
                  className="text-[#E5E5E5] mx-auto mb-4"
                />
                <p className="text-[#7A7574] text-sm mb-4">
                  {t("team.noTeamForContest")}
                </p>
                <button
                  onClick={() => navigate(`/mentor-team/${selectedContestId}`)}
                  className="px-4 py-2 bg-[#ff6b35] text-white rounded-[5px] hover:bg-[#ff5722] transition-colors text-sm font-medium"
                >
                  {t("team.createTeam")}
                </button>
              </div>
            ) : (
              <div className="text-center py-12 border border-[#E5E5E5] rounded-[8px] bg-white">
                <Icon
                  icon="mdi:account-group-outline"
                  width="64"
                  className="text-[#E5E5E5] mx-auto mb-4"
                />
                <p className="text-[#7A7574] text-sm mb-4">
                  {t("team.noTeamsYet")}
                </p>
                {contests && contests.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-xs text-[#7A7574] mb-4">
                      {t("team.selectContestToCreate")}
                    </p>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {contests.map((contest) => (
                        <button
                          key={contest.contestId || contest.id}
                          onClick={() =>
                            navigate(
                              `/mentor-team/${contest.contestId || contest.id}`,
                            )
                          }
                          className="px-4 py-2 bg-[#ff6b35] text-white rounded-[5px] hover:bg-[#ff5722] transition-colors text-sm font-medium"
                        >
                          {contest.name || contest.title}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </PageContainer>
    )
  }

  // For student: show team information
  return (
    <PageContainer breadcrumb={BREADCRUMBS.TEAM}>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-[#2d3748] mb-2">
                {t("team.myTeams")}
              </h2>
              <p className="text-sm text-[#7A7574]">{t("team.viewTeamInfo")}</p>
            </div>
          </div>

          {myTeams.length > 0 ? (
            <div className="space-y-6">
              {myTeams.map((team) => (
                <div
                  key={team.teamId || team.team_id}
                  className="border border-[#E5E5E5] rounded-[8px] p-6 bg-white"
                >
                  {/* Team Header */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#ff8c5a] text-white flex items-center justify-center font-semibold text-xl shadow-md">
                          <Users size={32} />
                        </div>
                        <div>
                          <h4 className="text-2xl font-bold text-[#2d3748] mb-1">
                            {team.name}
                          </h4>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="p-3 bg-[#f9fafb] rounded-[5px]">
                          <div className="flex items-center gap-2 mb-1">
                            <Trophy size={16} className="text-[#7A7574]" />
                            <p className="text-xs text-[#7A7574]">
                              {t("team.contest")}
                            </p>
                          </div>
                          <p className="font-semibold text-[#2d3748]">
                            {team.contestName || "N/A"}
                          </p>
                          <button
                            className="px-2 py-1 mt-2 cursor-pointer bg-[#ff6b35] text-white rounded-[5px] hover:bg-[#ff5722] transition-colors text-sm font-medium"
                            onClick={() =>
                              navigate(`/contest-detail/${team.contestId}`)
                            }
                          >
                            {t("team.viewContest")}
                          </button>
                        </div>
                        <div className="p-3 bg-[#f9fafb] rounded-[5px]">
                          <div className="flex items-center gap-2 mb-1">
                            <Users size={16} className="text-[#7A7574]" />
                            <p className="text-xs text-[#7A7574]">
                              {t("team.members")}
                            </p>
                          </div>
                          <p className="font-semibold text-[#2d3748]">
                            {team.members?.length || 0} /{" "}
                            {team.contest?.teamMembersMax || "∞"}
                          </p>
                        </div>
                        <div className="p-3 bg-[#f9fafb] rounded-[5px]">
                          <div className="flex items-center gap-2 mb-1">
                            <UserCheck size={16} className="text-[#7A7574]" />
                            <p className="text-xs text-[#7A7574]">
                              {t("team.mentor")}
                            </p>
                          </div>
                          <p className="font-semibold text-[#2d3748]">
                            {team.mentorName || "N/A"}
                          </p>
                        </div>
                        <div className="p-3 bg-[#f9fafb] rounded-[5px]">
                          <div className="flex items-center gap-2 mb-1">
                            <School size={16} className="text-[#7A7574]" />
                            <p className="text-xs text-[#7A7574]">
                              {t("team.school")}
                            </p>
                          </div>
                          <p className="font-semibold text-[#2d3748]">
                            {team.schoolName || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Team Members */}
                  {team.members && team.members.length > 0 && (
                    <div className="mt-6">
                      <h5 className="text-lg font-semibold text-[#2d3748] mb-4">
                        {t("team.teamMembers")}
                      </h5>
                      <div className="space-y-3">
                        {team.members.map((member, index) => {
                          const memberName =
                            member.studentFullname || t("team.unknownMember")

                          const memberEmail = member.studentEmail || ""

                          const memberInitial =
                            memberName?.charAt(0)?.toUpperCase() || "M"

                          return (
                            <div
                              key={member.studentId || index}
                              className="flex items-center justify-between p-4 bg-[#f9fafb] rounded-[5px] hover:bg-[#f3f4f6] transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#ff8c5a] text-white flex items-center justify-center font-semibold shadow-sm">
                                  {memberInitial}
                                </div>
                                <div>
                                  <p className="font-semibold text-[#2d3748]">
                                    {memberName}
                                  </p>
                                  {memberEmail && (
                                    <div className="flex items-center gap-2 mt-1">
                                      <Mail
                                        size={14}
                                        className="text-[#7A7574]"
                                      />
                                      <p className="text-sm text-[#7A7574]">
                                        {memberEmail}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium whitespace-nowrap">
                                {t("team.active")}
                              </span>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-[#E5E5E5] rounded-[8px]">
              <Icon
                icon="mdi:account-group-outline"
                width="64"
                className="text-[#E5E5E5] mx-auto mb-4"
              />
              <p className="text-[#7A7574] text-sm mb-4">
                {t("team.notMemberOfAnyTeam")}
              </p>
              <p className="text-xs text-[#7A7574]">{t("team.joinTeamInfo")}</p>
            </div>
          )}
        </div>
      </div>
    </PageContainer>
  )
}

export default MyTeamView
