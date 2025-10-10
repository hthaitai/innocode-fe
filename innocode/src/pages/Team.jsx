import React from 'react';
import PageContainer from '../components/PageContainer';
import { BREADCRUMBS } from '../config/breadcrumbs';

const Team = () => {
  return (
    <PageContainer breadcrumb={BREADCRUMBS.TEAM}>
      <p className="text-gray-600">
        Manage your team members and collaborate on coding challenges. This page will contain team management features.
      </p>
    </PageContainer>
  );
};

export default Team;
