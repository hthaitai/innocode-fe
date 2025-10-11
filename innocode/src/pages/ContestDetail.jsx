import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import PageContainer from '../components/PageContainer';
import { contestsData } from '../data/contestsData';
import { createBreadcrumb, BREADCRUMBS } from '../config/breadcrumbs';
import TabNavigation from '../components/TabNavigation';
import CountdownTimer from '../components/countdowntimer/countdownTimer';

const ContestDetail = () => {
  const { contestId } = useParams();
  const contest = contestsData.find((c) => c.id === parseInt(contestId));
  const [activeTab, setActiveTab] = useState('overview');
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'round', label: 'Round' },
    { id: 'team', label: 'Team' },
  ];
  const breadcrumb = contest
    ? createBreadcrumb('CONTEST_DETAIL', contest.title)
    : BREADCRUMBS.NOT_FOUND;
  return (
    <PageContainer breadcrumb={breadcrumb} bg={false}>
      <div className="page-container">
        {contest ? (
          <div className="flex gap-4">
            {/* LEFT */}
            <div className="flex-1 ">
              <div className="bg-orange-500 h-[280px]">{/* banner */}</div>
              <TabNavigation
                className="my-6"
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={setActiveTab}
              />
              <div className="min-h-[500px]">
                <div className="min-h-[500px]">
                  <p className="text-2xl font-semibold m-2 mb-6">
                    Description & Rules
                  </p>
                  <p className="m-2">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Quisquam, quosLorem ipsum dolor sit amet consectetur
                    adipisicing elit. Quisquam, quosLorem ipsum dolor sit amet
                    consectetur adipisicing elit. Quisquam, quosLorem ipsum
                    dolor sit amet consectetur adipisicing elit. Quisquam, quos
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="flex flex-col gap-4 w-[320px]">
              <CountdownTimer targetDate="2025-10-12T10:00:00+07:00" />
              <div className="bg-gray-500 h-[280px]"></div>
            </div>
          </div>
        ) : (
          <p>Contest not found</p>
        )}
      </div>
    </PageContainer>
  );
};

export default ContestDetail;
