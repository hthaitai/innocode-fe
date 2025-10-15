import React from 'react';
import PageContainer from '../../components/PageContainer';
import { BREADCRUMBS } from '../../config/breadcrumbs';

const Practice = () => {
  return (
    <PageContainer breadcrumb={BREADCRUMBS.PRACTICE}>
      <p className="text-gray-600">
        Practice coding problems and improve your skills. This page will contain practice exercises and coding challenges.
      </p>
    </PageContainer>
  );
};

export default Practice;

