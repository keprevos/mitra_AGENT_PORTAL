
import React, { useState, useEffect } from 'react';
import { Search, Filter, Edit2, Eye, Clock, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { EndUserRequest } from '../../../types/auth';
import { RequestStatus } from '../../../types/onboarding';
import { requestService } from '../../../api/services/request.service';
import toast from 'react-hot-toast';

interface RequestListProps {
  onEdit: (request: EndUserRequest) => void;
  onView: (request: EndUserRequest) => void;
}

const STATUS_COLORS = {
  [RequestStatus.DRAFT]: 'bg-gray-100 text-gray-800',
  [RequestStatus.CLIENT_CORRECTED]: 'bg-yellow-100 text-yellow-800',
  [RequestStatus.CTO_REVIEW]: 'bg-blue-100 text-blue-800',
  [RequestStatus.REJECTED_N0]: 'bg-red-100 text-red-800',
  [RequestStatus.SUBMITTED]: 'bg-green-100 text-green-800'
};

const STATUS_ICONS = {
  [RequestStatus.DRAFT]: Clock,
  [RequestStatus.CLIENT_CORRECTED]: AlertTriangle,
  [RequestStatus.CTO_REVIEW]: Eye,
  [RequestStatus.REJECTED_N0]: XCircle,
  [RequestStatus.SUBMITTED]: CheckCircle
};

const STATUS_LABELS = {
  [RequestStatus.DRAFT]: 'Analyse de la demande',
  [RequestStatus.CLIENT_CORRECTED]: 'En attente retour client',
  [RequestStatus.CTO_REVIEW]: "En attente d'avis CTO",
  [RequestStatus.REJECTED_N0]: 'Demandes refusées',
  [RequestStatus.SUBMITTED]: 'Demande en cours'
};

export function RequestList({ onEdit, onView }: RequestListProps) {
  const [requests, setRequests] = useState<EndUserRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<RequestStatus | 'all'>('all');

  useEffect(() => {
    fetchRequests();
  }, [statusFilter]);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const data = await requestService.getRequests(
        statusFilter === 'all' ? undefined : statusFilter
      );
      setRequests(data);
    } catch (err) {
      setError('Failed to fetch requests');
      console.error(err);
      toast.error('Failed to load requests');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as RequestStatus | 'all')}
        >
          <option value="all">All Status</option>
          {Object.entries(STATUS_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* Request List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="divide-y divide-gray-200">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => {
              const StatusIcon = STATUS_ICONS[request.status as RequestStatus] || Clock;
              const statusColor = STATUS_COLORS[request.status as RequestStatus] || 'bg-gray-100 text-gray-800';
              const statusLabel = STATUS_LABELS[request.status as RequestStatus] || request.status;

              return (
                <div key={request.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-sm font-medium text-indigo-600">
                          {request.name}
                        </h3>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          #{request.id}
                        </span>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor}`}>
                          <StatusIcon className="h-4 w-4 mr-1" />
                          {statusLabel}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center space-x-2 text-sm text-gray-500">
                        <span>{request.email}</span>
                        {request.companyName && (
                          <>
                            <span>•</span>
                            <span>{request.companyName}</span>
                          </>
                        )}
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500">
                        <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <span>Submitted on {request.submissionDate}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={() => onView(request)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </button>
                        <button
                          onClick={() => onEdit(request)}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          Edit
                        </button>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-6 text-center text-gray-500">
              No requests found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
