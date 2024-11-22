import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Eye, Edit2, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { OnboardingWizard } from '../../onboarding/OnboardingWizard';
import { EndUserRequest } from '../../../types/auth';
import { requestService } from '../../../api/services/request.service';
import toast from 'react-hot-toast';

export function EndUserManagement() {
  const [requests, setRequests] = useState<EndUserRequest[]>([]);
  const [showWizard, setShowWizard] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<EndUserRequest | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const data = await requestService.getRequests();
      setRequests(data);
    } catch (err) {
      setError('Failed to fetch requests');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewRequest = (request: EndUserRequest) => {
    setSelectedRequest(request);
    setIsEditing(false);
  };

  const handleEditRequest = (request: EndUserRequest) => {
    setSelectedRequest(request);
    setIsEditing(true);
  };

  const handleCloseDetails = () => {
    setSelectedRequest(null);
    setIsEditing(false);
  };

  const handleCloseWizard = async () => {
    setShowWizard(false);
    setSelectedRequest(null);
    setIsEditing(false);
    // Refresh the list after closing wizard
    await fetchRequests();
  };

  const filteredRequests = requests.filter(request => {
    const matchesSearch = 
      request.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Render OnboardingWizard with proper provider
  if (showWizard || (selectedRequest && isEditing)) {
    return (
      <OnboardingWizard 
        onClose={handleCloseWizard}
        initialData={selectedRequest?.data}
        requestId={selectedRequest?.id?.toString()}
      />
    );
  }

  if (selectedRequest && !isEditing) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <button
            onClick={handleCloseDetails}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Back to list
          </button>
          <button
            onClick={() => handleEditRequest(selectedRequest)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Edit2 className="h-4 w-4 mr-2" />
            Edit
          </button>
        </div>

        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Request Details
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              ID: #{selectedRequest.id}
            </p>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{selectedRequest.name}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{selectedRequest.email}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Company</dt>
                <dd className="mt-1 text-sm text-gray-900">{selectedRequest.companyName}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <span className={`
                    inline-flex rounded-full px-2 text-xs font-semibold leading-5
                    ${selectedRequest.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                      selectedRequest.status === 'Pending Review' ? 'bg-yellow-100 text-yellow-800' : 
                      selectedRequest.status === 'Information Required' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'}
                  `}>
                    {selectedRequest.status}
                  </span>
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Submission Date</dt>
                <dd className="mt-1 text-sm text-gray-900">{selectedRequest.submissionDate}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Last Modified</dt>
                <dd className="mt-1 text-sm text-gray-900">{selectedRequest.lastModified}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="relative flex-1 max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Search requests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            className="block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="Pending Review">Pending Review</option>
            <option value="Approved">Approved</option>
            <option value="Rejected">Rejected</option>
            <option value="Information Required">Information Required</option>
          </select>
          <button
            onClick={() => setShowWizard(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Request
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
      ) : error ? (
        <div className="text-center text-red-600 p-4">{error}</div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <ul className="divide-y divide-gray-200">
            {filteredRequests.length > 0 ? (
              filteredRequests.map((request) => (
                <li key={request.id} className="hover:bg-gray-50">
                  <div className="px-4 py-4 flex items-center sm:px-6">
                    <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                      <div>
                        <div className="flex text-sm">
                          <p className="font-medium text-indigo-600 truncate">{request.name}</p>
                          <p className="ml-1 flex-shrink-0 font-normal text-gray-500">
                            ({request.email})
                          </p>
                        </div>
                        {request.companyName && (
                          <div className="mt-1 text-sm text-gray-500">
                            {request.companyName}
                          </div>
                        )}
                        <div className="mt-2 flex">
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                            <p>Submitted {request.submissionDate}</p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                        <div className="flex -space-x-1 overflow-hidden">
                          <span className={`
                            inline-flex rounded-full px-2 text-xs font-semibold leading-5
                            ${request.status === 'Approved' ? 'bg-green-100 text-green-800' : 
                              request.status === 'Pending Review' ? 'bg-yellow-100 text-yellow-800' : 
                              request.status === 'Information Required' ? 'bg-red-100 text-red-800' :
                              'bg-gray-100 text-gray-800'}
                          `}>
                            {request.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-5 flex-shrink-0">
                      <button
                        onClick={() => handleViewRequest(request)}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </button>
                    </div>
                  </div>
                </li>
              ))
            ) : (
              <li className="py-8">
                <div className="text-center text-gray-500">
                  No requests found
                </div>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}