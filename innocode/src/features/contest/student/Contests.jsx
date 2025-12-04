import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageContainer from '@/shared/components/PageContainer';
import Search from '@/shared/components/search/Search';
import Filter from '@/shared/components/search/Filter';
import ContestCard from '@/shared/components/contest/ContestCard';
import { BREADCRUMBS } from '@/config/breadcrumbs';
import useContests from '../hooks/useContests';
import { Icon } from '@iconify/react';

const Contests = () => {
  const [hasFilter, setHasFilter] = useState(true);
  const navigate = useNavigate();
  const { contests, loading, error, searchTerm, searchContests } = useContests();
  const [inputValue, setInputValue] = useState(''); // Input value (can change while typing)
  
  // Filter only by status since search is now handled by backend
  // Filter out Draft contests
  const filteredContests = useMemo(() => {
    if (!contests || !Array.isArray(contests)) {
      return [];
    }

    return contests.filter((contest) => contest.status !== 'Draft');
  }, [contests]);

  // Group by status - use status field directly
  const ongoingContests = filteredContests.filter((c) => {
    const status = c.status?.toLowerCase() || '';
    return status === 'ongoing' || status === 'registrationopen' || status === 'registrationclosed';
  });

  const upcomingContests = filteredContests.filter((c) => {
    const status = c.status?.toLowerCase() || '';
    // Check if contest is published/registration open but not ongoing/completed
    if (status === 'published' || status === 'registrationopen') {
      // Check dates to determine if it's upcoming
      if (c.start) {
        const now = new Date();
        const start = new Date(c.start);
        return now < start;
      }
      return true;
    }
    return false;
  });

  const completedContests = filteredContests.filter((c) => {
    const status = c.status?.toLowerCase() || '';
    return status === 'completed' || (c.end && new Date() > new Date(c.end));
  });

  const handleSearch = (term) => {
    // Only trigger search when user clicks search button or presses Enter
    searchContests(term);
  };
   
  const handleInputChange = (e) => {
    // Update input value without triggering search
    setInputValue(e.target.value);
  };
  
  const handleFilterRemove = () => {
    setHasFilter(false);
    setInputValue('');
    searchContests(''); // Clear search
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
          <Search 
            placeholder="Search Contests" 
            onSearch={handleSearch}
            value={inputValue}
            onChange={handleInputChange}
          />
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
          <Search 
            placeholder="Search Contests" 
            onSearch={handleSearch}
            value={inputValue}
            onChange={handleInputChange}
          />
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
