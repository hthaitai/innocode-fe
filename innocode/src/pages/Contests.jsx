import React, { useState } from "react";
import PageContainer from "../components/PageContainer";
import Search from "../components/search/Search";
import Filter from "../components/search/Filter";
import ContestCard from "../components/contest/ContestCard";
import { contestsData } from "../data/contestsData";

const Contests = () => {
  const [hasFilter, setHasFilter] = useState(true);

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
    // Add navigation logic here
  };

  return (
    <PageContainer title="Contests" bg={false}>
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
        <div className="contests-list">
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
