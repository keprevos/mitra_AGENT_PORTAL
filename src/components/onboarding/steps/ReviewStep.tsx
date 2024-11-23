import React, { useState } from 'react';
import { Check, AlertTriangle } from 'lucide-react';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import { RequestStatus } from '../../../types/onboarding';
import toast from 'react-hot-toast';

export function ReviewStep() {
  const { state, submitRequest, prevStep } = useOnboarding();
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!termsAccepted) {
      toast.error('Please accept the terms and conditions');
      return;
    }

    try {
      setIsSubmitting(true);
      await submitRequest();
      toast.success('Request submitted successfully');
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit request');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Ensure all required data is present
  if (!state.personalInfo || !state.businessInfo || !state.shareholders.length) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Missing Required Information
        </h3>
        <p className="text-gray-500">
          Please complete all previous steps before proceeding to review.
        </p>
        <button
          onClick={prevStep}
          className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  const sections = [
    {
      title: 'Personal Information',
      data: state.personalInfo,
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
      data: state.businessInfo,
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
      data: { shareholders: state.shareholders },
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
      data: state.documents,
      fields: [
        { label: 'Proof of Residence', key: 'proofOfResidence', format: (files: string[]) => files.length ? 'Uploaded' : 'Not uploaded' },
        { label: 'Identity Document', key: 'identityDocument', format: (files: string[]) => files.length ? 'Uploaded' : 'Not uploaded' },
        { label: 'Signature', key: 'signature', format: (files: string[]) => files.length ? 'Uploaded' : 'Not uploaded' },
        { label: 'Bank Details', key: 'bankDetails', format: (files: string[]) => files.length ? 'Uploaded' : 'Not uploaded' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
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

                if (!value) return null;

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

      {/* Terms and Conditions */}
      <div className="bg-gray-50 px-4 py-5 sm:p-6 rounded-lg">
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terms" className="font-medium text-gray-700">
              Accept Terms and Conditions
            </label>
            <p className="text-gray-500">
              By submitting this application, I confirm that all provided information is accurate and I accept the{' '}
              <a href="#" className="text-indigo-600 hover:text-indigo-500">
                terms of service
              </a>
              {' '}and{' '}
              <a href="#" className="text-indigo-600 hover:text-indigo-500">
                privacy policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-5">
        <button
          type="button"
          onClick={prevStep}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || !termsAccepted}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Application'}
        </button>
      </div>
    </div>
  );
}