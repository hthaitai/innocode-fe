import React from "react";
import { useParams } from "react-router-dom";
import PageContainer from "../components/PageContainer";
import { contestsData } from "../data/contestsData";
import { createBreadcrumbWithPaths, BREADCRUMBS } from "../config/breadcrumbs";

const ContestProcessing = () => {
  const { contestId } = useParams();
  const contest = contestsData.find((c) => c.id === parseInt(contestId));
  
  const breadcrumbData = contest
    ? createBreadcrumbWithPaths("CONTEST_PROCESSING", contestId)
    : { items: BREADCRUMBS.NOT_FOUND, paths: ['/'] };

  return (
    <PageContainer 
      breadcrumb={breadcrumbData.items} 
      breadcrumbPaths={breadcrumbData.paths}
      bg={false}
    >
      <div className="page-container">
        {contest ? (
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="bg-green-500 h-[280px]">
                {/* Contest Processing Banner */}
                <div className="flex items-center justify-center h-full">
                  <h1 className="text-white text-4xl font-bold">
                    Contest Processing
                  </h1>
                </div>
              </div>
              
              <div className="min-h-[500px] p-6">
                <h2 className="text-2xl font-semibold mb-6">
                  Contest: {contest.title}
                </h2>
                <p className="text-lg">
                  Contest is currently being processed...
                </p>
                {/* Thêm nội dung processing ở đây */}
              </div>
            </div>
          </div>
        ) : (
          <p>Contest not found</p>
        )}
      </div>
    </PageContainer>
  );
};

export default ContestProcessing;