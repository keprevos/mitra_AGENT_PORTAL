import React, { useState } from 'react';
import { ChevronLeft, Save, AlertTriangle, Plus, Trash2, Upload, X } from 'lucide-react';
import { EndUserRequest } from '../../../types/auth';
import { onboardingService } from '../../../api/services/onboarding.service';
import toast from 'react-hot-toast';

interface RequestEditProps {
  request: EndUserRequest;
  onBack: () => void;
  onSave: () => void;
}

const LEGAL_FORMS = [
  'SAS', 'SARL', 'EURL', 'SA', 'SCI', 'SASU', 'SNC', 'SELARL', 'SCP', 'SCM'
];

export function RequestEdit({ request, onBack, onSave }: RequestEditProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    personal: request.data?.personal || {},
    business: request.data?.business || {},
    shareholders: request.data?.shareholders || [],
    documents: request.data?.documents || {
      proofOfResidence: [],
      identityDocument: [],
      signature: [],
      bankDetails: []
    }
  });

  const handleInputChange = (section: 'personal' | 'business', field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleAddressChange = (section: 'personal' | 'business', field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        address: {
          ...prev[section].address,
          [field]: value
        }
      }
    }));
  };

  const handleShareholderChange = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      shareholders: prev.shareholders.map((s, i) => 
        i === index ? { ...s, [field]: value } : s
      )
    }));
  };

  const addShareholder = (type: 'individual' | 'company') => {
    const totalPercentage = formData.shareholders.reduce(
      (sum, s) => sum + (parseFloat(s.ownershipPercentage?.toString() || '0') || 0),
      0
    );
    
    const remainingPercentage = Math.max(0, 100 - totalPercentage);

    const newShareholder = type === 'individual' ? {
      type: 'individual',
      ownershipPercentage: remainingPercentage,
      firstName: '',
      lastName: '',
      birthDate: '',
      nationality: ''
    } : {
      type: 'company',
      ownershipPercentage: remainingPercentage,
      companyName: '',
      registrationNumber: ''
    };

    setFormData(prev => ({
      ...prev,
      shareholders: [...prev.shareholders, newShareholder]
    }));
  };

  const removeShareholder = (index: number) => {
    setFormData(prev => ({
      ...prev,
      shareholders: prev.shareholders.filter((_, i) => i !== index)
    }));
  };

  const handleFileUpload = async (type: string, file: File) => {
    try {
      const result = await onboardingService.uploadDocument(request.id.toString(), type, file);
      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          [type]: [...(prev.documents[type] || []), result.url]
        }
      }));
      toast.success('Document uploaded successfully');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload document');
    }
  };

  const removeDocument = (type: string, url: string) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [type]: prev.documents[type].filter((u: string) => u !== url)
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      await onboardingService.updateRequest(request.id.toString(), {
        data: formData
      });
      toast.success('Request updated successfully');
      onSave();
    } catch (error) {
      console.error('Failed to update request:', error);
      toast.error('Failed to update request');
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Back to details
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {/* Warning Banner */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertTriangle className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              Editing this request will require re-validation by the bank.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Personal Information */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Personal Information
            </h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <select
                  value={formData.personal.title}
                  onChange={(e) => handleInputChange('personal', 'title', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="monsieur">Monsieur</option>
                  <option value="madame">Madame</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  value={formData.personal.firstName}
                  onChange={(e) => handleInputChange('personal', 'firstName', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Last Name</label>
                <input
                  type="text"
                  value={formData.personal.surname}
                  onChange={(e) => handleInputChange('personal', 'surname', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={formData.personal.email}
                  onChange={(e) => handleInputChange('personal', 'email', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  value={formData.personal.mobile}
                  onChange={(e) => handleInputChange('personal', 'mobile', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              {/* Personal Address */}
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700">Address</label>
                <div className="mt-1 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <input
                      type="text"
                      value={formData.personal.address?.street}
                      onChange={(e) => handleAddressChange('personal', 'street', e.target.value)}
                      placeholder="Street"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={formData.personal.address?.city}
                      onChange={(e) => handleAddressChange('personal', 'city', e.target.value)}
                      placeholder="City"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={formData.personal.address?.postalCode}
                      onChange={(e) => handleAddressChange('personal', 'postalCode', e.target.value)}
                      placeholder="Postal Code"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={formData.personal.address?.country}
                      onChange={(e) => handleAddressChange('personal', 'country', e.target.value)}
                      placeholder="Country"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Business Information */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Business Information
            </h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Legal Form</label>
                <select
                  value={formData.business.legalForm}
                  onChange={(e) => handleInputChange('business', 'legalForm', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="">Select Legal Form</option>
                  {LEGAL_FORMS.map(form => (
                    <option key={form} value={form}>{form}</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">SIRET</label>
                <input
                  type="text"
                  value={formData.business.siret}
                  onChange={(e) => handleInputChange('business', 'siret', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-sm font-medium text-gray-700">Company Name</label>
                <input
                  type="text"
                  value={formData.business.companyName}
                  onChange={(e) => handleInputChange('business', 'companyName', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Industry Code</label>
                <input
                  type="text"
                  value={formData.business.industryCode}
                  onChange={(e) => handleInputChange('business', 'industryCode', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              {/* Business Address */}
              <div className="sm:col-span-6">
                <label className="block text-sm font-medium text-gray-700">Business Address</label>
                <div className="mt-1 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                  <div className="sm:col-span-6">
                    <input
                      type="text"
                      value={formData.business.address?.street}
                      onChange={(e) => handleAddressChange('business', 'street', e.target.value)}
                      placeholder="Street"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={formData.business.address?.city}
                      onChange={(e) => handleAddressChange('business', 'city', e.target.value)}
                      placeholder="City"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={formData.business.address?.postalCode}
                      onChange={(e) => handleAddressChange('business', 'postalCode', e.target.value)}
                      placeholder="Postal Code"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={formData.business.address?.country}
                      onChange={(e) => handleAddressChange('business', 'country', e.target.value)}
                      placeholder="Country"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shareholders */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Shareholders
            </h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="space-y-6">
              {formData.shareholders.map((shareholder, index) => (
                <div key={index} className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-medium text-gray-900">
                      Shareholder {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeShareholder(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">Type</label>
                      <select
                        value={shareholder.type}
                        onChange={(e) => handleShareholderChange(index, 'type', e.target.value)}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      >
                        <option value="individual">Individual</option>
                        <option value="company">Company</option>
                      </select>
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Ownership Percentage
                      </label>
                      <input
                        type="number"
                        value={shareholder.ownershipPercentage}
                        onChange={(e) => handleShareholderChange(index, 'ownershipPercentage', parseFloat(e.target.value))}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                    </div>

                    {shareholder.type === 'individual' ? (
                      <>
                        <div className="sm:col-span-3">
                          <label className="block text-sm font-medium text-gray-700">
                            First Name
                          </label>
                          <input
                            type="text"
                            value={shareholder.firstName}
                            onChange={(e) => handleShareholderChange(index, 'firstName', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Last Name
                          </label>
                          <input
                            type="text"
                            value={shareholder.lastName}
                            onChange={(e) => handleShareholderChange(index, 'lastName', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Birth Date
                          </label>
                          <input
                            type="date"
                            value={shareholder.birthDate}
                            onChange={(e) => handleShareholderChange(index, 'birthDate', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Nationality
                          </label>
                          <input
                            type="text"
                            value={shareholder.nationality}
                            onChange={(e) => handleShareholderChange(index, 'nationality', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="sm:col-span-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Company Name
                          </label>
                          <input
                            type="text"
                            value={shareholder.companyName}
                            onChange={(e) => handleShareholderChange(index, 'companyName', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>

                        <div className="sm:col-span-3">
                          <label className="block text-sm font-medium text-gray-700">
                            Registration Number
                          </label>
                          <input
                            type="text"
                            value={shareholder.registrationNumber}
                            onChange={(e) => handleShareholderChange(index, 'registrationNumber', e.target.value)}
                            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => addShareholder('individual')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Individual
                </button>
                <button
                  type="button"
                  onClick={() => addShareholder('company')}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Company
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Documents */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Documents
            </h3>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="space-y-6">
              {Object.entries(formData.documents).map(([type, files]) => (
                <div key={type} className="space-y-2">
                  <label className="block text-sm font-medium text-gray-700 capitalize">
                    {type.replace(/([A-Z])/g, ' $1').trim()}
                  </label>
                  <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                          <span>Upload a file</span>
                          <input
                            type="file"
                            className="sr-only"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) handleFileUpload(type, file);
                            }}
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG, PDF up to 10MB</p>
                    </div>
                  </div>
                  {files.length > 0 && (
                    <ul className="mt-4 divide-y divide-gray-200">
                      {files.map((url: string, index: number) => (
                        <li key={index} className="py-3 flex justify-between items-center">
                          <div className="flex items-center">
                            <span className="ml-2 flex-1 w-0 truncate">
                              {url.split('/').pop()}
                            </span>
                          </div>
                          <div className="ml-4 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => removeDocument(type, url)}
                              className="font-medium text-red-600 hover:text-red-500"
                            >
                              <X className="h-5 w-5" />
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}