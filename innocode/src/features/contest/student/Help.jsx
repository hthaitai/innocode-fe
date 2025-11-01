import React from 'react';
import PageContainer from "@/shared/components/PageContainer";
import { BREADCRUMBS } from '@/config/breadcrumbs';

const Help = () => {
  return (
    <PageContainer breadcrumb={BREADCRUMBS.HELP}>
      <div>
          <p>
            Get help and support. This page will contain FAQs, documentation,
            and contact information.
          </p>
        </div>
    </PageContainer>
  );
};

export default Help;
