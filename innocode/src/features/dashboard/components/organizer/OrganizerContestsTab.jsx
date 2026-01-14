import React, { useState } from "react"
import { useTranslation } from "react-i18next"
import { useGetOrganizerDashboardContestsQuery } from "@/services/dashboardApi"
import { useNavigate } from "react-router-dom"
import "@/styles/typography.css"

const OrganizerContestsTab = () => {
  const { t } = useTranslation(["pages", "common", "contest"])
  const navigate = useNavigate()
  const [page, setPage] = useState(0)
  const [size, setSize] = useState(10)

  const {
    data: contestsData,
    isLoading,
    error,
  } = useGetOrganizerDashboardContestsQuery({ page, size })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-body-1 text-gray-600">
          {t("common.loading", "Loading...")}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-body-1 text-red-600">
          {t("common.error", "Error loading contests")}
        </div>
      </div>
    )
  }

  const contests = contestsData?.items || []
  const totalPages = contestsData?.totalPages || 0
  const totalElements = contestsData?.totalElements || 0

  // Function to translate status
  const translateStatus = (status) => {
    const statusKey = status?.toLowerCase().replace(/\s+/g, "")
    return t(`contest.statusLabels.${statusKey}`, status)
  }

  // Function to get status badge color
  const getStatusBadgeColor = (status) => {
    const name = status?.toLowerCase()
    if (name === "published") return "bg-purple-100 text-purple-700"
    if (name === "registrationopen") return "bg-cyan-100 text-cyan-700"
    if (name === "registrationclosed") return "bg-slate-100 text-slate-700"
    if (name === "ongoing") return "bg-green-100 text-green-700"
    if (name === "paused") return "bg-yellow-100 text-yellow-700"
    if (name === "completed") return "bg-blue-100 text-blue-700"
    if (name === "delayed") return "bg-orange-100 text-orange-700"
    if (name === "draft") return "bg-gray-100 text-gray-700"
    if (name === "cancelled") return "bg-red-100 text-red-700"
    return "bg-pink-100 text-pink-700"
  }

  const formatDate = (dateString) => {
    if (!dateString) return "-"
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "2-digit",
      })
    } catch {
      return dateString
    }
  }

  const handleContestClick = (contestId) => {
    navigate(`/organizer/contests/${contestId}`)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-subtitle-2 text-gray-800">
            {t("dashboard.contests.title", "My Contests")}
          </h3>
          <p className="text-caption-1 text-gray-600 mt-1">
            {t("dashboard.contests.total", "Total")}: {totalElements}{" "}
            {t("dashboard.contests.contests", "contests")}
          </p>
        </div>
      </div>

      {/* Contests Table */}
      {contests.length === 0 ? (
        <div className="bg-white border border-[#E5E5E5] rounded-[5px] p-8 text-center">
          <p className="text-body-1 text-gray-600">
            {t("dashboard.contests.noContests", "No contests found")}
          </p>
        </div>
      ) : (
        <div className="bg-white border border-[#E5E5E5] rounded-[5px] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-[#E5E5E5]">
                <tr>
                  <th className="px-4 py-3 text-left text-caption-1-strong text-gray-700">
                    {t("dashboard.contests.table.name", "Contest Name")}
                  </th>
                  <th className="px-4 py-3 text-left text-caption-1-strong text-gray-700">
                    {t("dashboard.contests.table.status", "Status")}
                  </th>
                  <th className="px-4 py-3 text-left text-caption-1-strong text-gray-700">
                    {t("dashboard.contests.table.startDate", "Start Date")}
                  </th>
                  <th className="px-4 py-3 text-left text-caption-1-strong text-gray-700">
                    {t("dashboard.contests.table.endDate", "End Date")}
                  </th>
                  <th className="px-4 py-3 text-left text-caption-1-strong text-gray-700">
                    {t("dashboard.contests.table.teams", "Teams")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E5]">
                {contests.map((contest) => (
                  <tr
                    key={contest.id}
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => handleContestClick(contest.id)}
                  >
                    <td className="px-4 py-3 text-body-1 text-gray-800">
                      {contest.name || "-"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex px-2 py-1 rounded-full text-caption-1-strong ${getStatusBadgeColor(
                          contest.status
                        )}`}
                      >
                        {translateStatus(contest.status)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-body-1 text-gray-600">
                      {formatDate(contest.startDate)}
                    </td>
                    <td className="px-4 py-3 text-body-1 text-gray-600">
                      {formatDate(contest.endDate)}
                    </td>
                    <td className="px-4 py-3 text-body-1 text-gray-600">
                      {contest.totalTeams || 0}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-[#E5E5E5]">
              <div className="text-caption-1 text-gray-600">
                {t("common.pagination.showing", "Showing")} {page * size + 1} -{" "}
                {Math.min((page + 1) * size, totalElements)}{" "}
                {t("common.pagination.of", "of")} {totalElements}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-3 py-1.5 text-caption-1-strong text-gray-700 bg-white border border-[#E5E5E5] rounded-[5px] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {t("common.pagination.previous", "Previous")}
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`px-3 py-1.5 text-caption-1-strong rounded-[5px] transition-colors ${
                        page === i
                          ? "bg-orange-500 text-white"
                          : "bg-white text-gray-700 border border-[#E5E5E5] hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() =>
                    setPage((p) => Math.min(totalPages - 1, p + 1))
                  }
                  disabled={page >= totalPages - 1}
                  className="px-3 py-1.5 text-caption-1-strong text-gray-700 bg-white border border-[#E5E5E5] rounded-[5px] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {t("common.pagination.next", "Next")}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default OrganizerContestsTab
