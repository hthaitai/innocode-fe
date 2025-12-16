import React from 'react';
import PageContainer from "@/shared/components/PageContainer";
import { BREADCRUMBS } from '@/config/breadcrumbs';
import { useAuth } from '@/context/AuthContext';
import ActivityLog from '../components/ActivityLog';

const Dashboard = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <PageContainer breadcrumb={BREADCRUMBS.DASHBOARD}>
      {isAdmin ? (
        <div>
          <h1 className="text-2xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
          <ActivityLog />
        </div>
      ) : (
        <div>
          <h1 className="text-2xl font-bold mb-4 text-gray-800">Dashboard</h1>
          <p className="text-gray-600">View your progress and statistics</p>
        </div>
      )}
    </PageContainer>
  );
};

export default Dashboard;
