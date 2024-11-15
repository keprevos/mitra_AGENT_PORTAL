import React from 'react';
import { LayoutDashboard, Users, Bell, Settings } from 'lucide-react';

interface Tab {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const tabs: Tab[] = [
  { id: 'overview', name: 'Overview', icon: <LayoutDashboard className="h-5 w-5" /> },
  { id: 'users', name: 'End-User Management', icon: <Users className="h-5 w-5" /> },
  { id: 'notifications', name: 'Notifications', icon: <Bell className="h-5 w-5" /> },
  { id: 'settings', name: 'Settings', icon: <Settings className="h-5 w-5" /> },
];

export function DashboardTabs({ activeTab, onTabChange }: DashboardTabsProps) {
  return (
    <div className="border-b border-gray-200">
      <nav className="-mb-px flex space-x-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`
              group inline-flex items-center px-1 py-4 border-b-2 font-medium text-sm
              ${activeTab === tab.id
                ? 'border-indigo-500 text-indigo-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }
            `}
          >
            <span className={`
              mr-2
              ${activeTab === tab.id
                ? 'text-indigo-500'
                : 'text-gray-400 group-hover:text-gray-500'
              }
            `}>
              {tab.icon}
            </span>
            {tab.name}
          </button>
        ))}
      </nav>
    </div>
  );
}