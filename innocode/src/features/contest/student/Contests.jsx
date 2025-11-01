import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageContainer from "@/shared/components/PageContainer";
import Search from "@/shared/components/search/Search";
import Filter from "@/shared/components/search/Filter";
import ContestCard from "@/shared/components/contest/ContestCard";
import { contestsData } from '@/data/contestsData';
import { BREADCRUMBS } from '@/config/breadcrumbs';

const Contests = () => {
  const [hasFilter, setHasFilter] = useState(true);
  const navigate = useNavigate();

  const handleSearch = (searchTerm) => {
    console.log("Searching for:", searchTerm);
    // Add your search logic here
  };

  const handleFilterRemove = () => {
    setHasFilter(false);
    console.log("Filter removed");
  };

  const handleContestClick = (contest) => {
    console.log("Clicked contest:", contest);
    navigate(`/contest-detail/${contest.id}`);
  };

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
        <div className="contests-list flex flex-col gap-4">
          {contestsData.map((contest) => (
            <ContestCard
              key={contest.id}
              contest={contest}
              onClick={() => handleContestClick(contest)}
            />
          ))}
        </div>
        </div>
   
       
    </PageContainer>
  );
};

export default Contests;
