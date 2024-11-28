import React, { useState, useEffect } from 'react';
import { Users, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { requestService } from '../../../api/services/request.service';
import { RequestStatus } from '../../../types/onboarding';
import toast from 'react-hot-toast';

interface OverviewStats {
  totalEndUsers: number;
  pendingApplications: number;
  completedToday: number;
  requiresAttention: number;
  recentActivity: Array<{
    id: number;
    type: string;
    content: string;
    timestamp: string;
  }>;
}

export function Overview() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchOverviewData();
  }, []);

  const fetchOverviewData = async () => {
    try {
      setIsLoading(true);
      
      // Fetch requests for different statuses
      const [allRequests, pendingRequests, completedRequests, attentionRequests] = await Promise.all([
        requestService.getRequests(),
        requestService.getRequests(RequestStatus.DRAFT),
        requestService.getRequests(RequestStatus.SUBMITTED),
        requestService.getRequests(RequestStatus.CLIENT_CORRECTED)
      ]);

      // Calculate stats
      const today = new Date().toISOString().split('T')[0];
      const completedToday = completedRequests.filter(
        req => req.submissionDate?.startsWith(today)
      ).length;

      // Create recent activity from requests
      const recentActivity = allRequests
        .slice(0, 5)
        .map((req, index) => ({
          id: index + 1,
          type: getActivityType(req.status),
          content: getActivityContent(req),
          timestamp: new Date(req.submissionDate).toLocaleString()
        }));

      setStats({
        totalEndUsers: allRequests.length,
        pendingApplications: pendingRequests.length,
        completedToday,
        requiresAttention: attentionRequests.length,
        recentActivity
      });
    } catch (error) {
      console.error('Failed to fetch overview data:', error);
      toast.error('Failed to load overview data');
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityType = (status: string): string => {
    switch (status) {
      case RequestStatus.SUBMITTED.toString():
        return 'completed';
      case RequestStatus.DRAFT.toString():
        return 'started';
      case RequestStatus.CLIENT_CORRECTED.toString():
        return 'updated';
      case RequestStatus.REJECTED_N0.toString():
        return 'rejected';
      default:
        return 'other';
    }
  };

  const getActivityContent = (request: any): string => {
    const name = request.name || 'Anonymous';
    switch (request.status.toString()) {
      case RequestStatus.SUBMITTED.toString():
        return `Completed onboarding for ${name}`;
      case RequestStatus.DRAFT.toString():
        return `New application started for ${name}`;
      case RequestStatus.CLIENT_CORRECTED.toString():
        return `Updated application for ${name}`;
      case RequestStatus.REJECTED_N0.toString():
        return `Application rejected for ${name}`;
      default:
        return `Activity for ${name}`;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center text-red-600 p-4">
        Failed to load overview data
      </div>
    );
  }

  const statCards = [
    { name: 'Total End-Users', value: stats.totalEndUsers, icon: Users },
    { name: 'Pending Applications', value: stats.pendingApplications, icon: FileText },
    { name: 'Completed Today', value: stats.completedToday, icon: CheckCircle },
    { name: 'Requires Attention', value: stats.requiresAttention, icon: AlertTriangle },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => (
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

      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Activity</h3>
          <div className="mt-5">
            <div className="flow-root">
              <ul className="-mb-8">
                {stats.recentActivity.map((activity, index) => (
                  <li key={activity.id}>
                    <div className="relative pb-8">
                      {index !== stats.recentActivity.length - 1 && (
                        <span
                          className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                          aria-hidden="true"
                        />
                      )}
                      <div className="relative flex space-x-3">
                        <div>
                          <span className={`
                            h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white
                            ${activity.type === 'completed' ? 'bg-green-500' :
                              activity.type === 'started' ? 'bg-blue-500' :
                              activity.type === 'updated' ? 'bg-yellow-500' :
                              'bg-gray-500'}
                          `}>
                            {activity.type === 'completed' ? (
                              <CheckCircle className="h-5 w-5 text-white" />
                            ) : activity.type === 'started' ? (
                              <FileText className="h-5 w-5 text-white" />
                            ) : (
                              <AlertTriangle className="h-5 w-5 text-white" />
                            )}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                          <div>
                            <p className="text-sm text-gray-500">{activity.content}</p>
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
