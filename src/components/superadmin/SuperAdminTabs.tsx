import React from 'react';
import { LayoutDashboard, Building2, Users, FileText, Settings, Shield } from 'lucide-react';

interface Tab {
  id: string;
  name: string;
  icon: React.ReactNode;
}

interface SuperAdminTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const tabs: Tab[] = [
  { id: 'overview', name: 'Overview', icon: <LayoutDashboard className="h-5 w-5" /> },
  { id: 'banks', name: 'Bank Management', icon: <Building2 className="h-5 w-5" /> },
  { id: 'agencies', name: 'Agency Management', icon: <Users className="h-5 w-5" /> },
  { id: 'requests', name: 'Global Request Review', icon: <FileText className="h-5 w-5" /> },
  { id: 'roles', name: 'Role Management', icon: <Shield className="h-5 w-5" /> },
  { id: 'settings', name: 'Settings', icon: <Settings className="h-5 w-5" /> },
];

export function SuperAdminTabs({ activeTab, onTabChange }: SuperAdminTabsProps) {
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