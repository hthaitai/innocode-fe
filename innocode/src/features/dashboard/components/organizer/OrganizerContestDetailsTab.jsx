import React from "react"
import { useTranslation } from "react-i18next"
import { Trophy, Users, Target, CheckCircle } from "lucide-react"
import "@/styles/typography.css"

const OrganizerContestDetailsTab = ({
  contestDetails,
  selectedContestId,
  setSelectedContestId,
  isLoading,
  error,
}) => {
  const { t } = useTranslation(["pages", "common", "contest"])

  return (
    <div className="space-y-4">
      {/* Contest Selector */}
      <div className="bg-white border border-[#E5E5E5] rounded-[5px] p-4">
        <label className="block text-caption-1-strong text-gray-700 mb-2">
          {t("dashboard.contestDetails.selectContest", "Select Contest")}
        </label>
        <input
          type="text"
          placeholder={t(
            "dashboard.contestDetails.enterContestId",
            "Enter Contest ID",
          )}
          value={selectedContestId}
          onChange={(e) => setSelectedContestId(e.target.value)}
          className="w-full px-3 py-2 border border-[#E5E5E5] rounded-[5px] text-body-1 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <p className="text-caption-1 text-gray-500 mt-2">
          {t(
            "dashboard.contestDetails.hint",
            "Enter a contest ID to view detailed metrics",
          )}
        </p>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-body-1 text-gray-600">
            {t("common.loading", "Loading...")}
          </div>
        </div>
      )}

      {/* Error State */}
      {error && selectedContestId && (
        <div className="bg-white border border-[#E5E5E5] rounded-[5px] p-8 text-center">
          <div className="text-body-1 text-red-600">
            {t("common.error", "Error loading contest details")}
          </div>
        </div>
      )}

      {/* Contest Details */}
      {!isLoading && !error && contestDetails && (
        <div className="space-y-4">
          {/* Contest Info */}
          <div className="bg-white border border-[#E5E5E5] rounded-[5px] p-5">
            <h3 className="text-subtitle-2 text-gray-800 mb-4">
              {contestDetails.contestName ||
                t(
                  "dashboard.contestDetails.contestInfo",
                  "Contest Information",
                )}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-caption-1 text-gray-600">
                  {t("dashboard.contestDetails.contestId", "Contest ID")}:
                </span>
                <span className="text-body-1 text-gray-800 ml-2">
                  {selectedContestId}
                </span>
              </div>
              <div>
                <span className="text-caption-1 text-gray-600">
                  {t("dashboard.contestDetails.status", "Status")}:
                </span>
                <span className="text-body-1 text-gray-800 ml-2">
                  {contestDetails.status || "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Teams */}
            <div className="bg-white border border-[#E5E5E5] rounded-[5px] p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-500" />
                </div>
                <span className="text-caption-1 text-gray-600">
                  {t("dashboard.contestDetails.totalTeams", "Total Teams")}
                </span>
              </div>
              <div className="text-title-2 text-gray-800">
                {contestDetails.totalTeams || 0}
              </div>
            </div>

            {/* Total Participants */}
            <div className="bg-white border border-[#E5E5E5] rounded-[5px] p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center">
                  <Users className="w-5 h-5 text-purple-500" />
                </div>
                <span className="text-caption-1 text-gray-600">
                  {t(
                    "dashboard.contestDetails.totalParticipants",
                    "Total Participants",
                  )}
                </span>
              </div>
              <div className="text-title-2 text-gray-800">
                {contestDetails.totalParticipants || 0}
              </div>
            </div>

            {/* Total Rounds */}
            <div className="bg-white border border-[#E5E5E5] rounded-[5px] p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                  <Target className="w-5 h-5 text-orange-500" />
                </div>
                <span className="text-caption-1 text-gray-600">
                  {t("dashboard.contestDetails.totalRounds", "Total Rounds")}
                </span>
              </div>
              <div className="text-title-2 text-gray-800">
                {contestDetails.totalRounds || 0}
              </div>
            </div>

            {/* Completed Rounds */}
            <div className="bg-white border border-[#E5E5E5] rounded-[5px] p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                </div>
                <span className="text-caption-1 text-gray-600">
                  {t(
                    "dashboard.contestDetails.completedRounds",
                    "Completed Rounds",
                  )}
                </span>
              </div>
              <div className="text-title-2 text-gray-800">
                {contestDetails.completedRounds || 0}
              </div>
            </div>
          </div>

          {/* Additional Details */}
          {contestDetails.additionalMetrics && (
            <div className="bg-white border border-[#E5E5E5] rounded-[5px] p-5">
              <h3 className="text-subtitle-2 text-gray-800 mb-4">
                {t(
                  "dashboard.contestDetails.additionalMetrics",
                  "Additional Metrics",
                )}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(contestDetails.additionalMetrics).map(
                  ([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="text-caption-1 text-gray-600">
                        {key}:
                      </span>
                      <span className="text-body-1 text-gray-800">{value}</span>
                    </div>
                  ),
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!selectedContestId && !isLoading && (
        <div className="bg-white border border-[#E5E5E5] rounded-[5px] p-8 text-center">
          <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <p className="text-body-1 text-gray-600">
            {t(
              "dashboard.contestDetails.emptyState",
              "Enter a contest ID above to view detailed metrics",
            )}
          </p>
        </div>
      )}
    </div>
  )
}

export default OrganizerContestDetailsTab
