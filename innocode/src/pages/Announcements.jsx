import React from 'react';
import PageContainer from '../components/PageContainer';
import { BREADCRUMBS } from '../config/breadcrumbs';

const Announcements = () => {
  return (
   <PageContainer breadcrumb={BREADCRUMBS.ANNOUNCEMENTS}>
     <p className="text-gray-600">
       Stay updated with the latest announcements and news. This page will contain important updates and notifications.
     </p>
   </PageContainer>
  );
};

export default Announcements;

