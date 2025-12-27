import React from "react"
import { CheckCircle2, XCircle, Terminal } from "lucide-react"

const AutoResultTestCases = ({ details }) => {
  if (!details || details.length === 0) return null

  return (
    <div className="space-y-1">
      {details.length === 0 ? (
        <div className="text-[#7A7574] text-xs leading-4 border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-center items-center min-h-[70px]">
          No test cases available.
        </div>
      ) : (
        details.map((testCase, index) => (
          <div
            key={testCase.detailsId || index}
            className="text-sm leading-5 border border-[#E5E5E5] rounded-[5px] bg-white"
          >
            <div className="flex justify-between items-center px-5 min-h-[70px]">
              <div className="flex items-center gap-5">
                {/* Consistent icon for all test cases */}
                <Terminal size={20} />
                <div className="flex flex-col">
                  <span>Test case {index + 1} </span>

                  {/* Weight | Runtime | Memory */}
                  <div className="text-xs leading-4 text-[#7A7574] flex items-center gap-[10px]">
                    <span>Weight: {testCase.weight}</span>
                    <p>|</p>
                    {testCase.runtimeMs && (
                      <span>Runtime: {testCase.runtimeMs}ms</span>
                    )}
                    <p>|</p>
                    {testCase.memoryKb && (
                      <span>Memory: {testCase.memoryKb}KB</span>
                    )}
                  </div>
                </div>
              </div>

              <span
                className={`font-semibold ${
                  testCase.note === "success"
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                {testCase.note === "success" ? "PASSED" : "FAILED"}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default AutoResultTestCases
