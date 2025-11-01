import React, { useState } from "react";
import { useParams } from "react-router-dom";
import PageContainer from "@/shared/components/PageContainer";
import { contestsData } from '@/data/contestsData';
import { createBreadcrumbWithPaths, BREADCRUMBS } from '@/config/breadcrumbs';

const ContestProcessing = () => {
  const { contestId } = useParams();
  const contest = contestsData.find((c) => c.id === parseInt(contestId));
  
  const breadcrumbData = contest
    ? createBreadcrumbWithPaths("CONTEST_PROCESSING", contestId)
    : { items: BREADCRUMBS.NOT_FOUND, paths: ["/"] };

  if (!contest) {
    return (
      <PageContainer
        breadcrumb={breadcrumbData.items}
        breadcrumbPaths={breadcrumbData.paths}
      >
        <div className="text-center py-10">
          <p className="text-xl text-gray-600">Contest not found</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      breadcrumb={breadcrumbData.items}
      breadcrumbPaths={breadcrumbData.paths}
      bg={false}
    >
      <div className="page-container">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h1 className="text-2xl font-bold mb-4">{contest.name}</h1>
          <p className="text-gray-600">Contest Processing Page - Đang phát triển</p>
        </div>
      </div>
    </PageContainer>
  );
};

export default ContestProcessing;
