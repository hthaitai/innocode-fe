// Ví dụ sử dụng TabNavigation ở các trang khác

import React, { useState } from 'react';
import TabNavigation from '@/shared/components/TabNavigation';

// Ví dụ 1: Sử dụng trong Dashboard
export function DashboardExample() {
  const [activeTab, setActiveTab] = useState('overview');
  
  const dashboardTabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'statistics', label: 'Statistics' },
    { id: 'recent', label: 'Recent Activity' }
  ];

  return (
    <div>
      <TabNavigation
        tabs={dashboardTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      {/* Nội dung theo tab */}
      {activeTab === 'overview' && <div>Overview content</div>}
      {activeTab === 'statistics' && <div>Statistics content</div>}
      {activeTab === 'recent' && <div>Recent activity content</div>}
    </div>
  );
}

// Ví dụ 2: Sử dụng với màu khác
export function ContestExample() {
  const [activeTab, setActiveTab] = useState('active');
  
  const contestTabs = [
    { id: 'active', label: 'Active Contests' },
    { id: 'upcoming', label: 'Upcoming' },
    { id: 'past', label: 'Past Contests' }
  ];

  return (
    <div>
      <TabNavigation
        tabs={contestTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeColor="blue"  // Thay đổi màu active
        hoverColor="gray"
        className="mb-4"    // Thêm class bổ sung
      />
      
      {/* Nội dung theo tab */}
      {activeTab === 'active' && <div>Active contests</div>}
      {activeTab === 'upcoming' && <div>Upcoming contests</div>}
      {activeTab === 'past' && <div>Past contests</div>}
    </div>
  );
}

// Ví dụ 3: Sử dụng trong Settings
export function SettingsExample() {
  const [activeTab, setActiveTab] = useState('general');
  
  const settingsTabs = [
    { id: 'general', label: 'General' },
    { id: 'notifications', label: 'Notifications' },
    { id: 'privacy', label: 'Privacy' },
    { id: 'security', label: 'Security' }
  ];

  return (
    <div>
      <TabNavigation
        tabs={settingsTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        activeColor="green"  // Màu xanh lá
      />
      
      {/* Nội dung theo tab */}
      {activeTab === 'general' && <div>General settings</div>}
      {activeTab === 'notifications' && <div>Notification settings</div>}
      {activeTab === 'privacy' && <div>Privacy settings</div>}
      {activeTab === 'security' && <div>Security settings</div>}
    </div>
  );
}
