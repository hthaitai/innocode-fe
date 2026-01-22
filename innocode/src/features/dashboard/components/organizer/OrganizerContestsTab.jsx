import React from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"
import "@/styles/typography.css"
import OrganizerContestCard from "./OrganizerContestCard"
import TablePagination from "@/shared/components/TablePagination"

const OrganizerContestsTab = ({
  contests,
  pagination,
  setPage,
  refetch,
  isConnected,
}) => {
  const { t } = useTranslation(["pages", "common", "contest", "dashboard"])

  const handlePageChange = (newPage) => {
    setPage(newPage)
  }

  return (
    <div>
      {/* Contests List & Pagination */}
      {contests.length === 0 ? (
        <div className="bg-white border border-[#E5E5E5] rounded-[5px] p-12 text-center text-gray-500">
          {t("dashboard.contests.noContests", "No contests found")}
        </div>
      ) : (
        <>
          <div className="space-y-1">
            {contests.map((contest) => (
              <OrganizerContestCard
                key={contest.id || contest.contestId}
                contest={contest}
              />
            ))}
          </div>

          <TablePagination
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  )
}

export default OrganizerContestsTab
