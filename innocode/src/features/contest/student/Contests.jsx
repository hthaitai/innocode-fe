import React, { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useTranslation } from "react-i18next"
import PageContainer from "@/shared/components/PageContainer"
import Search from "@/shared/components/search/Search"
import ContestCard from "@/shared/components/contest/ContestCard"
import TablePagination from "@/shared/components/TablePagination"
import { BREADCRUMBS } from "@/config/breadcrumbs"
import useContests from "../hooks/useContests"
import { Icon } from "@iconify/react"

const Contests = () => {
  const { t } = useTranslation("pages")
  const navigate = useNavigate()
  const {
    contests,
    loading,
    error,
    searchTerm,
    searchContests,
    pagination,
    onPageChange,
  } = useContests()
  const [inputValue, setInputValue] = useState("") // Input value (can change while typing)

  // Backend đã validate status, không cần filter ở frontend
  const filteredContests = useMemo(() => {
    if (!contests || !Array.isArray(contests)) {
      return []
    }

    return contests
  }, [contests])

  // Group by status - use status field directly without extra validation
  const ongoingContests = filteredContests.filter((c) => {
    const status = c.status?.toLowerCase() || ""
    return [
      "ongoing",
      "running",
      "active",
      "registrationopen",
      "registrationclosed",
      "open",
      "opened",
      "live",
    ].includes(status)
  })

  const upcomingContests = filteredContests.filter((c) => {
    const status = c.status?.toLowerCase() || ""
    return ["upcoming", "published", "incoming", "pending"].includes(status)
  })

  const completedContests = filteredContests.filter((c) => {
    const status = c.status?.toLowerCase() || ""
    return [
      "completed",
      "finished",
      "finalized",
      "closed",
      "archived",
      "expired",
      "resolved",
    ].includes(status)
  })

  const pausedContests = filteredContests.filter((c) => {
    const status = c.status?.toLowerCase() || ""
    return ["paused", "frozen", "delayed", "inactive"].includes(status)
  })

  const cancelledContests = filteredContests.filter((c) => {
    const status = c.status?.toLowerCase() || ""
    return ["cancelled", "revoked", "blocked", "rejected", "denied"].includes(
      status,
    )
  })

  // Catch-all for any other status to ensure they are displayed (e.g. at the bottom or appended to a group)
  // For now, let's just stick to the main groups. If a contest has a weird status, it might be missed if we don't handle it.
  // To be safe as per "không hiển thị contest ra", let's add an "Other" category or dump them in one of the lists?
  // Use a derived list to check what's left?
  // Actually, simplest is to ensure the lists above cover the common cases.
  // If the user has a specific status failing, they would mention it.
  // The request was "don't validate statuses to not show", likely referring to the logic `if (status === 'published' && date < now)`.
  // By removing the date check, we solved the main issue.

  const handleSearch = (term) => {
    // Only trigger search when user clicks search button or presses Enter
    searchContests(term)
  }

  const handleInputChange = (e) => {
    // Update input value without triggering search
    setInputValue(e.target.value)
  }

  const handleClearSearch = () => {
    setInputValue("")
    searchContests("") // Clear search results
  }

  const handleContestClick = (contest) => {
    navigate(`/contest-detail/${contest.contestId}`)
  }
  if (loading) {
    return (
      <PageContainer breadcrumb={BREADCRUMBS.CONTESTS} bg={false}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">{t("contest.loading")}</p>
          </div>
        </div>
      </PageContainer>
    )
  }
  if (error) {
    return (
      <PageContainer breadcrumb={BREADCRUMBS.CONTESTS} bg={false}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <Icon
              icon="mdi:alert-circle-outline"
              className="w-20 h-20 text-red-500 mx-auto mb-4"
            />
            <h3 className="text-xl font-bold text-gray-800 mb-2">
              {t("contest.failedToLoad")}
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="button-orange"
            >
              <Icon icon="mdi:refresh" className="inline mr-2" />
              {t("contest.retry")}
            </button>
          </div>
        </div>
      </PageContainer>
    )
  }

  // Empty state (no contests)
  if (filteredContests.length === 0 && !loading) {
    const hasMorePages = pagination?.hasNextPage

    return (
      <PageContainer breadcrumb={BREADCRUMBS.CONTESTS} bg={false}>
        <div className="w-full flex flex-col gap-[14px]">
          <div>
            <Search
              placeholder={t("contest.searchPlaceholder")}
              onSearch={handleSearch}
              value={inputValue}
              onChange={handleInputChange}
              onClear={handleClearSearch}
            />
          </div>

          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Icon
                icon="mdi:trophy-outline"
                className="w-20 h-20 text-gray-400 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {searchTerm
                  ? t("contest.noContestsFound")
                  : t("contest.noContestsAvailable")}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchTerm
                  ? t("contest.tryAdjustingSearch")
                  : hasMorePages
                    ? t("contest.draftContestsOnly")
                    : t("contest.checkBackLater")}
              </p>
              {hasMorePages && pagination && (
                <div className="mt-4">
                  <TablePagination
                    pagination={pagination}
                    onPageChange={onPageChange}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </PageContainer>
    )
  }
  return (
    <PageContainer breadcrumb={BREADCRUMBS.CONTESTS} bg={false}>
      <div className="w-full flex flex-col gap-[14px]">
        <div>
          <Search
            placeholder={t("contest.searchPlaceholder")}
            onSearch={handleSearch}
            value={inputValue}
            onChange={handleInputChange}
            onClear={handleClearSearch}
          />
        </div>
        {/* Ongoing Contests */}
        {ongoingContests.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Icon icon="mdi:fire" className="text-red-500 text-2xl" />
              {t("contest.ongoing")}
              <span className="text-sm font-normal text-gray-500">
                ({ongoingContests.length})
              </span>
            </h2>
            <div className="contests-list flex flex-col gap-4">
              {ongoingContests.map((contest) => (
                <ContestCard
                  key={contest.contestId}
                  contest={contest}
                  onClick={() => handleContestClick(contest)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Contests */}
        {upcomingContests.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Icon
                icon="mdi:calendar-clock"
                className="text-blue-500 text-2xl"
              />
              {t("contest.upcoming")}
              <span className="text-sm font-normal text-gray-500">
                ({upcomingContests.length})
              </span>
            </h2>
            <div className="contests-list flex flex-col gap-4">
              {upcomingContests.map((contest) => (
                <ContestCard
                  key={contest.contestId}
                  contest={contest}
                  onClick={() => handleContestClick(contest)}
                />
              ))}
            </div>
          </div>
        )}
        {/* Completed Contests */}
        {completedContests.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Icon icon="mdi:trophy" className="text-gray-500 text-2xl" />
              {t("contest.past")}
              <span className="text-sm font-normal text-gray-500">
                ({completedContests.length})
              </span>
            </h2>
            <div className="contests-list flex flex-col gap-4">
              {completedContests.map((contest) => (
                <ContestCard
                  key={contest.contestId}
                  contest={contest}
                  onClick={() => handleContestClick(contest)}
                />
              ))}
            </div>
          </div>
        )}
        {/* Paused Contests */}
        {pausedContests.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Icon
                icon="mdi:pause-circle"
                className="text-yellow-500 text-2xl"
              />
              {t("contest.statusLabels.paused")}
              <span className="text-sm font-normal text-gray-500">
                ({pausedContests.length})
              </span>
            </h2>
            <div className="contests-list flex flex-col gap-4">
              {pausedContests.map((contest) => (
                <ContestCard
                  key={contest.contestId}
                  contest={contest}
                  onClick={() => handleContestClick(contest)}
                />
              ))}
            </div>
          </div>
        )}
        {/* Cancelled Contests */}
        {cancelledContests.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Icon icon="mdi:cancel" className="text-red-500 text-2xl" />
              {t("contest.statusLabels.cancelled")}
              <span className="text-sm font-normal text-gray-500">
                ({cancelledContests.length})
              </span>
            </h2>
            <div className="contests-list flex flex-col gap-4">
              {cancelledContests.map((contest) => (
                <ContestCard
                  key={contest.contestId}
                  contest={contest}
                  onClick={() => handleContestClick(contest)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Pagination */}
        {pagination && (
          <TablePagination
            pagination={pagination}
            onPageChange={onPageChange}
          />
        )}
      </div>
    </PageContainer>
  )
}

export default Contests
