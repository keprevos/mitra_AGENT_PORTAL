import React from 'react';
import { Bell, CheckCircle, AlertCircle, Info } from 'lucide-react';

const notifications = [
  {
    id: 1,
    type: 'success',
    title: 'Onboarding Completed',
    message: 'John Smith has completed the onboarding process.',
    time: '2 hours ago',
    icon: CheckCircle,
  },
  {
    id: 2,
    type: 'warning',
    title: 'Document Review Required',
    message: 'New documents uploaded by Sarah Johnson need review.',
    time: '3 hours ago',
    icon: AlertCircle,
  },
  {
    id: 3,
    type: 'info',
    title: 'System Update',
    message: 'Platform maintenance scheduled for tonight at 2 AM.',
    time: '5 hours ago',
    icon: Info,
  },
];

export function Notifications() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-medium text-gray-900">Notifications</h2>
        <button className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
          Mark all as read
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {notifications.map((notification) => (
            <li key={notification.id} className="p-4 hover:bg-gray-50">
              <div className="flex items-start">
                <div className={`
                  flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center
                  ${notification.type === 'success' ? 'bg-green-100' :
                    notification.type === 'warning' ? 'bg-yellow-100' : 'bg-blue-100'}
                `}>
                  <notification.icon className={`
                    h-5 w-5
                    ${notification.type === 'success' ? 'text-green-600' :
                      notification.type === 'warning' ? 'text-yellow-600' : 'text-blue-600'}
                  `} />
                </div>
                <div className="ml-3 flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    {notification.title}
                  </p>
                  <p className="mt-1 text-sm text-gray-500">
                    {notification.message}
                  </p>
                  <p className="mt-2 text-xs text-gray-400">
                    {notification.time}
                  </p>
                </div>
                <button className="ml-6 bg-white rounded-md text-sm font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  View
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}