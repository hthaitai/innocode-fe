import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Icon } from "@iconify/react";
import { Users, Mail, UserPlus } from "lucide-react";
import PageContainer from "@/shared/components/PageContainer";
import { createBreadcrumbWithPaths, BREADCRUMBS } from "@/config/breadcrumbs";
import useContestDetail from "@/features/contest/hooks/useContestDetail";
import useTeams from "@/features/team/hooks/useTeams";
import { useAuth } from "@/context/AuthContext";
import useMentors from "../../../../shared/hooks/useMentors";
import { teamMemberApi } from "@/api/teamMemberApi";
import { studentApi } from "@/api/studentApi";
import { teamInviteApi } from "@/api/teamInviteApi";

const MentorTeam = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("create"); // 'create' or 'myTeam'
  const [teamName, setTeamName] = useState("");
  const [schoolId, setSchoolId] = useState(null);
  const [mentorId, setMentorId] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [invitingStudentId, setInvitingStudentId] = useState(null);
  const [inviteError, setInviteError] = useState("");
  const { contest, loading: contestLoading } = useContestDetail(contestId);
  const { teams, loading: teamsLoading, addTeam, getMyTeam } = useTeams();
  const {
    mentors,
    loading: mentorLoading,
    error: mentorError,
    getMentorByUserId,
  } = useMentors();
  const { user } = useAuth();

  const breadcrumbData = contest
    ? createBreadcrumbWithPaths("CONTEST_DETAIL", contest.name || contest.title)
    : { items: BREADCRUMBS.NOT_FOUND, paths: ["/"] };

  // State để lưu myTeam từ API
  const [myTeam, setMyTeam] = useState(null);

  // Gọi API getMyTeam khi component mount hoặc contestId thay đổi
  useEffect(() => {
    const fetchMyTeam = async () => {
      try {
        const teamData = await getMyTeam();
        console.log("🔍 getMyTeam result in MentorTeam:", teamData);

        // Kiểm tra nếu team thuộc contest hiện tại
        if (teamData) {
          const teamContestId = teamData.contestId || teamData.contest_id;
          console.log(
            "🔍 teamContestId:",
            teamContestId,
            "contestId:",
            contestId
          );

          if (
            teamContestId === contestId ||
            teamContestId === parseInt(contestId)
          ) {
            console.log("✅ Setting myTeam:", teamData);
            setMyTeam(teamData);
          } else {
            console.log("❌ Team contestId does not match");
            setMyTeam(null);
          }
        } else {
          console.log("❌ No team data returned");
          setMyTeam(null);
        }
      } catch (error) {
        console.error("❌ Error fetching my team:", error);
        setMyTeam(null);
      }
    };

    if (contestId && user?.id) {
      fetchMyTeam();
    }
  }, [contestId, getMyTeam, user?.id]);

  // Set default tab to 'myTeam' if mentor already has a team
  useEffect(() => {
    if (myTeam && activeTab === "create") {
      setActiveTab("myTeam");
    }
  }, [myTeam, activeTab]);
  useEffect(() => {
    if (user?.id) {
      getMentorByUserId(user?.id);
    }
  }, [user?.id, getMentorByUserId]);

  // Auto-set mentorId and schoolId from fetched mentor
  useEffect(() => {
    console.log("🔍 Mentors data:", mentors);
    if (mentors && mentors.length > 0) {
      // API returns array with response object: [{data: [...], ...}]
      const response = mentors[0];
      // Get actual mentor from response.data[0]
      const mentorData =
        response?.data && Array.isArray(response.data)
          ? response.data[0]
          : null;

      console.log("🔍 Response object:", response);
      console.log("🔍 Actual mentor:", mentorData);
      console.log("🔍 My team:", myTeam);
      if (mentorData) {
        // Handle both camelCase and snake_case field names
        const mentorIdValue = mentorData?.mentorId || mentorData?.mentor_id;
        const schoolIdValue = mentorData?.schoolId || mentorData?.school_id;

        console.log("🔍 mentorIdValue:", mentorIdValue);
        console.log("🔍 schoolIdValue:", schoolIdValue);

        if (mentorIdValue) {
          setMentorId(mentorIdValue);
        }
        if (schoolIdValue) {
          setSchoolId(schoolIdValue);
        }
      }
    }
  }, [mentors]);

  // Fetch students when in myTeam tab and schoolId is available
  useEffect(() => {
    const fetchStudents = async () => {
      if (activeTab === "myTeam" && schoolId && myTeam) {
        setLoadingStudents(true);
        try {
          const response = await studentApi.getBySchoolId(schoolId);
          console.log("✅ Students response:", response);
          
          // Handle different response structures
          let studentsData = [];
          if (response.data) {
            if (Array.isArray(response.data)) {
              studentsData = response.data;
            } else if (response.data.data && Array.isArray(response.data.data)) {
              studentsData = response.data.data;
            }
          }
          
          // Filter out students who are already members
          const existingMemberIds = (myTeam.members || []).map(
            (m) => m.studentId || m.student_id
          );
          const availableStudents = studentsData.filter(
            (s) => !existingMemberIds.includes(s.studentId)
          );
          
          setStudents(availableStudents);
          console.log("✅ Available students list:", availableStudents);
        } catch (error) {
          console.error("❌ Error fetching students:", error);
          setStudents([]);
        } finally {
          setLoadingStudents(false);
        }
      }
    };

    fetchStudents();
  }, [activeTab, schoolId, myTeam]);

  const handleCreateTeam = async () => {
    setErrors({});
    const newErrors = {};

    if (!teamName.trim()) {
      newErrors.teamName = "Team name is required";
    }
    if (!schoolId) {
      newErrors.submit = "School information is missing. Please try again.";
    }
    if (!mentorId) {
      newErrors.submit = "Mentor information is missing. Please try again.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      // Get mentor data from response structure
      let mentorIdValue = mentorId;
      let schoolIdValue = schoolId;

      if (mentors && mentors.length > 0) {
        const response = mentors[0];
        const mentorData =
          response?.data && Array.isArray(response.data)
            ? response.data[0]
            : null;

        if (mentorData) {
          schoolIdValue = mentorData?.schoolId;
        }
      }

      const requestBody = {
        name: teamName.trim(),
        contestId: String(contestId),
        schoolId: String(schoolIdValue),
      };
      console.log("📤 POST /teams - Request body:", requestBody);
      const newTeam = await addTeam(requestBody);
      // Update myTeam state với team vừa tạo
      if (newTeam) {
        setMyTeam(newTeam);
      }
      // Switch to My Team tab after successful creation
      setActiveTab("myTeam");
      setTeamName("");
    } catch (error) {
      setErrors({ submit: error.message || "Failed to create team" });
    } finally {
      setLoading(false);
    }
  };

  // Handle invite member by student
  const handleInviteStudent = async (student) => {
    if (!student || !student.studentId) {
      setInviteError("Invalid student");
      return;
    }

    if (!student.userEmail) {
      setInviteError("Student email is missing");
      return;
    }

    setInviteError("");
    setInvitingStudentId(student.studentId);

    try {
      const teamId = myTeam?.teamId || myTeam?.team_id;
      if (!teamId) {
        throw new Error("Team ID not found");
      }

      // Call API to invite member
      const response = await teamInviteApi.invite(teamId, {
        studentId: student.studentId,
        inviteeEmail: student.userEmail,
        ttlDays: 60,
      });

      console.log("✅ Invite member response:", response);

      // Extract token from response (if needed for email)
      const token = response.data?.data?.token || response.data?.token;
      if (token) {
        console.log("✅ Invitation token:", token);
      }

      // Refresh myTeam to get updated members list
      const teamData = await getMyTeam();
      if (teamData) {
        const teamContestId = teamData.contestId || teamData.contest_id;
        if (
          teamContestId === contestId ||
          teamContestId === parseInt(contestId)
        ) {
          setMyTeam(teamData);
        }
      }

      // Remove invited student from list
      setStudents((prev) =>
        prev.filter((s) => s.studentId !== student.studentId)
      );

    } catch (error) {
      console.error("❌ Error inviting member:", error);
      
      // Handle different error cases
      let errorMessage = "Failed to send invitation";
      
      if (error.response) {
        const status = error.response.status;
        const responseData = error.response.data;
        
        // Check for specific error codes
        const errorCode = responseData?.errorCode;
        const errorMsg = responseData?.errorMessage || responseData?.message;
        
        // Handle REG_CLOSED - Registration window is closed
        if (errorCode === "REG_CLOSED") {
          errorMessage = errorMsg || "Registration window is closed. You cannot invite members at this time.";
        }
        // Handle 409 Conflict - student already invited or is member
        else if (status === 409) {
          errorMessage = 
            errorMsg ||
            responseData?.message || 
            responseData?.error ||
            `${student.userFullname} has already been invited or is already a member of this team.`;
          
          // Remove student from list if already invited/member
          setStudents((prev) =>
            prev.filter((s) => s.studentId !== student.studentId)
          );
          
          // Refresh team data to get updated members
          try {
            const teamData = await getMyTeam();
            if (teamData) {
              const teamContestId = teamData.contestId || teamData.contest_id;
              if (
                teamContestId === contestId ||
                teamContestId === parseInt(contestId)
              ) {
                setMyTeam(teamData);
              }
            }
          } catch (refreshError) {
            console.error("Error refreshing team data:", refreshError);
          }
        }
        // Handle other errors
        else {
          errorMessage = 
            errorMsg ||
            responseData?.message || 
            responseData?.error || 
            responseData?.data?.message ||
            `Error: ${status}`;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setInviteError(errorMessage);
      
      // Auto clear error after 5 seconds (except for REG_CLOSED which should stay longer)
      const clearTimeout = error.response?.data?.errorCode === "REG_CLOSED" ? 10000 : 5000;
      setTimeout(() => {
        setInviteError("");
      }, clearTimeout);
      
    } finally {
      setInvitingStudentId(null);
    }
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

  if (contestLoading) {
    return (
      <PageContainer
        breadcrumb={breadcrumbData.items}
        breadcrumbPaths={breadcrumbData.paths}
      >
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading...</p>
          </div>
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
                Create Team
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
                My Team
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
                  Registration Closed
                </h3>
                <p className="text-[#7A7574] text-sm mb-4">
                  The registration window has closed. You can no longer create new teams for this contest.
                </p>
                {contest.registrationEnd && (
                  <p className="text-xs text-[#7A7574]">
                    Registration closed on {new Date(contest.registrationEnd).toLocaleDateString()}
                  </p>
                )}
              </div>
            )}
            {activeTab === "create" && !registrationClosed && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#2d3748] mb-4">
                    Create New Team
                  </h3>
                  <p className="text-sm text-[#7A7574] mb-6">
                    Create a new team to participate in this contest. You'll be
                    the team leader.
                  </p>
                </div>

                <div className="space-y-4">
                  {/* Team Name */}
                  <div>
                    <label className="block text-sm font-medium text-[#2d3748] mb-2">
                      Team Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      placeholder="Enter team name"
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
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateTeam}
                      disabled={loading}
                      className="button-orange flex-1 flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          Creating...
                        </>
                      ) : (
                        <>
                          <Icon icon="mdi:check" width="18" />
                          Create Team
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
                    My Team
                  </h3>
                  <p className="text-sm text-[#7A7574] mb-6">
                    Manage your team information and members.
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
                            <div>
                              <h4 className="text-2xl font-bold text-[#2d3748] mb-1">
                                {myTeam.name}
                              </h4>
                              <p className="text-sm text-[#7A7574]">
                                Team ID: {myTeam.teamId || myTeam.team_id}
                              </p>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 mt-4">
                            <div className="p-3 bg-[#f9fafb] rounded-[5px]">
                              <p className="text-xs text-[#7A7574] mb-1">
                                Contest
                              </p>
                              <p className="font-semibold text-[#2d3748]">
                                {contest?.name || contest?.title || "N/A"}
                              </p>
                            </div>
                            <div className="p-3 bg-[#f9fafb] rounded-[5px]">
                              <p className="text-xs text-[#7A7574] mb-1">
                                Members
                              </p>
                              <p className="font-semibold text-[#2d3748]">
                                {myTeam.members?.length || 0} /{" "}
                                {contest?.maxTeamSize || "∞"}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Team Members Section */}
                    <div className="border border-[#E5E5E5] rounded-[8px] p-6 bg-white">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="text-lg font-semibold text-[#2d3748]">
                          Team Members
                        </h5>
                      </div>

                      {myTeam.members && myTeam.members.length > 0 ? (
                        <div className="space-y-3">
                          {myTeam.members.map((member, index) => (
                            <div
                              key={
                                member.studentId || member.student_id || index
                              }
                              className="flex items-center justify-between p-4 bg-[#f9fafb] rounded-[5px] hover:bg-[#f3f4f6] transition-colors"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#ff6b35] to-[#ff8c5a] text-white flex items-center justify-center font-semibold shadow-sm">
                                  {member.user?.name
                                    ?.charAt(0)
                                    ?.toUpperCase() || "M"}
                                </div>
                                <div>
                                  <p className="font-semibold text-[#2d3748]">
                                    {member.userFullname || "Unknown Member"}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Mail
                                      size={14}
                                      className="text-[#7A7574]"
                                    />
                                    <p className="text-sm text-[#7A7574]">
                                      {member.userEmail || ""}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                                Active
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Users
                            size={48}
                            className="text-[#E5E5E5] mx-auto mb-3"
                          />
                          <p className="text-[#7A7574] text-sm mb-4">
                            No members yet. Invite members to join your team.
                          </p>
                        
                        </div>
                      )}
                    </div>

                    {/* Available Students to Invite Section */}
                    <div className="border border-[#E5E5E5] rounded-[8px] p-6 bg-white">
                      <div className="flex items-center justify-between mb-4">
                        <h5 className="text-lg font-semibold text-[#2d3748]">
                          Available Students
                        </h5>
                      </div>

                      {inviteError && (
                        <div className="mb-4 bg-red-50 border border-red-200 rounded-[5px] p-3 flex items-start justify-between gap-2">
                          <p className="text-red-600 text-sm flex-1">{inviteError}</p>
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
                              Loading students...
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
                                    {student.userFullname || "Unknown Student"}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Mail
                                      size={14}
                                      className="text-[#7A7574]"
                                    />
                                    <p className="text-sm text-[#7A7574]">
                                      {student.userEmail || "No email"}
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => handleInviteStudent(student)}
                                disabled={invitingStudentId === student.studentId}
                                className="flex items-center gap-2 px-4 py-2 bg-[#ff6b35] text-white rounded-[5px] hover:bg-[#ff5722] transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {invitingStudentId === student.studentId ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                                    Inviting...
                                  </>
                                ) : (
                                  <>
                                    <UserPlus size={18} />
                                    Invite
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
                              ? "Loading students..."
                              : "No available students to invite."}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate(`/contest-detail/${contestId}`)}
                        className="button-white flex-1"
                      >
                        <Icon
                          icon="mdi:arrow-left"
                          width="18"
                          className="mr-2"
                        />
                        Back to Contest
                      </button>
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
                      No team found. Please create a team first.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default MentorTeam;
