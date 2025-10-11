import React from 'react';
import PageContainer from '../components/PageContainer';
import { BREADCRUMBS } from '../config/breadcrumbs';

const About = () => {
  return (
    <PageContainer breadcrumb={BREADCRUMBS.ABOUT}>
      <div>
        <h1>About InnoCode</h1>
        <p>Learn more about our platform and mission</p>
      </div>
    </PageContainer>
  );
};

export default About;
