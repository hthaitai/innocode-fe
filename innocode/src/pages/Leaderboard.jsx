import React from 'react';
import PageContainer from '../components/PageContainer';
import { BREADCRUMBS } from '../config/breadcrumbs';

const Leaderboard = () => {
  return (
    <PageContainer breadcrumb={BREADCRUMBS.LEADERBOARD}>
      <p className="text-gray-600">View top performers and rankings</p>
    </PageContainer>
  );
};

export default Leaderboard;
