import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageContainer from '@/shared/components/PageContainer';
import { contestsData } from '@/data/contestsData';
import { createBreadcrumbWithPaths, BREADCRUMBS } from '@/config/breadcrumbs';
import { Icon } from '@iconify/react';
import { Calendar, Users, Trophy, Clock, Play } from 'lucide-react';

const ContestDetail = () => {
  const { contestId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Mock contest data - replace with actual data hook
  const contest = {
    id: parseInt(contestId),
    title: 'Python Code Challenge 2025',
    description: `Join us for the annual Python Programming Challenge! This contest is designed for high school students to showcase their coding skills and problem-solving abilities.

Compete with teams from across the country, solve challenging problems, and win exciting prizes. This is your opportunity to demonstrate your programming expertise and learn from the best.

The contest will feature multiple rounds with increasing difficulty levels, testing your knowledge of algorithms, data structures, and Python programming concepts.`,
    status: 'upcoming',
    difficulty: 'Medium',
    startDate: '2025-11-20T09:00:00',
    endDate: '2025-11-22T18:00:00',
    registrationDeadline: '2025-11-15T23:59:59',
    maxTeamSize: 3,
    totalTeams: 145,
    registeredTeams: 87,
    rounds: 3,
    totalProblems: 12,
    prizePool: '50,000,000 VND',
    organizer: 'Ministry of Education',
    banner: '/assets/contest-banner.jpg',
    rules: [
      'Each team must consist of 1-3 high school students',
      'All team members must be from the same school',
      'One mentor per team is required',
      'Solutions must be submitted before the deadline',
      'Plagiarism will result in immediate disqualification',
      'Internet access is allowed for documentation only',
    ],
    prizes: [
      { rank: '1st Place', reward: '20,000,000 VND + Trophy' },
      { rank: '2nd Place', reward: '15,000,000 VND + Trophy' },
      { rank: '3rd Place', reward: '10,000,000 VND + Trophy' },
      { rank: 'Top 10', reward: 'Certificate of Excellence' },
    ],
    schedule: [
      { round: 'Round 1', date: 'Nov 20, 09:00 - 12:00', problems: 4 },
      { round: 'Round 2', date: 'Nov 21, 09:00 - 12:00', problems: 4 },
      { round: 'Final Round', date: 'Nov 22, 09:00 - 15:00', problems: 4 },
    ],
    requirements: [
      'Python 3.9 or higher',
      'Basic knowledge of algorithms and data structures',
      'Familiarity with competitive programming',
      'Team collaboration skills',
    ],
  };

  const breadcrumbData = contest
    ? createBreadcrumbWithPaths('CONTEST_DETAIL', contest.title)
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

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'text-[#34a853] bg-[#e6f4ea]';
      case 'medium':
        return 'text-[#fbbc05] bg-[#fef7e0]';
      case 'hard':
        return 'text-[#ea4335] bg-[#fce8e6]';
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

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'mdi:information-outline' },
    { id: 'rounds', label: 'Rounds', icon: 'mdi:trophy-outline' },
    { id: 'rules', label: 'Rules & Guidelines', icon: 'mdi:file-document-outline' },
  ];

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
                <h1 className="text-4xl font-bold mb-4">{contest.title}</h1>
                <p className="text-lg opacity-90">Organized by {contest.organizer}</p>
              </div>
            </div>
          </div>

          {/* Contest Header Info */}
          <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6">
            <div className="flex items-center gap-3 flex-wrap mb-4">
              <span
                className={`px-3 py-1 rounded-[5px] text-sm font-medium ${getStatusColor(
                  contest.status
                )}`}
              >
                {contest.status.charAt(0).toUpperCase() + contest.status.slice(1)}
              </span>
              <span
                className={`px-3 py-1 rounded-[5px] text-sm font-medium ${getDifficultyColor(
                  contest.difficulty
                )}`}
              >
                {contest.difficulty}
              </span>
              <div className="flex items-center gap-2 text-[#7A7574] text-sm">
                <Users size={14} />
                <span>{contest.registeredTeams}/{contest.totalTeams} Teams Registered</span>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[#E5E5E5]">
              <div className="flex items-center gap-2 text-sm">
                <Calendar size={16} className="text-[#7A7574]" />
                <div>
                  <div className="text-[#7A7574] text-xs">Start Date</div>
                  <div className="font-medium text-[#2d3748]">{formatDate(contest.startDate).split(',')[0]}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Icon icon="mdi:trophy" width="16" className="text-[#7A7574]" />
                <div>
                  <div className="text-[#7A7574] text-xs">Prize Pool</div>
                  <div className="font-medium text-[#2d3748]">{contest.prizePool}</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Icon icon="mdi:layers" width="16" className="text-[#7A7574]" />
                <div>
                  <div className="text-[#7A7574] text-xs">Rounds</div>
                  <div className="font-medium text-[#2d3748]">{contest.rounds} Rounds</div>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Icon icon="mdi:code-braces" width="16" className="text-[#7A7574]" />
                <div>
                  <div className="text-[#7A7574] text-xs">Problems</div>
                  <div className="font-medium text-[#2d3748]">{contest.totalProblems} Total</div>
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
                      {contest.requirements.map((req, index) => (
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
                      {contest.prizes.map((prize, index) => (
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
                          <p className="text-sm text-[#4a5568]">{prize.reward}</p>
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
                  {contest.schedule.map((round, index) => (
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
                  ))}
                </div>
              )}

              {activeTab === 'rules' && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-[#2d3748] mb-3">
                    Contest Rules & Guidelines
                  </h3>
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
              Registration closes on {formatDate(contest.registrationDeadline).split(',')[0]}
            </p>
          </div>

          {/* Countdown Timer */}
          <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-5">
            <h3 className="text-sm font-semibold text-[#2d3748] mb-4 flex items-center gap-2">
              <Clock size={16} className="text-[#ff6b35]" />
              Time Until Start
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-[#f9fafb] rounded-[5px] p-3 text-center">
                <div className="text-2xl font-bold text-[#2d3748]">15</div>
                <div className="text-xs text-[#7A7574]">Days</div>
              </div>
              <div className="bg-[#f9fafb] rounded-[5px] p-3 text-center">
                <div className="text-2xl font-bold text-[#2d3748]">08</div>
                <div className="text-xs text-[#7A7574]">Hours</div>
              </div>
              <div className="bg-[#f9fafb] rounded-[5px] p-3 text-center">
                <div className="text-2xl font-bold text-[#2d3748]">32</div>
                <div className="text-xs text-[#7A7574]">Minutes</div>
              </div>
              <div className="bg-[#f9fafb] rounded-[5px] p-3 text-center">
                <div className="text-2xl font-bold text-[#2d3748]">15</div>
                <div className="text-xs text-[#7A7574]">Seconds</div>
              </div>
            </div>
          </div>

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
                <span className="font-medium text-[#2d3748]">1-{contest.maxTeamSize} members</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A7574]">Language:</span>
                <span className="font-medium text-[#2d3748]">Python 3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#7A7574]">Duration:</span>
                <span className="font-medium text-[#2d3748]">3 Days</span>
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
              Make sure to register before the deadline. Late registrations will not be accepted.
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default ContestDetail;
