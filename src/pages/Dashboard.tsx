import React, { useState } from 'react';
import { DashboardNav } from '../components/dashboard/DashboardNav';
import { DashboardTabs } from '../components/dashboard/DashboardTabs';
import { Overview } from '../components/dashboard/tabs/Overview';
import { EndUserManagement } from '../components/dashboard/tabs/EndUserManagement';
import { Notifications } from '../components/dashboard/tabs/Notifications';
import { Settings } from '../components/dashboard/tabs/Settings';

export function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview />;
      case 'users':
        return <EndUserManagement />;
      case 'notifications':
        return <Notifications />;
      case 'settings':
        return <Settings />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNav />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="mt-6">
            {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
}