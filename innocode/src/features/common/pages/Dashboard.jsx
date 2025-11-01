import React from 'react';
import PageContainer from "@/shared/components/PageContainer";
import { BREADCRUMBS } from '@/config/breadcrumbs';

const Dashboard = () => {
  return (
    <PageContainer breadcrumb={BREADCRUMBS.DASHBOARD}>
      <p className="text-gray-600">View your progress and statistics</p>
    </PageContainer>
  );
};

export default Dashboard;
