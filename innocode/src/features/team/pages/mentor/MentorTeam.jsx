import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Users } from 'lucide-react';
import PageContainer from '@/shared/components/PageContainer';
import { createBreadcrumbWithPaths, BREADCRUMBS } from '@/config/breadcrumbs';
import useContestDetail from '@/features/contest/hooks/useContestDetail';
import useTeams from '@/features/team/hooks/useTeams';
import { useAuth } from '@/context/AuthContext';
import useMentors from '../../../../shared/hooks/useMentors';

const MentorTeam = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'myTeam'
  const [teamName, setTeamName] = useState('');
  const [schoolId, setSchoolId] = useState(null);
  const [mentorId, setMentorId] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { contest, loading: contestLoading } = useContestDetail(contestId);
  const { teams, loading: teamsLoading, addTeam } = useTeams();
  const {
    mentors,
    loading: mentorLoading,
    error: mentorError,
    getMentorByUserId,
  } = useMentors();
  const { user } = useAuth();

  const breadcrumbData = contest
    ? createBreadcrumbWithPaths('CONTEST_DETAIL', contest.name || contest.title)
    : { items: BREADCRUMBS.NOT_FOUND, paths: ['/'] };

  // Filter teams for this contest
  const contestTeams = teams.filter(
    (team) =>
      team.contestId === contestId || team.contest_id === parseInt(contestId)
  );

  // Find mentor's team in this contest
  const myTeam = contestTeams.find(
    (team) => team.mentorId === mentorId || team.mentor_id === mentorId
  );

  // Set default tab to 'myTeam' if mentor already has a team
  useEffect(() => {
    if (myTeam && activeTab === 'create') {
      setActiveTab('myTeam');
    }
  }, [myTeam, activeTab]);
  useEffect(() => {
    if (user?.id) {
      getMentorByUserId(user?.id);
    }
  }, [user?.id, getMentorByUserId]);

  // Auto-set mentorId and schoolId from fetched mentor
  useEffect(() => {
    console.log('🔍 Mentors data:', mentors);
    if (mentors && mentors.length > 0) {
      // API returns array with response object: [{data: [...], ...}]
      const response = mentors[0];
      // Get actual mentor from response.data[0]
      const mentorData =
        response?.data && Array.isArray(response.data)
          ? response.data[0]
          : null;

      console.log('🔍 Response object:', response);
      console.log('🔍 Actual mentor:', mentorData);

      if (mentorData) {
        // Handle both camelCase and snake_case field names
        const mentorIdValue = mentorData?.mentorId || mentorData?.mentor_id;
        const schoolIdValue = mentorData?.schoolId || mentorData?.school_id;

        console.log('🔍 mentorIdValue:', mentorIdValue);
        console.log('🔍 schoolIdValue:', schoolIdValue);

        if (mentorIdValue) {
          setMentorId(mentorIdValue);
        }
        if (schoolIdValue) {
          setSchoolId(schoolIdValue);
        }
      }
    }
  }, [mentors]);
  const handleCreateTeam = async () => {
    setErrors({});
    const newErrors = {};

    if (!teamName.trim()) {
      newErrors.teamName = 'Team name is required';
    }
    if (!schoolId) {
      newErrors.submit = 'School information is missing. Please try again.';
    }
    if (!mentorId) {
      newErrors.submit = 'Mentor information is missing. Please try again.';
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
          mentorIdValue = mentorData?.mentorId;
          schoolIdValue = mentorData?.schoolId;
        }
      }

      const requestBody = {
        name: teamName.trim(),
        contestId: String(contestId),
        schoolId: String(schoolIdValue),
        mentorId: String(mentorIdValue),
      };
      console.log('📤 POST /teams - Request body:', requestBody);
      const newTeam = await addTeam(requestBody);
      // Switch to My Team tab after successful creation
      setActiveTab('myTeam');
      setTeamName('');
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to create team' });
    } finally {
      setLoading(false);
    }
  };

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
            {!myTeam && (
              <button
                onClick={() => setActiveTab('create')}
                className={`flex-1 px-6 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  activeTab === 'create'
                    ? 'bg-[#ff6b35] text-white'
                    : 'text-[#7A7574] hover:bg-[#f9fafb]'
                }`}
              >
                <Icon icon="mdi:plus-circle" width="18" />
                Create Team
              </button>
            )}
            {myTeam && (
              <button
                onClick={() => setActiveTab('myTeam')}
                className={`flex-1 px-6 py-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                  activeTab === 'myTeam'
                    ? 'bg-[#ff6b35] text-white'
                    : 'text-[#7A7574] hover:bg-[#f9fafb]'
                }`}
              >
                <Icon icon="mdi:account-group" width="18" />
                My Team
              </button>
            )}
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'create' && (
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
                        errors.teamName ? 'border-red-500' : 'border-[#E5E5E5]'
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

            {activeTab === 'myTeam' && (
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
                  <div className="border border-[#E5E5E5] rounded-[8px] p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xl font-semibold text-[#2d3748] mb-2">
                          {myTeam.name}
                        </h4>
                        <div className="space-y-2 text-sm text-[#7A7574]">
                          <p>
                            <span className="font-medium">Team ID:</span>{' '}
                            {myTeam.teamId || myTeam.team_id}
                          </p>
                          <p>
                            <span className="font-medium">Contest:</span>{' '}
                            {contest?.name || contest?.title || 'N/A'}
                          </p>
                          <p>
                            <span className="font-medium">Members:</span>{' '}
                            {myTeam.members?.length || 0} member
                            {(myTeam.members?.length || 0) !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      <div className="w-16 h-16 rounded-full bg-[#ff6b35] text-white flex items-center justify-center font-semibold text-xl">
                        <Users size={32} />
                      </div>
                    </div>

                    {myTeam.members && myTeam.members.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-[#E5E5E5]">
                        <h5 className="font-semibold text-[#2d3748] mb-4">
                          Team Members
                        </h5>
                        <div className="space-y-2">
                          {myTeam.members.map((member, index) => (
                            <div
                              key={
                                member.studentId || member.student_id || index
                              }
                              className="flex items-center gap-3 p-3 bg-[#f9fafb] rounded-[5px]"
                            >
                              <div className="w-10 h-10 rounded-full bg-[#ff6b35] text-white flex items-center justify-center font-semibold">
                                {member.user?.name?.charAt(0)?.toUpperCase() ||
                                  'M'}
                              </div>
                              <div>
                                <p className="font-medium text-[#2d3748]">
                                  {member.user?.name || 'Unknown Member'}
                                </p>
                                <p className="text-xs text-[#7A7574]">
                                  {member.user?.email || ''}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => navigate(`/contest-detail/${contestId}`)}
                        className="button-white flex-1"
                      >
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
