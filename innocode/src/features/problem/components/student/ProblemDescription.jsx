import React from "react";
import { Icon } from "@iconify/react";

/**
 * Component hiển thị problem description
 */
const ProblemDescription = ({ problem, testCase, timeLimitMinutes }) => {
  if (!problem) return null;

  return (
    <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6">
      <h2 className="text-lg font-semibold text-[#2d3748] mb-4">
        Problem Description
      </h2>
      <div className="text-[#4a5568] space-y-3">
        <p>{problem.description}</p>

        {/* Sample Test Case */}
        {testCase && (
          <div className="bg-[#f9fafb] border border-[#E5E5E5] rounded-[5px] p-4">
            <h3 className="font-semibold text-[#2d3748] mb-3 text-sm">
              Sample Test Case
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs font-medium mb-1">Input:</p>
                <pre className="bg-white border border-[#E5E5E5] rounded p-2 text-sm">
                  {testCase.input}
                </pre>
              </div>
              <div>
                <p className="text-xs font-medium mb-1">Expected Output:</p>
                <pre className="bg-white border border-[#E5E5E5] rounded p-2 text-sm">
                  {testCase.expectedOutput}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Problem Details */}
        <div className="bg-[#f9fafb] border border-[#E5E5E5] rounded-[5px] p-4">
          <h3 className="font-semibold text-[#2d3748] mb-2 text-sm">
            Problem Details
          </h3>
          <div className="flex gap-2">
            <Icon width="30" icon="mdi:alert" className="text-[#7A7574]" />
            <span className="text-[#7A7574]">
              You will lose{" "}
              <span className="text-[#dd4b4b] font-medium">
                {(problem.penaltyRate * 100).toFixed(0)}%
              </span>{" "}
              of your total test score for each submission from the second
              attempt onward.
            </span>
          </div>
        </div>

        {/* Constraints */}
        <div className="space-y-2">
          <h3 className="font-semibold text-[#2d3748] text-sm">Constraints:</h3>
          <ul className="text-sm text-[#4a5568] space-y-1 list-disc list-inside">
            <li>Time limit: {timeLimitMinutes} minutes</li>
            <li>Memory limit: 256 MB</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProblemDescription;

