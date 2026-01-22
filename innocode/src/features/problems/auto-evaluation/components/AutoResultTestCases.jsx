import React from "react"
import { CheckCircle2, XCircle, Terminal } from "lucide-react"
import { useTranslation } from "react-i18next"

const AutoResultTestCases = ({ details }) => {
  const { t } = useTranslation("common")
  return (
    <div className="space-y-1">
      {details.length === 0 ? (
        <div className="text-[#7A7574] text-xs leading-4 border border-[#E5E5E5] rounded-[5px] bg-white px-5 flex justify-center items-center min-h-[70px]">
          {t("common.noTestCasesAvailable")}
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
                  <span>
                    {t("common.testCase")} {index + 1}{" "}
                  </span>

                  {/* Weight | Runtime | Memory */}
                  <div className="text-xs leading-4 text-[#7A7574] flex items-center gap-[10px]">
                    <span>
                      {t("common.weight")}: {testCase.weight}
                    </span>
                    <p>|</p>
                    {testCase.runtimeMs !== null &&
                      testCase.runtimeMs !== undefined && (
                        <span>
                          {t("common.runtime")}: {testCase.runtimeMs}ms
                        </span>
                      )}
                    <p>|</p>
                    {testCase.memoryKb !== null &&
                      testCase.memoryKb !== undefined && (
                        <span>
                          {t("common.memory")}: {testCase.memoryKb}KB
                        </span>
                      )}
                  </div>
                </div>
              </div>

              <span
                className={`font-semibold ${
                  testCase.note?.toLowerCase().includes("success")
                    ? "text-green-700"
                    : "text-red-700"
                }`}
              >
                {testCase.note?.toLowerCase().includes("success")
                  ? t("common.passed").toUpperCase()
                  : t("common.failed").toUpperCase()}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default AutoResultTestCases
