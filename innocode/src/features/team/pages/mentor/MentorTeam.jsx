import React, { useEffect, useState, useMemo } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import { Icon } from "@iconify/react"
import { Users, Mail, UserPlus } from "lucide-react"
import PageContainer from "@/shared/components/PageContainer"
import { createBreadcrumbWithPaths, BREADCRUMBS } from "@/config/breadcrumbs"
import useContestDetail from "@/features/contest/hooks/useContestDetail"
import { useAuth } from "@/context/AuthContext"
import useMentors from "../../../../shared/hooks/useMentors"
import { sendTeamInviteEmail } from "@/shared/services/emailService"
import {
  useGetMyTeamQuery,
  useCreateTeamMutation,
  useUpdateTeamMutation,
} from "@/services/teamApi"
import { useGetStudentsBySchoolIdQuery } from "@/services/studentApi"
import {
  useGetTeamInvitesQuery,
  useInviteStudentMutation,
} from "@/services/teamInviteApi"
import {
  useDeleteTeamMemberMutation,
  useDeleteTeamMutation,
} from "../../../../services/teamApi"
import toast from "react-hot-toast"
import BaseModal from "@/shared/components/BaseModal"
import translateApiError from "@/shared/utils/translateApiError"

const MentorTeam = () => {
  const { t } = useTranslation("common")
  const { contestId } = useParams()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("create") // 'create' or 'myTeam'
  const [teamName, setTeamName] = useState("")
  const [schoolId, setSchoolId] = useState(null)
  const [mentorId, setMentorId] = useState(null)
  const [errors, setErrors] = useState({})
  const [inviteError, setInviteError] = useState("")
  const [invitedStudentIds, setInvitedStudentIds] = useState(new Set()) // Track invited students
  const { contest, loading: contestLoading } = useContestDetail(contestId)
  const [deleteTeam, { isLoading: deletingTeam }] = useDeleteTeamMutation()
  const [deleteTeamMember, { isLoading: deletingTeamMember }] =
    useDeleteTeamMemberMutation()
  const [memberToDelete, setMemberToDelete] = useState(null)
  const [showDeleteTeamConfirm, setShowDeleteTeamConfirm] = useState(false)
  const [showDeleteMemberConfirm, setShowDeleteMemberConfirm] = useState(false)
  const [isEditingTeamName, setIsEditingTeamName] = useState(false)
  const [editedTeamName, setEditedTeamName] = useState("")
  const {
    mentors,
    loading: mentorLoading,
    error: mentorError,
    getMentorByUserId,
  } = useMentors()
  const { user } = useAuth()

  const breadcrumbData = contest
    ? createBreadcrumbWithPaths("CONTEST_DETAIL", contest.name || contest.title)
    : { items: BREADCRUMBS.NOT_FOUND, paths: ["/"] }

  // RTK Query hooks
  const {
    data: myTeamsData,
    isLoading: myTeamLoading,
    refetch: refetchMyTeam,
  } = useGetMyTeamQuery(undefined, {
    skip: !user?.id,
  })

  const [createTeam, { isLoading: creatingTeam }] = useCreateTeamMutation()
  const [updateTeam, { isLoading: updatingTeam }] = useUpdateTeamMutation()

  // Filter myTeam by contestId
  const myTeam = useMemo(() => {
    if (!myTeamsData || !contestId) return null
    return myTeamsData.find((team) => {
      const teamContestId = team.contestId || team.contest_id
      return (
        String(teamContestId) === String(contestId) ||
        teamContestId === contestId ||
        teamContestId === parseInt(contestId)
      )
    })
  }, [myTeamsData, contestId])

  const teamId = myTeam?.teamId || myTeam?.team_id || myTeam?.id

  // Fetch team invites
  const {
    data: invitesData = [],
    isLoading: loadingInvites,
    refetch: refetchInvites,
  } = useGetTeamInvitesQuery(teamId, {
    skip: !teamId || activeTab !== "myTeam",
  })

  // Filter pending invites
  const pendingInvites = useMemo(() => {
    if (!Array.isArray(invitesData)) return []
    return invitesData.filter((invite) => invite.status === "pending")
  }, [invitesData])

  // Fetch students by schoolId
  const { data: studentsData = [], isLoading: loadingStudents } =
    useGetStudentsBySchoolIdQuery(schoolId, {
      skip: !schoolId || activeTab !== "myTeam" || !myTeam,
    })

  const [inviteStudent, { isLoading: invitingStudent }] =
    useInviteStudentMutation()

  // Reset invited students when contest changes
  useEffect(() => {
    setInvitedStudentIds(new Set())
  }, [contestId])

  // Set default tab to 'myTeam' if mentor already has a team
  useEffect(() => {
    if (myTeam && activeTab === "create") {
      setActiveTab("myTeam")
    }
  }, [myTeam, activeTab])
  useEffect(() => {
    if (user?.id) {
      getMentorByUserId(user?.id)
    }
  }, [user?.id, getMentorByUserId])

  // Auto-set mentorId and schoolId from fetched mentor
  useEffect(() => {
    if (mentors && mentors.length > 0) {
      // API returns array with response object: [{data: [...], ...}]
      const response = mentors[0]
      // Get actual mentor from response.data[0]
      const mentorData =
        response?.data && Array.isArray(response.data) ? response.data[0] : null

      if (mentorData) {
        // Handle both camelCase and snake_case field names
        const mentorIdValue = mentorData?.mentorId || mentorData?.mentor_id
        const schoolIdValue = mentorData?.schoolId || mentorData?.school_id

        if (mentorIdValue) {
          setMentorId(mentorIdValue)
        }
        if (schoolIdValue) {
          setSchoolId(schoolIdValue)
        }
      }
    }
  }, [mentors])

  // Update invitedStudentIds when pending invites change
  useEffect(() => {
    if (pendingInvites.length > 0) {
      const pendingStudentIds = new Set(
        pendingInvites.map((invite) => invite.studentId),
      )
      setInvitedStudentIds((prev) => {
        const updated = new Set(prev)
        pendingStudentIds.forEach((id) => updated.add(id))
        return updated
      })
    }
  }, [pendingInvites])

  // Update invitedStudentIds when myTeam changes (remove students who became members)
  useEffect(() => {
    if (myTeam && myTeam.members) {
      const memberIds = new Set(
        (myTeam.members || []).map((m) => m.studentId || m.student_id),
      )
      // Remove students from invited list if they became members
      setInvitedStudentIds((prev) => {
        const updated = new Set(prev)
        memberIds.forEach((id) => updated.delete(id))
        return updated
      })
    }
  }, [myTeam])

  // Filter available students
  const { students, allStudents } = useMemo(() => {
    if (!Array.isArray(studentsData)) {
      return { students: [], allStudents: [] }
    }

    // Store all students for lookup (e.g., in pending invites)
    const allStudentsList = studentsData

    // Filter out students who are already members, have been invited, or have pending invites
    const existingMemberIds = (myTeam?.members || []).map(
      (m) => m.studentId || m.student_id,
    )
    const pendingInviteStudentIds = new Set(
      pendingInvites.map((invite) => invite.studentId),
    )
    const availableStudents = allStudentsList.filter(
      (s) =>
        !existingMemberIds.includes(s.studentId) &&
        !invitedStudentIds.has(s.studentId) &&
        !pendingInviteStudentIds.has(s.studentId),
    )

    return { students: availableStudents, allStudents: allStudentsList }
  }, [studentsData, myTeam, invitedStudentIds, pendingInvites])

  const handleCreateTeam = async () => {
    setErrors({})
    const newErrors = {}

    if (!teamName.trim()) {
      newErrors.teamName = t("team.teamNameRequired")
    }
    if (!schoolId) {
      newErrors.submit = t("team.schoolInfoMissing")
    }
    if (!mentorId) {
      newErrors.submit = t("team.mentorInfoMissing")
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      // Get mentor data from response structure
      let schoolIdValue = schoolId

      if (mentors && mentors.length > 0) {
        const response = mentors[0]
        const mentorData =
          response?.data && Array.isArray(response.data)
            ? response.data[0]
            : null

        if (mentorData) {
          schoolIdValue = mentorData?.schoolId || mentorData?.school_id
        }
      }

      const requestBody = {
        name: teamName.trim(),
        contestId: String(contestId),
        schoolId: String(schoolIdValue),
      }

      await createTeam(requestBody).unwrap()

      // Refetch my team to get updated data
      await refetchMyTeam()

      // Switch to My Team tab after successful creation
      setActiveTab("myTeam")
      setTeamName("")
    } catch (error) {
      const errorMessage =
        translateApiError(error, "errors") || t("team.failedToCreateTeam")
      setErrors({ submit: errorMessage })
    }
  }

  // Handle invite member by student
  const handleInviteStudent = async (student) => {
    if (!student || !student.studentId) {
      setInviteError(t("team.invalidStudent"))
      return
    }

    if (!student.userEmail) {
      setInviteError(t("team.studentEmailMissing"))
      return
    }

    if (!teamId) {
      setInviteError(t("team.teamIdNotFound"))
      return
    }

    setInviteError("")

    try {
      // Call RTK Query mutation to invite member
      const response = await inviteStudent({
        teamId,
        data: {
          studentId: student.studentId,
          inviteeEmail: student.userEmail,
          ttlDays: 60,
        },
      }).unwrap()

      // Extract data from response
      const inviteData = response?.data || response || {}
      const token = inviteData.token || response?.token
      const teamNameValue = inviteData.teamName || myTeam?.name || "Team"
      const contestName =
        inviteData.contestName || contest?.name || contest?.title || "Contest"
      const mentorName = user?.name || "Mentor"
      const studentEmail = student.userEmail

      if (token && studentEmail) {
        // Generate accept and decline URLs
        // Format: /team-invite?token={token}&email={email}&action=accept|decline
        const baseUrl =
          import.meta.env.VITE_FRONTEND_URL || window.location.origin
        const acceptUrl = `${baseUrl}/team-invite?token=${encodeURIComponent(
          token,
        )}&email=${encodeURIComponent(studentEmail)}&action=accept`
        const declineUrl = `${baseUrl}/team-invite?token=${encodeURIComponent(
          token,
        )}&email=${encodeURIComponent(studentEmail)}&action=decline`

        // Send invitation email
        try {
          await sendTeamInviteEmail({
            toEmail: studentEmail,
            teamName: teamNameValue,
            mentorName: mentorName,
            contestName: contestName,
            acceptUrl: acceptUrl,
            declineUrl: declineUrl,
          })
        } catch (emailError) {
          // Don't throw error - invitation was created successfully, just email failed
        }
      }

      // Add student to invited list
      setInvitedStudentIds((prev) => new Set([...prev, student.studentId]))

      // Refetch data to get updated team and invites
      await Promise.all([refetchMyTeam(), refetchInvites()])
    } catch (error) {
      // Use translateApiError to get translated error message
      const errorMessage =
        translateApiError(error, "errors") || t("team.failedToSendInvitation")

      // Special handling for CONFLICT - refresh team data to get updated members
      if (error?.data?.errorCode === "CONFLICT" || error?.status === 409) {
        await refetchMyTeam()
      }

      setInviteError(errorMessage)
    }
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
  const handleDeleteTeam = async (onClose) => {
    if (!teamId) return

    try {
      await deleteTeam(teamId).unwrap()
      // Close modal first
      if (onClose) onClose()
      toast.success(t("team.teamDeletedSuccess"))
      // Refetch to update UI
      await refetchMyTeam()
    } catch (error) {
      // Close modal even on error
      if (onClose) onClose()
      const errorMessage =
        translateApiError(error, "errors") || t("team.failedToDeleteTeam")
      toast.error(errorMessage)
      setErrors({ submit: errorMessage })
    }
  }

  const handleDeleteTeamMember = async (studentId, onClose) => {
    if (!teamId || !studentId) return

    try {
      await deleteTeamMember({ teamId, studentId }).unwrap()
      // Close modal first
      if (onClose) onClose()
      toast.success(t("team.memberRemovedSuccess"))
      // Refetch to update UI
      await refetchMyTeam()
      setMemberToDelete(null)
    } catch (error) {
      // Close modal even on error
      if (onClose) onClose()
      const errorMessage =
        translateApiError(error, "errors") || t("team.failedToRemoveMember")
      toast.error(errorMessage)
      setInviteError(errorMessage)
    }
  }

  // Handle edit team name
  const handleStartEditTeamName = () => {
    setEditedTeamName(myTeam?.name || "")
    setIsEditingTeamName(true)
  }

  const handleCancelEditTeamName = () => {
    setIsEditingTeamName(false)
    setEditedTeamName("")
  }

  const handleSaveTeamName = async () => {
    if (!teamId || !editedTeamName.trim()) {
      toast.error(t("team.teamNameCannotBeEmpty"))
      return
    }

    if (editedTeamName.trim() === myTeam?.name) {
      setIsEditingTeamName(false)
      return
    }

    try {
      await updateTeam({
        teamId,
        data: { name: editedTeamName.trim() },
      }).unwrap()
      toast.success(t("team.teamNameUpdatedSuccess"))
      setIsEditingTeamName(false)
      // Refetch to update UI
      await refetchMyTeam()
    } catch (error) {
      const errorMessage =
        translateApiError(error, "errors") || t("team.failedToUpdateTeamName")
      toast.error(errorMessage)
      setErrors({ submit: errorMessage })
    }
  }
  const registrationClosed = isRegistrationClosed()

  if (contestLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbData.items}
        breadcrumbPaths={breadcrumbData.paths}
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">{t("common.loading")}</p>
          </div>
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
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-[#E5E5E5] rounded-[8px] overflow-hidden">
          {/* Tabs */}
          <div className="flex border-b border-[#E5E5E5]">
            {!myTeam && !registrationClosed && (
              <button
                onClick={() => setActiveTab("create")}
                className={`flex-1 px-6 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  activeTab === "create"
                    ? "bg-[#ff6b35] text-white"
                    : "text-[#7A7574] hover:bg-[#f9fafb]"
                }`}
              >
                <Icon icon="mdi:plus-circle" width="18" />
                {t("team.createTeam")}
              </button>
            )}
            {myTeam && (
              <button
                onClick={() => setActiveTab("myTeam")}
                className={`flex-1 px-6 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  activeTab === "myTeam"
                    ? "bg-[#ff6b35] text-white"
                    : "text-[#7A7574] hover:bg-[#f9fafb]"
                }`}
              >
                <Icon icon="mdi:account-group" width="18" />
                {t("team.myTeam")}
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {!myTeam && registrationClosed && (
              <div className="text-center py-12">
                <Icon
                  icon="mdi:lock"
                  width="64"
                  className="text-[#E5E5E5] mx-auto mb-4"
                />
                <h3 className="text-xl font-semibold text-[#2d3748] mb-2">
                  {t("team.registrationClosed")}
                </h3>
                <p className="text-[#7A7574] text-sm mb-4">
                  {t("team.registrationClosedDesc")}
                </p>
                {contest.registrationEnd && (
                  <p className="text-xs text-[#7A7574]">
                    {t("team.registrationClosedOn")}{" "}
                    {new Date(contest.registrationEnd).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
            {activeTab === "create" && !registrationClosed && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#2d3748] mb-4">
                    {t("team.createNewTeam")}
                  </h3>
                  <p className="text-sm text-[#7A7574] mb-6">
                    {t("team.createTeamDesc")}
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Team Name */}
                  <div>
                    <label className="block text-sm font-medium text-[#2d3748] mb-2">
                      {t("team.teamName")}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder={t("team.enterTeamName")}
                      className={`w-full px-4 py-2 border rounded-[5px] focus:outline-none focus:ring-2 focus:ring-[#ff6b35] ${
                        errors.teamName ? "border-red-500" : "border-[#E5E5E5]"
                      }`}
                    />
                    {errors.teamName && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors.teamName}
                      </p>
                    )}
                  </div>

                  {errors.submit && (
                    <div className="bg-red-50 border border-red-200 rounded-[5px] p-3">
                      <p className="text-red-600 text-sm">{errors.submit}</p>
                    </div>
                  )}

                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={() => navigate(`/contest-detail/${contestId}`)}
                      className="button-white flex-1"
                    >
                      {t("buttons.cancel")}
                    </button>
                    <button
                      onClick={handleCreateTeam}
                      disabled={creatingTeam}
                      className="button-orange flex-1 flex items-center justify-center gap-2"
                    >
                      {creatingTeam ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          {t("team.creating")}
                        </>
                      ) : (
                        <>
                          <Icon icon="mdi:check" width="18" />
                          {t("team.createTeam")}
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "myTeam" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#2d3748] mb-4">
                    {t("team.myTeam")}
                  </h3>
                  <p className="text-sm text-[#7A7574] mb-6">
                    {t("team.manageTeamInfo")}
                  </p>
                </div>

                {myTeam ? (
                  <div className="space-y-6">
                    {/* Team Info Card */}
                    <div className="border border-[#E5E5E5] rounded-[8px] p-6 bg-white">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#ff8c5a] text-white flex items-center justify-center font-semibold text-xl shadow-md">
                              <Users size={32} />
                            </div>
                            <div className="flex-1">
                              {isEditingTeamName ? (
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={editedTeamName}
                                    onChange={(e) =>
                                      setEditedTeamName(e.target.value)
                                    }
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        handleSaveTeamName()
                                      } else if (e.key === "Escape") {
                                        handleCancelEditTeamName()
                                      }
                                    }}
                                    className="text-2xl font-bold text-[#2d3748] px-2 py-1 border border-[#ff6b35] rounded-[5px] focus:outline-none focus:ring-2 focus:ring-[#ff6b35] flex-1"
                                    autoFocus
                                    disabled={updatingTeam}
                                  />
                                  <button
                                    onClick={handleSaveTeamName}
                                    disabled={
                                      updatingTeam || !editedTeamName.trim()
                                    }
                                    className="p-2 text-green-600 hover:bg-green-50 rounded-[5px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Save"
                                  >
                                    <Icon icon="mdi:check" width="20" />
                                  </button>
                                  <button
                                    onClick={handleCancelEditTeamName}
                                    disabled={updatingTeam}
                                    className="p-2 text-gray-600 hover:bg-gray-50 rounded-[5px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    title="Cancel"
                                  >
                                    <Icon icon="mdi:close" width="20" />
                                  </button>
                                </div>
                              ) : (
                                <div className="flex items-center gap-2">
                                  <h4 className="text-2xl font-bold text-[#2d3748] mb-1">
                                    {myTeam.name}
                                  </h4>
                                  <button
                                    onClick={handleStartEditTeamName}
                                    disabled={updatingTeam}
                                    className="p-1 text-[#7A7574] hover:text-[#ff6b35] hover:bg-orange-50 rounded-[5px] transition-colors"
                                    title={t("team.editTeamName")}
                                  >
                                    <Icon
                                      icon="mdi:pencil-outline"
                                      width="18"
                                    />
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="p-3 bg-[#f9fafb] rounded-[5px]">
                              <p className="text-xs text-[#7A7574] mb-1">
                                {t("team.contest")}
                              </p>
                              <p className="font-semibold text-[#2d3748]">
                                {contest?.name || contest?.title || "N/A"}
                              </p>
                            </div>
                            <div className="p-3 bg-[#f9fafb] rounded-[5px]">
                              <p className="text-xs text-[#7A7574] mb-1">
                                {t("team.members")}
                              </p>
                              <p className="font-semibold text-[#2d3748]">
                                {myTeam.members?.length || 0} /{" "}
                                {contest?.teamMembersMax || "∞"}
                              </p>
                            </div>
                          </div>
                        </div>
                        <button
                          onClick={() => setShowDeleteTeamConfirm(true)}
                          disabled={deletingTeam}
                          className="flex items-center gap-2 px-4 py-2 button-red hover:bg-red-50 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Icon icon="mdi:delete-outline" width="18" />
                          {t("team.deleteTeam")}
                        </button>
                      </div>
                    </div>

                    {/* Team Members and Pending Invitations - Side by Side */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Team Members Section */}
                      <div className="border border-[#E5E5E5] rounded-[8px] p-6 bg-white">
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="text-lg font-semibold text-[#2d3748]">
                            {t("team.teamMembers")}
                          </h5>
                        </div>

                        {myTeam.members && myTeam.members.length > 0 ? (
                          <div className="space-y-3">
                            {myTeam.members.map((member, index) => {
                              // Handle different field name formats (camelCase and snake_case)
                              // API returns: studentFullname, studentEmail
                              const memberName =
                                member.studentFullname ||
                                member.student_fullname ||
                                member.userFullname ||
                                member.user_fullname ||
                                member.user?.name ||
                                member.user?.fullName ||
                                member.name ||
                                t("team.unknownMember")

                              const memberEmail =
                                member.studentEmail ||
                                member.student_email ||
                                member.userEmail ||
                                member.user_email ||
                                member.user?.email ||
                                member.email ||
                                ""

                              const memberInitial =
                                member.studentFullname
                                  ?.charAt(0)
                                  ?.toUpperCase() ||
                                member.user?.name?.charAt(0)?.toUpperCase() ||
                                member.user?.fullName
                                  ?.charAt(0)
                                  ?.toUpperCase() ||
                                memberName?.charAt(0)?.toUpperCase() ||
                                "M"

                              return (
                                <div
                                  key={
                                    member.studentId ||
                                    member.student_id ||
                                    index
                                  }
                                  className="flex items-start p-4 bg-[#f9fafb] rounded-[5px] hover:bg-[#f3f4f6] transition-colors gap-3"
                                >
                                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#ff8c5a] text-white flex items-center justify-center font-semibold shadow-sm">
                                    {memberInitial}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between gap-2">
                                      <p className="font-semibold text-[#2d3748] truncate">
                                        {memberName}
                                      </p>
                                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium whitespace-nowrap">
                                        {t("team.active")}
                                      </span>
                                    </div>
                                    {memberEmail && (
                                      <div className="flex items-center justify-between gap-2 mt-1">
                                        <div className="flex items-center gap-2 min-w-0">
                                          <Mail
                                            size={14}
                                            className="text-[#7A7574] flex-shrink-0"
                                          />
                                          <p className="text-sm text-[#7A7574] truncate">
                                            {memberEmail}
                                          </p>
                                        </div>
                                        <button
                                          onClick={() => {
                                            setMemberToDelete(member)
                                            setShowDeleteMemberConfirm(true)
                                          }}
                                          disabled={deletingTeamMember}
                                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-[5px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                                          title={t("team.removeMemberTitle")}
                                        >
                                          <Icon
                                            icon="mdi:delete-outline"
                                            width="18"
                                          />
                                        </button>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Users
                              size={48}
                              className="text-[#E5E5E5] mx-auto mb-3"
                            />
                            <p className="text-[#7A7574] text-sm mb-4">
                              {t("team.noMembersYet")}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Pending Student Invitations Section */}
                      <div className="border border-[#E5E5E5] rounded-[8px] p-6 bg-white">
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="text-lg font-semibold text-[#2d3748]">
                            {t("team.pendingStudentInvitations")}
                          </h5>
                          {loadingInvites && (
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#ff6b35] border-t-transparent"></div>
                          )}
                        </div>

                        {pendingInvites.length > 0 ? (
                          <div className="space-y-3">
                            {pendingInvites.map((invite) => {
                              // Try to get student info from invite object first
                              const studentNameFromInvite =
                                invite.student?.userFullname ||
                                invite.student?.user_fullname ||
                                invite.student?.name ||
                                invite.studentFullname ||
                                invite.student_fullname ||
                                invite.studentName ||
                                invite.student_name ||
                                null

                              // If not in invite, try to find in allStudents list (not filtered)
                              const studentInfo = allStudents.find(
                                (s) => s.studentId === invite.studentId,
                              )

                              // Get student name with priority: invite object > students list > fallback
                              const studentName =
                                studentNameFromInvite ||
                                studentInfo?.userFullname ||
                                studentInfo?.user_fullname ||
                                studentInfo?.name ||
                                t("team.unknownStudent")

                              const studentEmail =
                                invite.inviteeEmail ||
                                invite.invitee_email ||
                                studentInfo?.userEmail ||
                                studentInfo?.user_email ||
                                t("team.noEmail")

                              const studentInitial =
                                studentName.charAt(0).toUpperCase() || "S"

                              return (
                                <div
                                  key={invite.inviteId}
                                  className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-[5px]"
                                >
                                  <div className="flex items-center gap-3 flex-1">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 text-white flex items-center justify-center font-semibold shadow-sm">
                                      {studentInitial}
                                    </div>
                                    <div className="flex-1">
                                      <p className="font-semibold text-[#2d3748]">
                                        {studentName}
                                      </p>
                                      <div className="flex items-center gap-2 mt-1">
                                        <Mail
                                          size={14}
                                          className="text-[#7A7574]"
                                        />
                                        <p className="text-sm text-[#7A7574]">
                                          {studentEmail}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium whitespace-nowrap">
                                    {t("team.pending")}
                                  </span>
                                </div>
                              )
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <Mail
                              size={48}
                              className="text-[#E5E5E5] mx-auto mb-3"
                            />
                            <p className="text-[#7A7574] text-sm">
                              {t("team.noPendingInvitations")}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Available Students to Invite Section */}
                    <div className="border border-[#E5E5E5] rounded-[8px] p-6 bg-white">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="text-lg font-semibold text-[#2d3748]">
                          {t("team.availableStudents")}
                        </h5>
                      </div>

                      {inviteError && (
                        <div className="mb-4 bg-red-50 border border-red-200 rounded-[5px] p-3 flex items-start justify-between gap-2">
                          <p className="text-red-600 text-sm flex-1">
                            {inviteError}
                          </p>
                          <button
                            onClick={() => setInviteError("")}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            aria-label="Close error message"
                          >
                            <Icon icon="mdi:close" width="20" />
                          </button>
                        </div>
                      )}

                      {loadingStudents ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="flex items-center gap-2">
                            <div className="animate-spin rounded-full h-6 w-6 border-2 border-[#ff6b35] border-t-transparent"></div>
                            <span className="text-sm text-[#7A7574]">
                              {t("team.loadingStudents")}
                            </span>
                          </div>
                        </div>
                      ) : students.length > 0 ? (
                        <div className="space-y-3">
                          {students.map((student) => (
                            <div
                              key={student.studentId}
                              className="flex items-center justify-between p-4 bg-[#f9fafb] rounded-[5px] hover:bg-[#f3f4f6] transition-colors"
                            >
                              <div className="flex items-center gap-3 flex-1">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#ff8c5a] text-white flex items-center justify-center font-semibold shadow-sm">
                                  {student.userFullname
                                    ?.charAt(0)
                                    ?.toUpperCase() || "S"}
                                </div>
                                <div className="flex-1">
                                  <p className="font-semibold text-[#2d3748]">
                                    {student.userFullname ||
                                      t("team.unknownStudent")}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Mail
                                      size={14}
                                      className="text-[#7A7574]"
                                    />
                                    <p className="text-sm text-[#7A7574]">
                                      {student.userEmail || t("team.noEmail")}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => handleInviteStudent(student)}
                                disabled={invitingStudent}
                                className="flex items-center gap-2 px-4 py-2 bg-[#ff6b35] text-white rounded-[5px] hover:bg-[#ff5722] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {invitingStudent ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    {t("team.inviting")}
                                  </>
                                ) : (
                                  <>
                                    <UserPlus size={18} />
                                    {t("team.invite")}
                                  </>
                                )}
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Users
                            size={48}
                            className="text-[#E5E5E5] mx-auto mb-3"
                          />
                          <p className="text-[#7A7574] text-sm">
                            {loadingStudents
                              ? t("team.loadingStudents")
                              : t("team.noAvailableStudents")}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Icon
                      icon="mdi:account-group-outline"
                      width="64"
                      className="text-[#E5E5E5] mx-auto mb-4"
                    />
                    <p className="text-[#7A7574] text-sm">
                      {t("team.noTeamFound")}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Team Confirmation Modal */}
      <BaseModal
        isOpen={showDeleteTeamConfirm}
        onClose={() => setShowDeleteTeamConfirm(false)}
        title={t("team.confirmDeleteTeam")}
        size="sm"
        footer={
          <>
            <button
              className="button-white"
              onClick={() => setShowDeleteTeamConfirm(false)}
              disabled={deletingTeam}
            >
              {t("buttons.cancel")}
            </button>
            <button
              className="button-red"
              onClick={() =>
                handleDeleteTeam(() => setShowDeleteTeamConfirm(false))
              }
              disabled={deletingTeam}
            >
              {deletingTeam ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent inline-block mr-2"></div>
                  {t("team.deleting")}
                </>
              ) : (
                t("team.deleteTeam")
              )}
            </button>
          </>
        }
      >
        <p
          className="text-[#7A7574]"
          dangerouslySetInnerHTML={{
            __html: t("team.confirmDeleteTeamDesc", {
              teamName: myTeam?.name || "",
            }),
          }}
        />
      </BaseModal>

      {/* Delete Member Confirmation Modal */}
      <BaseModal
        isOpen={showDeleteMemberConfirm}
        onClose={() => {
          setShowDeleteMemberConfirm(false)
          setMemberToDelete(null)
        }}
        title={t("team.confirmRemoveMember")}
        size="sm"
        footer={
          <>
            <button
              className="button-white"
              onClick={() => {
                setShowDeleteMemberConfirm(false)
                setMemberToDelete(null)
              }}
              disabled={deletingTeamMember}
            >
              {t("buttons.cancel")}
            </button>
            <button
              className="button-red"
              onClick={() => {
                if (memberToDelete) {
                  const studentId =
                    memberToDelete.studentId || memberToDelete.student_id
                  handleDeleteTeamMember(studentId, () => {
                    setShowDeleteMemberConfirm(false)
                    setMemberToDelete(null)
                  })
                }
              }}
              disabled={deletingTeamMember}
            >
              {deletingTeamMember ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent inline-block mr-2"></div>
                  {t("team.removing")}
                </>
              ) : (
                t("team.removeMember")
              )}
            </button>
          </>
        }
      >
        <p
          className="text-[#7A7574]"
          dangerouslySetInnerHTML={{
            __html: t("team.confirmRemoveMemberDesc", {
              memberName:
                memberToDelete?.studentFullname ||
                memberToDelete?.student_fullname ||
                memberToDelete?.userFullname ||
                memberToDelete?.user_fullname ||
                memberToDelete?.name ||
                t("team.unknownMember"),
            }),
          }}
        />
      </BaseModal>
    </PageContainer>
  )
}

export default MentorTeam
