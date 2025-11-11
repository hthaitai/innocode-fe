import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageContainer from "@/shared/components/PageContainer";
import { Icon } from "@iconify/react";
import { ArrowLeft, Code, Play, CheckCircle } from "lucide-react";

const StudentAutoEvaluation = () => {
  const { contestId, roundId } = useParams();
  const navigate = useNavigate();
  const [code, setCode] = useState("");

  const handleSubmit = () => {
    // TODO: Implement auto evaluation submission
    console.log("Submitting code for auto evaluation:", code);
  };

  return (
    <PageContainer
      bg={false}
    >
      <div className="max-w-6xl mt-[38px] mx-auto">
        {/* Header */}
        <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6 mb-4">
          <button
            onClick={() => navigate(`/contest-detail/${contestId}`)}
            className="flex items-center gap-2 text-[#7A7574] hover:text-[#ff6b35] mb-4 transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="text-sm">Back to Contest</span>
          </button>

          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-[#ff6b35] text-white flex items-center justify-center">
              <Code size={20} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2d3748]">
                Auto Evaluation Challenge
              </h1>
              <p className="text-sm text-[#7A7574]">Round ID: {roundId}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Problem Description */}
          <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6">
            <h2 className="text-lg font-semibold text-[#2d3748] mb-4">
              Problem Statement
            </h2>
            <div className="text-[#4a5568] space-y-3">
              <p>
                Write a function that solves the given problem. Your code will
                be automatically evaluated against test cases.
              </p>

              <div className="bg-[#f9fafb] border border-[#E5E5E5] rounded-[5px] p-4">
                <h3 className="font-semibold text-[#2d3748] mb-2 text-sm">
                  Example:
                </h3>
                <pre className="text-xs font-mono text-[#4a5568]">
                  Input: [1, 2, 3, 4, 5]{"\n"}
                  Output: 15
                </pre>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-[#2d3748] text-sm">
                  Constraints:
                </h3>
                <ul className="text-sm text-[#4a5568] space-y-1 list-disc list-inside">
                  <li>Time limit: 1 second</li>
                  <li>Memory limit: 256 MB</li>
                  <li>Input size: 1 ≤ n ≤ 10^6</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Code Editor */}
          <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6">
            <h2 className="text-lg font-semibold text-[#2d3748] mb-4 flex items-center gap-2">
              <Code size={20} className="text-[#ff6b35]" />
              Your Solution
            </h2>

            <div className="mb-4">
              <select className="w-full px-3 py-2 border border-[#E5E5E5] rounded-[5px] text-sm">
                <option>Python 3</option>
                <option>JavaScript</option>
                <option>Java</option>
                <option>C++</option>
              </select>
            </div>

            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="# Write your code here..."
              className="w-full h-[300px] p-4 border border-[#E5E5E5] rounded-[5px] font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#ff6b35]"
            />

            <div className="flex gap-3 mt-4">
              <button className="flex-1 button-white flex items-center justify-center gap-2">
                <Play size={16} />
                Run Code
              </button>
              <button
                onClick={handleSubmit}
                className="flex-1 button-orange flex items-center justify-center gap-2"
              >
                <CheckCircle size={16} />
                Submit
              </button>
            </div>
          </div>
        </div>

        {/* Test Results */}
        <div className="bg-white border border-[#E5E5E5] rounded-[8px] p-6 mt-4">
          <h2 className="text-lg font-semibold text-[#2d3748] mb-4">
            Test Results
          </h2>
          <div className="text-center py-8 text-[#7A7574]">
            <Icon
              icon="mdi:test-tube"
              width="48"
              className="mx-auto mb-2 opacity-50"
            />
            <p>Run your code to see test results</p>
          </div>
        </div>

        {/* Info Notice */}
        <div className="bg-[#e6f4ea] border border-[#34a853] rounded-[8px] p-4 mt-4">
          <div className="flex items-start gap-2">
            <Icon
              icon="mdi:information"
              width="20"
              className="text-[#34a853] flex-shrink-0 mt-0.5"
            />
            <div className="text-sm">
              <p className="font-semibold text-[#2d3748] mb-1">
                Auto Evaluation
              </p>
              <p className="text-[#4a5568]">
                Your code will be tested against multiple test cases
                automatically. Make sure it handles all edge cases correctly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default StudentAutoEvaluation;
