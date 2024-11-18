import React, { useState } from 'react';
import { Search, Plus, Filter, Eye, Edit2, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { OnboardingWizard } from '../../onboarding/OnboardingWizard';

interface EndUserRequest {
  id: number;
  name: string;
  email: string;
  status: 'Completed' | 'In Progress' | 'Pending' | 'Review Required';
  date: string;
  type: string;
  companyName?: string;
  lastModified: string;
  data?: any;
}

const mockRequests: EndUserRequest[] = [
  {
    id: 1,
    name: 'John Smith',
    email: 'john@example.com',
    status: 'Completed',
    date: '2024-03-15',
    type: 'Individual',
    companyName: 'Smith & Co',
    lastModified: '2024-03-15 14:30',
    data: {
      personal: {
        title: 'monsieur',
        firstName: 'John',
        surname: 'Smith',
        email: 'john@example.com',
      },
      activity: {
        companyName: 'Smith & Co',
        legalForm: 'SAS',
      }
    }
  },
  {
    id: 2,
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    status: 'In Progress',
    date: '2024-03-14',
    type: 'Individual',
    companyName: 'Johnson Industries',
    lastModified: '2024-03-14 09:15',
    data: {
      personal: {
        title: 'madame',
        firstName: 'Sarah',
        surname: 'Johnson',
        email: 'sarah@example.com',
      }
    }
  },
  {
    id: 3,
    name: 'Michael Brown',
    email: 'michael@example.com',
    status: 'Review Required',
    date: '2024-03-13',
    type: 'Individual',
    companyName: 'Brown LLC',
    lastModified: '2024-03-13 16:45',
    data: {
      personal: {
        title: 'monsieur',
        firstName: 'Michael',
        surname: 'Brown',
        email: 'michael@example.com',
      }
    }
  },
];

export function EndUserManagement() {
  const [showWizard, setShowWizard] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<EndUserRequest | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

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

  const filteredRequests = mockRequests.filter(request => {
    const matchesSearch = 
      request.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.companyName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (showWizard) {
    return <OnboardingWizard onClose={() => setShowWizard(false)} />;
  }

  if (selectedRequest) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <button
            onClick={handleCloseDetails}
            className="text-gray-600 hover:text-gray-900"
          >
            ← Retour à la liste
          </button>
          {!isEditing && (
            <button
              onClick={() => handleEditRequest(selectedRequest)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Modifier
            </button>
          )}
        </div>

        {isEditing ? (
          <OnboardingWizard
            onClose={handleCloseDetails}
            initialData={selectedRequest.data}
            requestId={selectedRequest.id}
          />
        ) : (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Détails de la demande
              </h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                ID: #{selectedRequest.id}
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Nom</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedRequest.name}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedRequest.email}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Entreprise</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedRequest.companyName}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Statut</dt>
                  <dd className="mt-1">
                    <span className={`
                      inline-flex rounded-full px-2 text-xs font-semibold leading-5
                      ${selectedRequest.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                        selectedRequest.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
                        selectedRequest.status === 'Review Required' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'}
                    `}>
                      {selectedRequest.status}
                    </span>
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Date de création</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedRequest.date}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Dernière modification</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedRequest.lastModified}</dd>
                </div>
              </dl>
            </div>
          </div>
        )}
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
            placeholder="Rechercher..."
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
            <option value="all">Tous les statuts</option>
            <option value="Completed">Complété</option>
            <option value="In Progress">En cours</option>
            <option value="Pending">En attente</option>
            <option value="Review Required">Révision requise</option>
          </select>
          <button
            onClick={() => setShowWizard(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nouvelle demande
          </button>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <ul className="divide-y divide-gray-200">
          {filteredRequests.map((request) => (
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
                    <div className="mt-2 flex">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
                        <p>Créé le {request.date}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                    <div className="flex -space-x-1 overflow-hidden">
                      <span className={`
                        inline-flex rounded-full px-2 text-xs font-semibold leading-5
                        ${request.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                          request.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' : 
                          request.status === 'Review Required' ? 'bg-red-100 text-red-800' :
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
                    Voir
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}