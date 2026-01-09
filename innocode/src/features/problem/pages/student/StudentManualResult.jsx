import React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import PageContainer from "@/shared/components/PageContainer"
import { Icon } from "@iconify/react"
import { useFetchManualResultsQuery } from "@/services/manualProblemApi"
import { formatDateTime } from "@/shared/utils/dateTime"

const StudentManualResult = () => {
  const { t, i18n } = useTranslation("pages")
  const { contestId, roundId } = useParams()
  const navigate = useNavigate()

  // Fetch manual result for the student
  const {
    data: resultData,
    isLoading,
    isError,
    error,
  } = useFetchManualResultsQuery({
    roundId,
    pageNumber: 1,
    pageSize: 1,
  })

  // Extract result from response
  const result = resultData?.results?.[0]

  if (isLoading) {
    return (
      <PageContainer bg={false}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">
              {t("manualResultPage.loadingResult")}
            </p>
          </div>
        </div>
      </PageContainer>
    )
  }

  if (isError) {
    return (
      <PageContainer bg={false}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <Icon
              icon="mdi:alert-circle-outline"
              className="w-20 h-20 text-red-500 mx-auto mb-4"
            />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {t("manualResultPage.failedToFetch")}
            </h3>
            <p className="text-gray-600 mb-4">
              {error?.data?.message ||
                error?.message ||
                t("manualResultPage.errorLoadingResult")}
            </p>
            <button
              onClick={() =>
                contestId
                  ? navigate(`/contest-detail/${contestId}`)
                  : navigate(`/contests`)
              }
              className="button-orange"
            >
              <Icon icon="mdi:arrow-left" className="inline mr-2" />
              {contestId
                ? t("manualResultPage.backToContest")
                : t("manualResultPage.backToContests")}
            </button>
          </div>
        </div>
      </PageContainer>
    )
  }

  if (!result) {
    return (
      <PageContainer bg={false}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <Icon
              icon="mdi:file-document-outline"
              className="w-20 h-20 text-gray-400 mx-auto mb-4"
            />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {t("manualResultPage.noResultYet")}
            </h3>
            <p className="text-gray-600 mb-4">
              {t("manualResultPage.noResultDescription")}
            </p>
            <button
              onClick={() =>
                contestId
                  ? navigate(`/contest-detail/${contestId}`)
                  : navigate(`/contests`)
              }
              className="button-orange"
            >
              <Icon icon="mdi:arrow-left" className="inline mr-2" />
              {contestId
                ? t("manualResultPage.backToContest")
                : t("manualResultPage.backToContests")}
            </button>
          </div>
        </div>
      </PageContainer>
    )
  }

  return (
    <PageContainer bg={false}>
      <div className="max-w-3xl mx-auto py-12 px-6">
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-8 text-center text-white">
            <Icon
              icon="mdi:file-check"
              className="w-24 h-24 mx-auto mb-4 drop-shadow-lg"
            />
            <h2 className="text-3xl font-bold mb-2">
              {t("manualResultPage.resultReady")}
            </h2>
            <p className="text-blue-50 text-lg">
              {t("manualResultPage.yourSubmissionEvaluated")}
            </p>
          </div>

          {/* Result Info Section */}
          <div className="p-8">
            {/* Student and Team Info */}
            {(result.studentName || result.teamName) && (
              <div className="mb-6 pb-6 border-b border-gray-200">
                {result.studentName && (
                  <p className="text-gray-600 mb-1">
                    <span className="font-semibold text-gray-700">
                      {t("manualResultPage.student")}:
                    </span>{" "}
                    {result.studentName}
                  </p>
                )}
                {result.teamName && (
                  <p className="text-gray-600">
                    <span className="font-semibold text-gray-700">
                      {t("manualResultPage.team")}:
                    </span>{" "}
                    {result.teamName}
                  </p>
                )}
              </div>
            )}

            {/* Score Display */}
            <div className="mb-8">
              <div className="text-center bg-orange-50 rounded-lg p-6 border border-orange-100">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  {t("manualResultPage.yourScore")}
                </p>
                <div className="text-6xl font-bold text-orange-500 mb-2">
                  {result.totalScore ?? "--"}
                </div>
                {result.maxPossibleScore !== undefined && (
                  <p className="text-gray-500 mb-2">
                    {t("manualResultPage.outOf")} {result.maxPossibleScore}{" "}
                    {t("manualResultPage.points")}
                  </p>
                )}
                {result.totalScore !== undefined &&
                  result.maxPossibleScore > 0 && (
                    <p className="text-lg font-semibold text-gray-700">
                      <span className="text-orange-600">
                        {Math.round(
                          (result.totalScore / result.maxPossibleScore) * 100
                        )}
                        %
                      </span>
                    </p>
                  )}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* Submitted At */}
              {result.submittedAt && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Icon
                        icon="mdi:clock-end"
                        className="w-6 h-6 text-purple-600"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        {t("manualResultPage.submittedAt")}
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {formatDateTime(result.submittedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Judged By */}
              {result.judgedBy && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Icon
                        icon="mdi:account-check"
                        className="w-6 h-6 text-green-600"
                      />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase">
                        {t("manualResultPage.judgedBy")}
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {result.judgedBy}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Rubric Scores */}
            {result.criteriaScores && result.criteriaScores.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {t("manualResultPage.evaluationCriteria")}
                </h3>
                <div className="space-y-3">
                  {result.criteriaScores.map((criteria, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-gray-800">
                          {criteria.criteriaName ||
                            `${t("manualResultPage.criteria")} ${index + 1}`}
                        </h4>
                        <span className="text-lg font-bold text-orange-500">
                          {criteria.score ?? 0} / {criteria.maxScore ?? 0}
                        </span>
                      </div>
                      {criteria.description && (
                        <p className="text-sm text-gray-600 mb-2">
                          {criteria.description}
                        </p>
                      )}
                      {/* Progress bar */}
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${
                              criteria.maxScore > 0
                                ? (criteria.score / criteria.maxScore) * 100
                                : 0
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={() =>
                  contestId
                    ? navigate(`/contest-detail/${contestId}`)
                    : navigate(`/contests`)
                }
                className="button-orange flex items-center gap-2"
              >
                <Icon icon="mdi:arrow-left" className="w-5 h-5" />
                <div>
                  {contestId
                    ? t("manualResultPage.backToContest")
                    : t("manualResultPage.backToContests")}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  )
}

export default StudentManualResult
