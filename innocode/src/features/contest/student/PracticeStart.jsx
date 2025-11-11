import React, { useState } from 'react';
import PageContainer from '@/shared/components/PageContainer';
import { createBreadcrumbWithPaths, BREADCRUMBS } from '@/config/breadcrumbs';
import { useParams, useNavigate } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { Code, Send, RotateCcw, ChevronLeft } from 'lucide-react';

function PracticeStart() {
  const { practiceId } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('python3');
  const [testResults, setTestResults] = useState(null);
  const [isRunning, setIsRunning] = useState(false);

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
  };

  const breadcrumbData = practice
    ? {
        items: ['Practice', practice.title, 'Solve'],
        paths: ['/practice', `/practice-detail/${practiceId}`, `/practice-start/${practiceId}`],
      }
    : { items: BREADCRUMBS.NOT_FOUND, paths: ['/'] };

  const languages = [
    { value: 'python3', label: 'Python 3' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'java', label: 'Java' },
    { value: 'cpp', label: 'C++' },
  ];

  const codeTemplates = {
    python3: `def solution(nums, target):
    """
    :param nums: List[int]
    :param target: int
    :return: List[int]
    """
    # Write your code here
    pass`,
    javascript: `/**
 * @param {number[]} nums
 * @param {number} target
 * @return {number[]}
 */
function solution(nums, target) {
    // Write your code here
}`,
    java: `class Solution {
    public int[] twoSum(int[] nums, int target) {
        // Write your code here
        return new int[0];
    }
}`,
    cpp: `#include <vector>
using namespace std;

class Solution {
public:
    vector<int> twoSum(vector<int>& nums, int target) {
        // Write your code here
        return {};
    }
};`,
  };

  const handleSubmit = () => {
    console.log('Submitting code:', code);
    setIsRunning(true);
    // Simulate submission
    setTimeout(() => {
      setTestResults({
        status: 'accepted',
        passed: 3,
        total: 3,
        runtime: '42ms',
        memory: '14.2MB',
        testCases: [
          { id: 1, status: 'passed', input: '[2,7,11,15], 9', output: '[0,1]', expected: '[0,1]' },
          { id: 2, status: 'passed', input: '[3,2,4], 6', output: '[1,2]', expected: '[1,2]' },
          { id: 3, status: 'passed', input: '[3,3], 6', output: '[0,1]', expected: '[0,1]' },
        ],
      });
      setIsRunning(false);
    }, 1500);
  };

  const handleRunCode = () => {
    console.log('Running code:', code);
    setIsRunning(true);
    // Simulate run
    setTimeout(() => {
      setTestResults({
        status: 'running',
        passed: 2,
        total: 3,
        runtime: '38ms',
        memory: '13.8MB',
        testCases: [
          { id: 1, status: 'passed', input: '[2,7,11,15], 9', output: '[0,1]', expected: '[0,1]' },
          { id: 2, status: 'passed', input: '[3,2,4], 6', output: '[1,2]', expected: '[1,2]' },
          { id: 3, status: 'failed', input: '[3,3], 6', output: '[0,0]', expected: '[0,1]' },
        ],
      });
      setIsRunning(false);
    }, 1500);
  };

  const handleReset = () => {
    setCode(codeTemplates[selectedLanguage]);
    setTestResults(null);
  };

  const handleLanguageChange = (newLang) => {
    setSelectedLanguage(newLang);
    if (!code || code === codeTemplates[selectedLanguage]) {
      setCode(codeTemplates[newLang]);
    }
  };

  const handleBack = () => {
    navigate(`/practice-detail/${practiceId}`);
  };

  // Initialize code with template
  React.useEffect(() => {
    if (!code) {
      setCode(codeTemplates[selectedLanguage]);
    }
  }, []);

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
      <div className="flex gap-5 h-[calc(100vh-180px)]">
        {/* LEFT PANEL - Problem Description */}
        <div className="w-[45%] flex flex-col gap-4 overflow-y-auto">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="button-white w-fit flex items-center gap-2 px-4"
          >
            <ChevronLeft size={16} />
            Back to Problem
          </button>

          {/* Problem Info */}
          <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-5">
            <h2 className="text-xl font-bold text-[#2d3748] mb-4">
              {practice.title}
            </h2>
            
            <div className="space-y-4">
              {/* Description */}
              <div>
                <h3 className="text-sm font-semibold text-[#2d3748] mb-2">
                  Description
                </h3>
                <p className="text-sm text-[#4a5568] leading-relaxed whitespace-pre-line">
                  {practice.description}
                </p>
              </div>

              {/* Examples */}
              <div>
                <h3 className="text-sm font-semibold text-[#2d3748] mb-2">
                  Examples
                </h3>
                <div className="space-y-3">
                  {practice.examples.map((example, index) => (
                    <div
                      key={index}
                      className="bg-[#f9fafb] border border-[#E5E5E5] rounded-[5px] p-3"
                    >
                      <div className="text-xs font-medium text-[#2d3748] mb-2">
                        Example {index + 1}:
                      </div>
                      <div className="space-y-1 text-xs">
                        <div>
                          <span className="font-medium text-[#7A7574]">Input: </span>
                          <code className="bg-white px-2 py-0.5 rounded text-[#2d3748]">
                            {example.input}
                          </code>
                        </div>
                        <div>
                          <span className="font-medium text-[#7A7574]">Output: </span>
                          <code className="bg-white px-2 py-0.5 rounded text-[#2d3748]">
                            {example.output}
                          </code>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Constraints */}
              <div>
                <h3 className="text-sm font-semibold text-[#2d3748] mb-2">
                  Constraints
                </h3>
                <ul className="space-y-1">
                  {practice.constraints.map((constraint, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-xs text-[#4a5568]"
                    >
                      <Icon
                        icon="mdi:circle-small"
                        width="16"
                        className="text-[#7A7574] flex-shrink-0"
                      />
                      <code className="bg-[#f9fafb] px-1.5 py-0.5 rounded">
                        {constraint}
                      </code>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL - Code Editor */}
        <div className="flex-1 flex flex-col gap-4">
          {/* Toolbar */}
          <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Code size={18} className="text-[#7A7574]" />
              <select
                value={selectedLanguage}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="border border-[#E5E5E5] rounded-[5px] px-3 py-1.5 text-sm bg-white text-[#2d3748] focus:outline-none focus:border-[#ff6b35]"
              >
                {languages.map((lang) => (
                  <option key={lang.value} value={lang.value}>
                    {lang.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReset}
                className="button-white flex items-center gap-2"
              >
                <RotateCcw size={14} />
                Reset
              </button>
              <button
                onClick={handleRunCode}
                disabled={isRunning}
                className="button-white flex items-center gap-2"
              >
                <Icon icon="mdi:play-outline" width="16" />
                {isRunning ? 'Running...' : 'Run Code'}
              </button>
              <button
                onClick={handleSubmit}
                disabled={isRunning}
                className="button-orange flex items-center gap-2"
              >
                <Send size={14} />
                {isRunning ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>

          {/* Code Editor */}
          <div className="flex-1 bg-white border border-[#E5E5E5] rounded-[8px] overflow-hidden flex flex-col">
            <div className="bg-[#2d3748] px-4 py-2 text-white text-sm font-medium flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon icon="mdi:code-braces" width="18" />
                Code Editor
              </div>
              <div className="text-xs text-[#9ca3af]">
                {languages.find((l) => l.value === selectedLanguage)?.label}
              </div>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 p-4 font-mono text-sm bg-[#1e1e1e] text-[#d4d4d4] resize-none focus:outline-none"
              spellCheck="false"
            />
          </div>

          {/* Test Results */}
          <div className="bg-white border border-[#E5E5E5] rounded-[8px] overflow-hidden max-h-[250px] flex flex-col">
            <div className="bg-[#f9fafb] px-4 py-2 border-b border-[#E5E5E5] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Icon
                  icon="mdi:test-tube"
                  width="18"
                  className="text-[#7A7574]"
                />
                <h3 className="text-sm font-semibold text-[#2d3748]">
                  Test Results
                </h3>
              </div>
              {testResults && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-[#7A7574]">
                    {testResults.passed}/{testResults.total} passed
                  </span>
                  <span className="text-[#7A7574]">•</span>
                  <span className="text-[#7A7574]">{testResults.runtime}</span>
                </div>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {!testResults ? (
                <div className="text-center py-6 text-sm text-[#7A7574]">
                  Run your code to see test results here
                </div>
              ) : (
                <div className="space-y-2">
                  {testResults.status === 'accepted' && (
                    <div className="bg-[#e6f4ea] border border-[#34a853] rounded-[5px] p-3 mb-3">
                      <div className="flex items-center gap-2 text-[#34a853]">
                        <Icon icon="mdi:check-circle" width="20" />
                        <span className="font-semibold text-sm">Accepted!</span>
                      </div>
                      <div className="text-xs text-[#4a5568] mt-1">
                        All test cases passed • Runtime: {testResults.runtime} • Memory: {testResults.memory}
                      </div>
                    </div>
                  )}

                  {testResults.testCases.map((testCase) => (
                    <div
                      key={testCase.id}
                      className={`border rounded-[5px] p-3 text-xs ${
                        testCase.status === 'passed'
                          ? 'border-[#34a853] bg-[#e6f4ea]'
                          : 'border-[#ea4335] bg-[#fce8e6]'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Icon
                            icon={
                              testCase.status === 'passed'
                                ? 'mdi:check-circle'
                                : 'mdi:close-circle'
                            }
                            width="16"
                            className={
                              testCase.status === 'passed'
                                ? 'text-[#34a853]'
                                : 'text-[#ea4335]'
                            }
                          />
                          <span className="font-medium">Test Case {testCase.id}</span>
                        </div>
                        <span
                          className={`text-xs font-medium ${
                            testCase.status === 'passed'
                              ? 'text-[#34a853]'
                              : 'text-[#ea4335]'
                          }`}
                        >
                          {testCase.status === 'passed' ? 'Passed' : 'Failed'}
                        </span>
                      </div>
                      <div className="space-y-1 text-[#4a5568]">
                        <div>
                          <span className="font-medium">Input: </span>
                          <code className="bg-white px-1 py-0.5 rounded">
                            {testCase.input}
                          </code>
                        </div>
                        <div>
                          <span className="font-medium">Output: </span>
                          <code className="bg-white px-1 py-0.5 rounded">
                            {testCase.output}
                          </code>
                        </div>
                        {testCase.status === 'failed' && (
                          <div>
                            <span className="font-medium">Expected: </span>
                            <code className="bg-white px-1 py-0.5 rounded">
                              {testCase.expected}
                            </code>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}

export default PracticeStart;
