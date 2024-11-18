import React, { useState } from 'react';
import { DashboardNav } from '../components/dashboard/DashboardNav';
import { BankDashboardTabs } from '../components/bank/BankDashboardTabs';
import { AgentManagement } from '../components/bank/tabs/AgentManagement';
import { RequestReview } from '../components/bank/tabs/RequestReview';
import { BankOverview } from '../components/bank/tabs/BankOverview';
import { BankSettings } from '../components/bank/tabs/BankSettings';

export function BankDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <BankOverview />;
      case 'agents':
        return <AgentManagement />;
      case 'requests':
        return <RequestReview />;
      case 'settings':
        return <BankSettings />;
      default:
        return <BankOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <DashboardNav />
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 sm:px-0">
          <BankDashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />
          <div className="mt-6">
            {renderTabContent()}
          </div>
        </div>
      </main>
    </div>
  );
}