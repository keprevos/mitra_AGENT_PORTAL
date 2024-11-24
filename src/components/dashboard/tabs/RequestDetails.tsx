import React, { useState } from 'react';
import { ChevronLeft, Edit2, Clock, Building2, User, Eye } from 'lucide-react';
import { EndUserRequest } from '../../../types/auth';
import { DocumentViewer } from '../../common/DocumentViewer';


interface RequestDetailsProps {
  request: EndUserRequest;
  onBack: () => void;
  onEdit: () => void;
}

export function RequestDetails({ request, onBack, onEdit }: RequestDetailsProps) {

    const [selectedDocument, setSelectedDocument] = useState<string | null>(null);

  const sections = [
    {
      title: 'Personal Information',
      data: request.data?.personal,
      fields: [
        { label: 'Title', key: 'title', format: (val: string) => val === 'madame' ? 'Madame' : 'Monsieur' },
        { label: 'First Name', key: 'firstName' },
        { label: 'Last Name', key: 'surname' },
        { label: 'Email', key: 'email' },
        { label: 'Phone', key: 'mobile' },
        { label: 'Address', key: 'address', format: (val: any) => 
          `${val.street}, ${val.city}, ${val.postalCode}, ${val.country}`
        },
        { label: 'Birth Date', key: 'birthDate' },
        { label: 'Birth Place', key: 'birthPlace' },
        { label: 'Nationality', key: 'nationality' },
        { label: 'Tax Residence', key: 'taxResidence' },
        { label: 'US Citizen', key: 'isUsCitizen', format: (val: boolean) => val ? 'Yes' : 'No' }
      ]
    },
    {
      title: 'Business Information',
      data: request.data?.business,
      fields: [
        { label: 'Legal Form', key: 'legalForm' },
        { label: 'SIRET', key: 'siret' },
        { label: 'Company Name', key: 'companyName' },
        { label: 'Industry Code', key: 'industryCode' },
        { label: 'Brand Name', key: 'brandName' },
        { label: 'Address', key: 'address', format: (val: any) =>
          `${val.street}, ${val.city}, ${val.postalCode}, ${val.country}`
        },
        { label: 'Activity Description', key: 'activityDescription' },
        { label: 'Client Location', key: 'clientLocation' },
        { label: 'Client Types', key: 'clientTypes' },
        { label: 'Last Turnover', key: 'lastTurnover', format: (val: string) => 
          val ? `€${val}` : 'Not provided'
        }
      ]
    },
    {
      title: 'Shareholders',
      data: { shareholders: request.data?.shareholders || [] },
      fields: [
        { 
          label: 'Shareholders', 
          key: 'shareholders',
          format: (shareholders: any[]) => shareholders.map((s, i) => ({
            title: `Shareholder ${i + 1}`,
            details: s.type === 'individual' ? [
              `${s.firstName} ${s.lastName}`,
              `Born: ${s.birthDate}`,
              `Nationality: ${s.nationality}`,
              `Ownership: ${s.ownershipPercentage}%`
            ] : [
              `Company: ${s.companyName}`,
              `Registration: ${s.registrationNumber}`,
              `Ownership: ${s.ownershipPercentage}%`
            ]
          }))
        }
      ]
    },
    {
        title: 'Documents',
        data: request.data?.documents,
        fields: [
          { 
            label: 'Proof of Residence', 
            key: 'proofOfResidence', 
            format: (files: string[]) => (
              <div className="space-y-2">
                {files.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDocument(url)}
                    className="inline-flex items-center px-3 py-1 rounded-md text-sm text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Document {index + 1}
                  </button>
                ))}
                {!files.length && 'Not uploaded'}
              </div>
            )
          },
          { 
            label: 'Identity Document', 
            key: 'identityDocument', 
            format: (files: string[]) => (
              <div className="space-y-2">
                {files.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDocument(url)}
                    className="inline-flex items-center px-3 py-1 rounded-md text-sm text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Document {index + 1}
                  </button>
                ))}
                {!files.length && 'Not uploaded'}
              </div>
            )
          },
          { 
            label: 'Signature', 
            key: 'signature', 
            format: (files: string[]) => (
              <div className="space-y-2">
                {files.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDocument(url)}
                    className="inline-flex items-center px-3 py-1 rounded-md text-sm text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Document {index + 1}
                  </button>
                ))}
                {!files.length && 'Not uploaded'}
              </div>
            )
          },
          { 
            label: 'Bank Details', 
            key: 'bankDetails', 
            format: (files: string[]) => (
              <div className="space-y-2">
                {files.map((url, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDocument(url)}
                    className="inline-flex items-center px-3 py-1 rounded-md text-sm text-indigo-600 hover:text-indigo-900 hover:bg-indigo-50"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Document {index + 1}
                  </button>
                ))}
                {!files.length && 'Not uploaded'}
              </div>
            )
          }
        ]
      }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white shadow-sm rounded-lg p-4">
        <div className="flex justify-between items-center">
          <button
            onClick={onBack}
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to list
          </button>
          {request.status !== 'Approved' && request.status !== 'Rejected' && (
            <button
              onClick={onEdit}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Edit Request
            </button>
          )}
        </div>
      </div>

      {/* Request Overview */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Request Overview</h3>
            <dl className="grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1">
                  <span className={`
                    inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${request.status === 'Approved' ? 'bg-green-100 text-green-800' :
                      request.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'}
                  `}>
                    {request.status}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Submission Date</dt>
                <dd className="mt-1 text-sm text-gray-900 flex items-center">
                  <Clock className="h-4 w-4 text-gray-400 mr-1" />
                  {request.submissionDate}
                </dd>
              </div>
            </dl>
          </div>
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Processing Details</h3>
            <dl className="grid grid-cols-1 gap-4">
              <div>
                <dt className="text-sm font-medium text-gray-500">Bank</dt>
                <dd className="mt-1 text-sm text-gray-900 flex items-center">
                  <Building2 className="h-4 w-4 text-gray-400 mr-1" />
                  {request.bankName}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Agent</dt>
                <dd className="mt-1 text-sm text-gray-900 flex items-center">
                  <User className="h-4 w-4 text-gray-400 mr-1" />
                  {request.agentName} ({request.agencyName})
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Request Details */}
      {sections.map((section) => (
        <div key={section.title} className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {section.title}
            </h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl className="sm:divide-y sm:divide-gray-200">
              {section.fields.map((field) => {
                const value = field.key === 'shareholders' 
                  ? field.format(section.data[field.key])
                  : section.data?.[field.key];

                if (value === undefined || value === null) return null;

                if (field.key === 'shareholders') {
                  return value.map((shareholder: any) => (
                    <div key={shareholder.title} className="py-4 sm:py-5 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">
                        {shareholder.title}
                      </dt>
                      <dd className="mt-1 text-sm text-gray-900 space-y-1">
                        {shareholder.details.map((detail: string, i: number) => (
                          <div key={i}>{detail}</div>
                        ))}
                      </dd>
                    </div>
                  ));
                }

                return (
                  <div key={field.key} className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                    <dt className="text-sm font-medium text-gray-500">
                      {field.label}
                    </dt>
                    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                      {field.format ? field.format(value) : value}
                    </dd>
                  </div>
                );
              })}
            </dl>
          </div>
        </div>
      ))}

{selectedDocument && (
        <DocumentViewer
          url={selectedDocument}
          onClose={() => setSelectedDocument(null)}
        />
      )}
    </div>
  );
}