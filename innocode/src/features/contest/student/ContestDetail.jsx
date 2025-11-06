import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '@/shared/components/PageContainer';
import { contestsData } from '@/data/contestsData';
import { createBreadcrumbWithPaths, BREADCRUMBS } from '@/config/breadcrumbs';
import { Icon } from '@iconify/react';
import { Calendar, Users, Trophy, Clock, Play } from 'lucide-react';
import useContestDetail from '../hooks/useContestDetail';
import CountdownTimer from '@/shared/components/countdowntimer/CountdownTimer';

const ContestDetail = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch contest data from API
  const { contest: apiContest, loading, error } = useContestDetail(contestId);

  // Use API data if available
  const contest = apiContest ;

  const breadcrumbData = contest
    ? createBreadcrumbWithPaths('CONTEST_DETAIL', contest.name || contest.title)
    : { items: BREADCRUMBS.NOT_FOUND, paths: ['/'] };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'upcoming':
        return 'text-[#fbbc05] bg-[#fef7e0]';
      case 'ongoing':
        return 'text-[#34a853] bg-[#e6f4ea]';
      case 'completed':
        return 'text-[#7A7574] bg-[#f3f3f3]';
      default:
        return 'text-[#7A7574] bg-[#f3f3f3]';
    }
  };


  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleRegister = () => {
    navigate(`/contest-processing/${contestId}`);
  };

  // Determine countdown target and label based on contest status
  const getCountdownTarget = () => {
    if (!contest) return null;
    
    const now = new Date();
    const startDate = new Date(contest.start);
    const endDate = new Date(contest.end);

    // If contest hasn't started yet, countdown to start
    if (now < startDate) {
      return contest.start;
    }
    
    // If contest is ongoing, countdown to end
    if (now >= startDate && now < endDate) {
      return contest.end;
    }
    
    // Contest has ended
    return null;
  };

  const getCountdownLabel = () => {
    if (!contest) return 'Time Remaining';
    
    const now = new Date();
    const startDate = new Date(contest.start);
    const endDate = new Date(contest.end);

    if (now < startDate) {
      return 'Time Until Start';
    }
    
    if (now >= startDate && now < endDate) {
      return 'Time Until End';
    }
    
    return 'Contest Ended';
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'mdi:information-outline' },
    { id: 'rounds', label: 'Rounds', icon: 'mdi:trophy-outline' },
    {
      id: 'rules',
      label: 'Rules & Guidelines',
      icon: 'mdi:file-document-outline',
    },
  ];

  // Loading state
  if (loading) {
    return (
      <PageContainer breadcrumb={BREADCRUMBS.CONTESTS} bg={false}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">
              Loading contest details...
            </p>
          </div>
        </div>
      </PageContainer>
    );
  }

  // Error state
  if (error) {
    return (
      <PageContainer breadcrumb={BREADCRUMBS.CONTESTS} bg={false}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <Icon
              icon="mdi:alert-circle-outline"
              className="w-20 h-20 text-red-500 mx-auto mb-4"
            />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              Failed to Load Contest
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => navigate('/contests')}
              className="button-orange"
            >
              <Icon icon="mdi:arrow-left" className="inline mr-2" />
              Back to Contests
            </button>
          </div>
        </div>
      </PageContainer>
    );
  }

  if (!contest) {
    return (
      <PageContainer
        breadcrumb={breadcrumbData.items}
        breadcrumbPaths={breadcrumbData.paths}
      >
        <div className="flex items-center justify-center h-[400px]">
          <p className="text-[#7A7574] text-lg">Contest not found</p>
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
      <div className="flex gap-5">
        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Contest Banner */}
          <div className="bg-gradient-to-r from-[#ff6b35] via-[#f7931e] to-[#ffd89b] h-[280px] rounded-[8px] overflow-hidden relative">
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <div className="text-center text-white px-6">
                <h1 className="text-4xl font-bold mb-4">
                  {contest.name || contest.title}
                </h1>
                <p className="text-lg opacity-90">
                  Organized by {contest.createdBy}
                </p>
              </div>
            </div>
          </div>

          {/* Contest Header Info */}
          <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6">
            <div className="flex items-center gap-3 flex-wrap mb-4">
              <span
                className={`px-3 py-1 rounded-[5px] text-sm font-medium ${getStatusColor(
                  contest.statusLabel || contest.status
                )}`}
              >
                {(contest.statusLabel || contest.status || '')
                  .charAt(0)
                  .toUpperCase() +
                  (contest.statusLabel || contest.status || '').slice(1)}
              </span>
      
              <div className="flex items-center gap-2 text-[#7A7574] text-sm">
                <Users size={14} />
                <span>
                  {contest.registeredTeams || 0}/
                  {contest.totalTeams || contest.teams || 0} Teams Registered
                </span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#E5E5E5]">
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={16} className="text-[#7A7574]" />
                <div>
                  <div className="text-[#7A7574] text-xs">Start Date</div>
                  <div className="font-medium text-[#2d3748]">
                    {contest.start
                      ? formatDate(contest.start).split(',')[0]
                      : 'TBA'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Icon icon="mdi:trophy" width="16" className="text-[#7A7574]" />
                <div>
                  <div className="text-[#7A7574] text-xs">Prize Pool</div>
                  <div className="font-medium text-[#2d3748]">
                    {contest.prizePool || contest.rewardsText || 'TBA'}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Icon icon="mdi:layers" width="16" className="text-[#7A7574]" />
                <div>
                  <div className="text-[#7A7574] text-xs">Rounds</div>
                  <div className="font-medium text-[#2d3748]">
                    {contest.rounds || 'TBA'} Rounds
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Icon
                  icon="mdi:code-braces"
                  width="16"
                  className="text-[#7A7574]"
                />
                <div>
                  <div className="text-[#7A7574] text-xs">Problems</div>
                  <div className="font-medium text-[#2d3748]">
                    {contest.totalProblems || 'TBA'} Total
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="bg-white border border-[#E5E5E5] rounded-[8px] overflow-hidden">
            <div className="flex border-b border-[#E5E5E5]">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#ff6b35] text-white'
                      : 'text-[#7A7574] hover:bg-[#f9fafb]'
                  }`}
                >
                  <Icon icon={tab.icon} width="18" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#2d3748] mb-3">
                      About the Contest
                    </h3>
                    <p className="text-[#4a5568] text-base leading-relaxed whitespace-pre-line">
                      {contest.description}
                    </p>
                  </div>

                  {/* Requirements */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#2d3748] mb-3">
                      Requirements
                    </h3>
                    <ul className="space-y-2">
                      {(contest.requirements || []).map((req, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-[#4a5568]"
                        >
                          <Icon
                            icon="mdi:check-circle"
                            width="20"
                            className="text-[#34a853] flex-shrink-0 mt-0.5"
                          />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Prizes */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#2d3748] mb-3">
                      Prizes & Awards
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {(contest.prizes || []).map((prize, index) => (
                        <div
                          key={index}
                          className="bg-[#f9fafb] border border-[#E5E5E5] rounded-[5px] p-4"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Trophy size={16} className="text-[#ff6b35]" />
                            <span className="font-semibold text-[#2d3748]">
                              {prize.rank}
                            </span>
                          </div>
                          <p className="text-sm text-[#4a5568]">
                            {prize.reward}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'rounds' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#2d3748] mb-3">
                    Contest Schedule
                  </h3>
                  {(contest.schedule || []).length > 0 ? (
                    contest.schedule.map((round, index) => (
                      <div
                        key={index}
                        className="border border-[#E5E5E5] rounded-[5px] p-4 hover:bg-[#f9fafb] transition-colors"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-[#ff6b35] text-white flex items-center justify-center text-sm font-bold">
                              {index + 1}
                            </div>
                            <h4 className="font-semibold text-[#2d3748]">
                              {round.round}
                            </h4>
                          </div>
                          <span className="text-xs px-2 py-1 bg-[#e6f4ea] text-[#34a853] rounded">
                            {round.problems} Problems
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-[#7A7574] ml-10">
                          <Clock size={14} />
                          <span>{round.date}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-[#7A7574]">
                      <Icon
                        icon="mdi:calendar-blank"
                        width="48"
                        className="mx-auto mb-2 opacity-50"
                      />
                      <p>No rounds scheduled yet</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'rules' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#2d3748] mb-3">
                    Contest Rules & Guidelines
                  </h3>
                  {(contest.rules || []).length > 0 ? (
                    <ul className="space-y-3">
                      {contest.rules.map((rule, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-3 text-[#4a5568]"
                        >
                          <div className="w-6 h-6 rounded-full bg-[#f9fafb] border border-[#E5E5E5] flex items-center justify-center flex-shrink-0 mt-0.5">
                            <span className="text-xs font-medium text-[#7A7574]">
                              {index + 1}
                            </span>
                          </div>
                          <span className="leading-relaxed">{rule}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center py-8 text-[#7A7574]">
                      <Icon
                        icon="mdi:file-document-outline"
                        width="48"
                        className="mx-auto mb-2 opacity-50"
                      />
                      <p>No rules available yet</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="w-[320px] flex flex-col gap-4">
          {/* Registration / Action Button */}
          <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-5">
            <button
              onClick={handleRegister}
              className="button-orange w-full flex items-center justify-center gap-2 py-3"
            >
              <Icon icon="mdi:account-plus" width="18" />
              Register Now
            </button>
            <p className="text-xs text-[#7A7574] text-center mt-2">
              Registration closes on{' '}
              {contest.registrationEnd
                ? formatDate(contest.registrationEnd).split(',')[0]
                : 'TBA'}
            </p>
          </div>

          {/* Countdown Timer */}
          <CountdownTimer 
            targetDate={getCountdownTarget()}
            label={getCountdownLabel()}
          />

          {/* Your Team Status */}
          <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-5">
            <h3 className="text-sm font-semibold text-[#2d3748] mb-4 flex items-center gap-2">
              <Users size={16} className="text-[#ff6b35]" />
              Your Team
            </h3>
            <div className="text-center py-4">
              <Icon
                icon="mdi:account-group-outline"
                width="48"
                className="text-[#E5E5E5] mx-auto mb-2"
              />
              <p className="text-sm text-[#7A7574] mb-3">
                You haven't joined a team yet
              </p>
              <button className="button-white w-full text-sm">
                Create or Join Team
              </button>
            </div>
          </div>

          {/* Contest Info */}
          <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-5">
            <h3 className="text-sm font-semibold text-[#2d3748] mb-4">
              Contest Information
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-[#7A7574]">Format:</span>
                <span className="font-medium text-[#2d3748]">Team</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A7574]">Team Size:</span>
                <span className="font-medium text-[#2d3748]">
                  1-{contest.teamMembersMax || contest.maxTeamSize || 3} members
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A7574]">Language:</span>
                <span className="font-medium text-[#2d3748]">Python 3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A7574]">Duration:</span>
                <span className="font-medium text-[#2d3748]">
                  {contest.start && contest.end
                    ? `${Math.ceil(
                        (new Date(contest.end) - new Date(contest.start)) /
                          (1000 * 60 * 60 * 24)
                      )} Days`
                    : '3 Days'}
                </span>
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-[#fef7e0] border border-[#fbbc05] rounded-[8px] p-5">
            <div className="flex items-start gap-2 mb-2">
              <Icon
                icon="mdi:alert-circle"
                width="20"
                className="text-[#fbbc05] flex-shrink-0 mt-0.5"
              />
              <h3 className="text-sm font-semibold text-[#2d3748]">
                Important Notice
              </h3>
            </div>
            <p className="text-sm text-[#4a5568] leading-relaxed">
              Make sure to register before the deadline. Late registrations will
              not be accepted.
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ContestDetail;
