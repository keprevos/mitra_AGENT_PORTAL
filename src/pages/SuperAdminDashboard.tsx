import React, { useState } from 'react';
import { DashboardNav } from '../components/dashboard/DashboardNav';
import { SuperAdminTabs } from '../components/superadmin/SuperAdminTabs';
import { SuperAdminOverview } from '../components/superadmin/tabs/SuperAdminOverview';
import { BankManagement } from '../components/superadmin/tabs/BankManagement';
import { GlobalAgentManagement } from '../components/superadmin/tabs/GlobalAgentManagement';
import { GlobalRequestReview } from '../components/superadmin/tabs/GlobalRequestReview';
import { SuperAdminSettings } from '../components/superadmin/tabs/SuperAdminSettings';

export function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <SuperAdminOverview />;
      case 'banks':
        return <BankManagement />;
      case 'agents':
        return <GlobalAgentManagement />;
      case 'requests':
        return <GlobalRequestReview />;
      case 'settings':
        return <SuperAdminSettings />;
      default:
        return <SuperAdminOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNav />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <SuperAdminTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="mt-6">
            {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
}