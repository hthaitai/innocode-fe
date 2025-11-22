import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/shared/components/PageContainer';
import { BREADCRUMBS } from '@/config/breadcrumbs';
import { useAuth } from '@/context/AuthContext';
import { ROLES } from '@/context/AuthContext';
import useContests from '@/features/contest/hooks/useContests';
import { Icon } from '@iconify/react';
import useMentors from '../../../shared/hooks/useMentors';

const Team = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const role = user?.role || 'student';
  const { contests, loading } = useContests();
  const {
    mentor,
    loading: mentorLoading,
    error: mentorError,
    getMentorByUserId,
  } = useMentors();
  useEffect(() => {
    if (user?.id) {
      getMentorByUserId(user?.id);
    }
  }, [user?.id, getMentorByUserId]);

  // Log mentor when it changes

  // If mentor, show contests list to select
  if (role === ROLES.MENTOR) {
    return (
      <PageContainer breadcrumb={BREADCRUMBS.TEAM}>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6">
            <h2 className="text-2xl font-semibold text-[#2d3748] mb-2">
              Manage Teams
            </h2>
            <p className="text-sm text-[#7A7574] mb-6">
              Select a contest to create or manage teams
            </p>
          </div>
        </div>
      </PageContainer>
    );
  }

  // For student and other roles, show default team page
  return (
    <PageContainer breadcrumb={BREADCRUMBS.TEAM}>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6">
          <h2 className="text-xl font-semibold text-[#2d3748] mb-4">
            My Teams
          </h2>
          <p className="text-gray-600">
            Manage your team members and collaborate on coding challenges. This
            page will contain team management features.
          </p>
        </div>
      </div>
    </PageContainer>
  );
};

export default Team;
