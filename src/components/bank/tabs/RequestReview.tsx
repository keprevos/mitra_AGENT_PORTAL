import React, { useState, useEffect } from 'react';
import { ChevronLeft, Check, X, AlertTriangle, Search } from 'lucide-react';
import { EndUserRequest } from '../../../types/auth';
import { RequestStatus } from '../../../types/onboarding';
import { requestService } from '../../../api/services/request.service';
import { ValidationSummary } from '../validation/ValidationSummary';
import { RequestValidation } from '../validation/RequestValidation';
import toast from 'react-hot-toast';

interface ValidationState {
  [key: string]: {
    status?: 'ok' | 'error' | 'warning';
    comment?: string;
  };
}

export function RequestReview() {
  const [requests, setRequests] = useState<EndUserRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<EndUserRequest | null>(null);
  const [validationStatus, setValidationStatus] = useState<ValidationState>({});
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(RequestStatus.DRAFT);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchRequests();
  }, [activeTab]);

  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      const data = await requestService.getRequests(activeTab);
      setRequests(data);
    } catch (err) {
      setError('Failed to fetch requests');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleValidateField = (fieldKey: string, status: 'ok' | 'error' | 'warning', comment?: string) => {
    setValidationStatus(prev => ({
      ...prev,
      [fieldKey]: { status, comment }
    }));
  };

  const handleApproveRequest = async () => {
    if (!selectedRequest) return;

    try {
      setIsSubmitting(true);

      // Convert validation status to array of feedback objects
      const validationFeedback = Object.entries(validationStatus).map(([fieldId, validation]) => ({
        fieldId,
        status: validation.status,
        message: validation.comment
      })).filter(feedback => feedback.status); // Only include fields that have been validated

      // Update request status and save all validation feedback at once
      await requestService.updateRequestStatus(selectedRequest.id, {
        status: RequestStatus.SUBMITTED,
        validationFeedback
      });

      toast.success('Request approved successfully');
      setSelectedRequest(null);
      setValidationStatus({});
      fetchRequests();
    } catch (err) {
      console.error('Failed to approve request:', err);
      toast.error('Failed to approve request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRejectRequest = async () => {
    if (!selectedRequest || !rejectionReason) return;
    
    try {
      setIsSubmitting(true);

      // Convert validation status to array of feedback objects
      const validationFeedback = [
        // Include rejection reason as overall feedback
        {
          fieldId: 'request.status',
          status: 'error' as const,
          message: rejectionReason
        },
        // Include all other field validations
        ...Object.entries(validationStatus).map(([fieldId, validation]) => ({
          fieldId,
          status: validation.status,
          message: validation.comment
        })).filter(feedback => feedback.status) // Only include fields that have been validated
      ];

      // Update request status and save all validation feedback at once
      await requestService.updateRequestStatus(selectedRequest.id, {
        status: RequestStatus.REJECTED_N0,
        comment: rejectionReason,
        validationFeedback
      });

      toast.success('Request rejected successfully');
      setShowRejectionModal(false);
      setRejectionReason('');
      setSelectedRequest(null);
      setValidationStatus({});
      fetchRequests();
    } catch (err) {
      console.error('Failed to reject request:', err);
      toast.error('Failed to reject request');
    } finally {
      setIsSubmitting(false);
    }
  };

  const REQUEST_TABS = [
    { id: RequestStatus.DRAFT, label: 'Analyse de la demande' },
    { id: RequestStatus.CLIENT_CORRECTED, label: 'En attente retour client' },
    { id: RequestStatus.CTO_REVIEW, label: "En attente d'avis CTO" },
    { id: RequestStatus.REJECTED_N0, label: 'Demandes refusées' },
    { id: RequestStatus.SUBMITTED, label: 'Demande en cours' },
  ];

  const filteredRequests = requests.filter(request => {
    const searchLower = searchTerm.toLowerCase();
    return (
      request.name?.toLowerCase().includes(searchLower) ||
      request.email?.toLowerCase().includes(searchLower) ||
      request.companyName?.toLowerCase().includes(searchLower)
    );
  });

  if (selectedRequest) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow-sm rounded-lg p-4">
          <div className="flex justify-between items-center">
            <button
              onClick={() => {
                setSelectedRequest(null);
                setValidationStatus({});
              }}
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to list
            </button>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowRejectionModal(true)}
                className="inline-flex items-center px-4 py-2 border border-red-300 rounded-md shadow-sm text-sm font-medium text-red-700 bg-white hover:bg-red-50"
              >
                <X className="h-4 w-4 mr-2" />
                Reject
              </button>
              <button
                onClick={handleApproveRequest}
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
              >
                <Check className="h-4 w-4 mr-2" />
                Approve
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RequestValidation
              sections={getValidationSections(selectedRequest)}
              validationStatus={validationStatus}
              onValidateField={handleValidateField}
            />
          </div>
          <div className="lg:col-span-1">
            <ValidationSummary validationStatus={validationStatus} />
          </div>
        </div>

        {/* Rejection Modal */}
        {showRejectionModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Reject Request
              </h3>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Reason for rejection..."
                className="w-full h-32 border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
              />
              <div className="mt-4 flex justify-end space-x-3">
                <button
                  onClick={() => setShowRejectionModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectRequest}
                  disabled={!rejectionReason || isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 disabled:opacity-50"
                >
                  Confirm Rejection
                </button>
              </div>
            </div>
          </div>
        )}
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
      </div>

      {/* Status Tabs */}
      <div className="bg-white shadow-sm rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto p-4">
            {REQUEST_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Requests List */}
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-600 p-4">{error}</div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredRequests.map((request) => (
              <div
                key={request.id}
                className="hover:bg-gray-50 cursor-pointer transition-colors duration-150"
                onClick={() => setSelectedRequest(request)}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <h3 className="text-sm font-medium text-indigo-600 truncate">
                          {request.name}
                        </h3>
                        <span className="flex-shrink-0 inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                          #{request.id}
                        </span>
                      </div>
                      <div className="mt-1 flex items-center space-x-3 text-sm text-gray-500">
                        <span>{request.email}</span>
                        <span>•</span>
                        <span>{request.companyName}</span>
                      </div>
                    </div>
                    <ChevronLeft className="h-5 w-5 text-gray-400 transform rotate-180" />
                  </div>
                </div>
              </div>
            ))}
            {filteredRequests.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No requests found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function getValidationSections(request: EndUserRequest) {
  return [
    {
      title: 'Personal Information',
      fields: [
        { key: 'personal.title', label: 'Title', value: request.data?.personal?.title === 'madame' ? 'Madame' : 'Monsieur' },
        { key: 'personal.firstName', label: 'First Name', value: request.data?.personal?.firstName },
        { key: 'personal.lastName', label: 'Last Name', value: request.data?.personal?.lastName },
        { key: 'personal.email', label: 'Email', value: request.data?.personal?.email },
        { key: 'personal.mobile', label: 'Phone', value: request.data?.personal?.mobile },
      ]
    },
    {
      title: 'Business Information',
      fields: [
        { key: 'business.legalForm', label: 'Legal Form', value: request.data?.business?.legalForm },
        { key: 'business.siret', label: 'SIRET', value: request.data?.business?.siret },
        { key: 'business.companyName', label: 'Company Name', value: request.data?.business?.companyName },
        { key: 'business.industryCode', label: 'Industry Code', value: request.data?.business?.industryCode },
      ]
    },
    {
      title: 'Documents',
      fields: Object.entries(request.data?.documents || {}).map(([key, value]) => ({
        key: `documents.${key}`,
        label: key.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
        value: Array.isArray(value) ? `${value.length} file(s) uploaded` : 'No files',
      }))
    }
  ];
}