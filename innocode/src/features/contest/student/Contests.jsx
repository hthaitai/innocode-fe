import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/shared/components/PageContainer';
import Search from '@/shared/components/search/Search';
import Filter from '@/shared/components/search/Filter';
import ContestCard from '@/shared/components/contest/ContestCard';
import { contestsData } from '@/data/contestsData';
import { BREADCRUMBS } from '@/config/breadcrumbs';
import useContests from '../hooks/useContests';
import { Icon } from '@iconify/react';

const Contests = () => {
  const [hasFilter, setHasFilter] = useState(true);
  const navigate = useNavigate();
  const { contests, loading, error } = useContests();
  const [searchTerm, setSearchTerm] = useState('');
  const filteredContests = useMemo(() => {
    if (!contests || !Array.isArray(contests)) {
      return [];
    }

    return contests
      .filter((contest) => contest.isStatusVisible) // ✅ Use isStatusVisible instead of !isDraft
      .filter((contest) => {
        if (!searchTerm) return true;
        return (
          contest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contest.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
  }, [contests, searchTerm]);

  // Group by status - update logic
  const ongoingContests = filteredContests.filter(
    (c) => c.isOngoing || c.isRegistrationOpen || c.isRegistrationClosed
  );

  const upcomingContests = filteredContests.filter(
    (c) => c.isPublished && !c.isOngoing && !c.isCompleted
  );

  const completedContests = filteredContests.filter((c) => c.isCompleted);

  const handleSearch = (term) => {
    setSearchTerm(term);
  };
  const handleFilterRemove = () => {
    setHasFilter(false);
    setSearchTerm('');
  };

  const handleContestClick = (contest) => {
    navigate(`/contest-detail/${contest.contestId}`);
  };
  if (loading) {
    return (
      <PageContainer breadcrumb={BREADCRUMBS.CONTESTS} bg={false}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600 font-medium">Loading contests...</p>
          </div>
        </div>
      </PageContainer>
    );
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
              Failed to Load Contests
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="button-orange"
            >
              <Icon icon="mdi:refresh" className="inline mr-2" />
              Retry
            </button>
          </div>
        </div>
      </PageContainer>
    );
  }

  // Empty state (no contests or all filtered out)
  if (filteredContests.length === 0) {
    return (
      <PageContainer breadcrumb={BREADCRUMBS.CONTESTS} bg={false}>
        <div className="w-full flex flex-col gap-[14px]">
          <div>
            <Search placeholder="Search Contests" onSearch={handleSearch} />
            {hasFilter && (
              <Filter
                selectedFilter={hasFilter}
                onFilterRemove={handleFilterRemove}
                label="All Contests"
              />
            )}
          </div>

          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Icon
                icon="mdi:trophy-outline"
                className="w-20 h-20 text-gray-400 mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                {searchTerm ? 'No contests found' : 'No contests available'}
              </h3>
              <p className="text-gray-500">
                {searchTerm
                  ? 'Try adjusting your search terms'
                  : 'Check back later for upcoming contests!'}
              </p>
            </div>
          </div>
        </div>
      </PageContainer>
    );
  }
  return (
    <PageContainer breadcrumb={BREADCRUMBS.CONTESTS} bg={false}>
      <div className="w-full flex flex-col gap-[14px]">
        <div>
          <Search placeholder="Search Contests" onSearch={handleSearch} />
          {hasFilter && (
            <Filter
              selectedFilter={hasFilter}
              onFilterRemove={handleFilterRemove}
              label="All Contests"
            />
          )}
        </div>
        {/* Ongoing Contests */}
        {ongoingContests.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <Icon icon="mdi:fire" className="text-red-500 text-2xl" />
              Ongoing Contests
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
              Upcoming Contests
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
              Past Contests
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
      </div>
    </PageContainer>
  );
};

export default Contests;
