import React, { useState, useEffect } from 'react';
import { Building2, Users, FileText, TrendingUp } from 'lucide-react';
import { superAdminService, SuperAdminStatistics } from '../../../api/services/superadmin.service';

export function SuperAdminOverview() {
  const [statistics, setStatistics] = useState<SuperAdminStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setIsLoading(true);
      const data = await superAdminService.getStatistics();
      setStatistics(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch statistics';
      setError(errorMessage);
      // Use a serializable error object for logging
      console.error('Statistics fetch error:', { message: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !statistics) {
    return (
      <div className="text-center text-red-600 p-4">
        {error || 'Failed to load statistics'}
      </div>
    );
  }

  const stats = [
    { name: 'Total Banks', value: statistics.totalBanks, icon: Building2 },
    { name: 'Total Agents', value: statistics.totalAgents, icon: Users },
    { name: 'Total Requests', value: statistics.totalRequests, icon: FileText },
    { name: 'Active Requests', value: statistics.activeRequests, icon: TrendingUp },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <stat.icon className="h-6 w-6 text-gray-400" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                    <dd className="text-2xl font-semibold text-gray-900">{stat.value}</dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bank Distribution */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Bank Distribution</h3>
          <div className="mt-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {statistics.bankDistribution.map((bank) => (
                <div key={bank.bankId} className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-base font-medium text-gray-900">{bank.bankName}</h4>
                  <dl className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Agents</dt>
                      <dd className="text-lg font-semibold text-gray-900">{bank.agentCount}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Requests</dt>
                      <dd className="text-lg font-semibold text-gray-900">{bank.requestCount}</dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
          <div className="mt-5">
            <div className="flow-root">
              <ul className="-mb-8">
                {statistics.recentActivity.map((activity, index) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {index !== statistics.recentActivity.length - 1 && (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`
                            h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white
                            ${activity.type === 'bank_added' ? 'bg-green-500' :
                              activity.type === 'agent_added' ? 'bg-blue-500' :
                              activity.type === 'request_approved' ? 'bg-purple-500' :
                              'bg-gray-500'}
                          `}>
                            {activity.type === 'bank_added' ? (
                              <Building2 className="h-5 w-5 text-white" />
                            ) : activity.type === 'agent_added' ? (
                              <Users className="h-5 w-5 text-white" />
                            ) : (
                              <FileText className="h-5 w-5 text-white" />
                            )}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              {activity.content}
                              {activity.bankName && (
                                <span className="font-medium text-gray-900"> - {activity.bankName}</span>
                              )}
                            </p>
                          </div>
                          <div className="text-right text-sm whitespace-nowrap text-gray-500">
                            {activity.timestamp}
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}