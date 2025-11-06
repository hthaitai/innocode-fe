import React, { useState } from 'react';
import PageContainer from '@/shared/components/PageContainer';
import { createBreadcrumbWithPaths, BREADCRUMBS } from '@/config/breadcrumbs';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Clock, Play, TrendingUp, Users } from 'lucide-react';

function PracticeDetail() {
  const { practiceId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('description');

  // Mock practice data - replace with actual data hook
  const practice = {
    id: parseInt(practiceId),
    title: 'Two Sum Problem',
    difficulty: 'Easy',
    description: `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.`,
    constraints: [
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      '-10^9 <= target <= 10^9',
      'Only one valid answer exists.',
    ],
    examples: [
      {
        input: 'nums = [2,7,11,15], target = 9',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].',
      },
      {
        input: 'nums = [3,2,4], target = 6',
        output: '[1,2]',
        explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].',
      },
      {
        input: 'nums = [3,3], target = 6',
        output: '[0,1]',
        explanation: 'Because nums[0] + nums[1] == 6, we return [0, 1].',
      },
    ],
    timeLimit: '1000ms',
    memoryLimit: '256MB',
    acceptanceRate: '45.2%',
    totalSubmissions: 1234,
    successfulSubmissions: 558,
    language: 'python3',
    topics: ['Array', 'Hash Table', 'Two Pointers'],
    companies: ['Google', 'Amazon', 'Facebook', 'Microsoft'],
  };

  const breadcrumbData = practice
    ? createBreadcrumbWithPaths('PRACTICE_DETAIL', practice.title)
    : { items: BREADCRUMBS.NOT_FOUND, paths: ['/'] };

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

  const handleStartPractice = () => {
    navigate(`/practice-start/${practiceId}`);
  };

  const tabs = [
    { id: 'description', label: 'Description', icon: 'mdi:file-document-outline' },
    { id: 'solutions', label: 'Solutions', icon: 'mdi:lightbulb-outline' },
    { id: 'discuss', label: 'Discuss', icon: 'mdi:forum-outline' },
  ];

  if (!practice) {
    return (
      <PageContainer
        breadcrumb={breadcrumbData.items}
        breadcrumbPaths={breadcrumbData.paths}
      >
        <div className="flex items-center justify-center h-[400px]">
          <p className="text-[#7A7574] text-lg">Practice problem not found</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      breadcrumbPaths={breadcrumbData.paths}
      breadcrumb={breadcrumbData.items}
      bg={false}
    >
      <div className="flex gap-5">
        {/* MAIN CONTENT */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Problem Header */}
          <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h1 className="text-[2rem] font-bold text-[#2d3748] mb-3">
                  {practice.title}
                </h1>
                <div className="flex items-center gap-3 flex-wrap mb-4">
                  <span
                    className={`px-3 py-1 rounded-[5px] text-sm font-medium ${getDifficultyColor(
                      practice.difficulty
                    )}`}
                  >
                    {practice.difficulty}
                  </span>
                  <div className="flex items-center gap-2 text-[#7A7574] text-sm">
                    <Icon icon="mdi:check-circle-outline" width="16" />
                    <span>{practice.acceptanceRate} Acceptance Rate</span>
                  </div>
                  <div className="flex items-center gap-2 text-[#7A7574] text-sm">
                    <Users size={14} />
                    <span>{practice.totalSubmissions} Submissions</span>
                  </div>
                </div>

                {/* Topics */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm text-[#7A7574]">Topics:</span>
                  {practice.topics.map((topic, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-[#f9fafb] border border-[#E5E5E5] rounded text-xs text-[#2d3748]"
                    >
                      {topic}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex gap-6 pt-4 border-t border-[#E5E5E5]">
              <div className="flex items-center gap-2 text-sm">
                <Clock size={16} className="text-[#7A7574]" />
                <span className="text-[#7A7574]">Time Limit:</span>
                <span className="font-medium text-[#2d3748]">
                  {practice.timeLimit}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Icon
                  icon="mdi:memory"
                  width="16"
                  className="text-[#7A7574]"
                />
                <span className="text-[#7A7574]">Memory:</span>
                <span className="font-medium text-[#2d3748]">
                  {practice.memoryLimit}
                </span>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="bg-white border  border-[#E5E5E5] rounded-[8px] overflow-hidden">
            <div className="flex border-b  border-[#E5E5E5]">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 cursor-pointer px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
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
              {activeTab === 'description' && (
                <div className="space-y-6">
                  {/* Description */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#2d3748] mb-3">
                      Problem Description
                    </h3>
                    <p className="text-[#4a5568] text-base leading-relaxed whitespace-pre-line">
                      {practice.description}
                    </p>
                  </div>

                  {/* Examples */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#2d3748] mb-3">
                      Examples
                    </h3>
                    <div className="space-y-4">
                      {practice.examples.map((example, index) => (
                        <div
                          key={index}
                          className="bg-[#f9fafb] border border-[#E5E5E5] rounded-[5px] p-4"
                        >
                          <div className="font-medium text-[#2d3748] mb-2">
                            Example {index + 1}:
                          </div>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="font-medium text-[#7A7574]">
                                Input:{' '}
                              </span>
                              <code className="bg-white px-2 py-1 rounded text-[#2d3748]">
                                {example.input}
                              </code>
                            </div>
                            <div>
                              <span className="font-medium text-[#7A7574]">
                                Output:{' '}
                              </span>
                              <code className="bg-white px-2 py-1 rounded text-[#2d3748]">
                                {example.output}
                              </code>
                            </div>
                            {example.explanation && (
                              <div>
                                <span className="font-medium text-[#7A7574]">
                                  Explanation:{' '}
                                </span>
                                <span className="text-[#4a5568]">
                                  {example.explanation}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Constraints */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#2d3748] mb-3">
                      Constraints
                    </h3>
                    <ul className="space-y-2">
                      {practice.constraints.map((constraint, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-[#4a5568]"
                        >
                          <Icon
                            icon="mdi:circle-small"
                            width="20"
                            className="text-[#7A7574] flex-shrink-0 mt-0.5"
                          />
                          <code className="text-sm bg-[#f9fafb] px-2 py-0.5 rounded">
                            {constraint}
                          </code>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeTab === 'solutions' && (
                <div className="text-center py-10">
                  <Icon
                    icon="mdi:lightbulb-outline"
                    width="64"
                    className="text-[#E5E5E5] mx-auto mb-4"
                  />
                  <p className="text-[#7A7574] mb-2">
                    Solutions will be available after you submit
                  </p>
                  <p className="text-sm text-[#9ca3af]">
                    Start practicing to unlock community solutions
                  </p>
                </div>
              )}

              {activeTab === 'discuss' && (
                <div className="text-center py-10">
                  <Icon
                    icon="mdi:forum-outline"
                    width="64"
                    className="text-[#E5E5E5] mx-auto mb-4"
                  />
                  <p className="text-[#7A7574]">
                    Discussion feature coming soon
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="w-[320px] flex flex-col gap-4">
          {/* Start Button */}
          <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-5">
            <button
              onClick={handleStartPractice}
              className="button-orange w-full flex items-center justify-center gap-2 py-3"
            >
              <Play size={18} />
              Start Practice
            </button>
          </div>

          {/* Progress Stats */}
          <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-5">
            <h3 className="text-sm font-semibold text-[#2d3748] mb-4 flex items-center gap-2">
              <TrendingUp size={16} className="text-[#ff6b35]" />
              Your Progress
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#7A7574]">Status:</span>
                <span className="text-sm font-medium text-[#4a5568]">
                  Not Started
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#7A7574]">Attempts:</span>
                <span className="text-sm font-medium text-[#4a5568]">0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-[#7A7574]">Best Score:</span>
                <span className="text-sm font-medium text-[#4a5568]">-</span>
              </div>
            </div>
          </div>

          {/* Companies */}
          <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-5">
            <h3 className="text-sm font-semibold text-[#2d3748] mb-4">
              Asked by Companies
            </h3>
            <div className="flex flex-wrap gap-2">
              {practice.companies.map((company, index) => (
                <span
                  key={index}
                  className="px-3 py-1.5 bg-[#f9fafb] border border-[#E5E5E5] rounded-[5px] text-xs text-[#2d3748] font-medium"
                >
                  {company}
                </span>
              ))}
            </div>
          </div>

          {/* Tips */}
          <div className="bg-[#e6f4ea] border border-[#34a853] rounded-[8px] p-5">
            <div className="flex items-start gap-2 mb-2">
              <Icon
                icon="mdi:lightbulb-on"
                width="20"
                className="text-[#34a853] flex-shrink-0 mt-0.5"
              />
              <h3 className="text-sm font-semibold text-[#2d3748]">Pro Tip</h3>
            </div>
            <p className="text-sm text-[#4a5568] leading-relaxed">
              Try to solve this problem using a hash table for O(n) time
              complexity. Think about what information you need to store.
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

export default PracticeDetail;
