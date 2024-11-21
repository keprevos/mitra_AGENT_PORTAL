import React, { useState } from 'react';
import { DashboardNav } from '../components/dashboard/DashboardNav';
import { AgencyDashboardTabs } from '../components/agency/AgencyDashboardTabs';
import { AgencyOverview } from '../components/agency/tabs/AgencyOverview';
import { StaffManagement } from '../components/agency/tabs/StaffManagement';
import { CustomerManagement } from '../components/agency/tabs/CustomerManagement';
import { AgencySettings } from '../components/agency/tabs/AgencySettings';

export function AgencyDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AgencyOverview />;
      case 'staff':
        return <StaffManagement />;
      case 'customers':
        return <CustomerManagement />;
      case 'settings':
        return <AgencySettings />;
      default:
        return <AgencyOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNav />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <AgencyDashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="mt-6">
            {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
}