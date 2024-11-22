import React, { useCallback, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, X, Check, AlertTriangle, Eye } from 'lucide-react';
import { useOnboarding } from '../../../contexts/OnboardingContext';
import { onboardingService } from '../../../api/services/onboarding.service';
import toast from 'react-hot-toast';

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

interface FileUploadProps {
  label: string;
  name: string;
  files: string[];
  onUpload: (file: File) => Promise<void>;
  onRemove: (url: string) => void;
  error?: string;
}

function FileUpload({ label, name, files, onUpload, onRemove, error }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      await handleFileUpload(file);
    }
  }, []);

  const handleFileUpload = async (file: File) => {
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      toast.error('Invalid file type. Only JPEG, PNG and PDF files are allowed.');
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error('File is too large. Maximum size is 5MB.');
      return;
    }

    setIsUploading(true);
    try {
      await onUpload(file);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload file');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await handleFileUpload(file);
    }
  };

  const handlePreview = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6
          ${error ? 'border-red-300 bg-red-50' : 
            files.length > 0 ? 'border-green-300 bg-green-50' : 
            isDragging ? 'border-indigo-300 bg-indigo-50' :
            'border-gray-300 bg-gray-50'}
          transition-colors duration-200
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {files.length > 0 ? (
          <div className="space-y-2">
            {files.map((url, index) => (
              <div key={index} className="flex items-center justify-between bg-white p-2 rounded-md">
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-sm text-gray-600">
                    {url.split('/').pop()}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handlePreview(url)}
                    className="text-indigo-600 hover:text-indigo-700"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onRemove(url)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
            <div className="mt-4">
              <label className="cursor-pointer inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500">
                <Upload className="h-4 w-4 mr-1" />
                Upload another file
                <input
                  type="file"
                  className="hidden"
                  accept=".jpg,.jpeg,.png,.pdf"
                  onChange={handleFileChange}
                  disabled={isUploading}
                />
              </label>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label className="cursor-pointer">
                <span className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                  Upload a file
                  <input
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png,.pdf"
                    onChange={handleFileChange}
                    disabled={isUploading}
                  />
                </span>
                <span className="pl-1 text-gray-500">or drag and drop</span>
              </label>
              <p className="text-xs text-gray-500 mt-2">
                PNG, JPG, PDF up to 5MB
              </p>
            </div>
          </div>
        )}
        {isUploading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <AlertTriangle className="h-4 w-4 mr-1" />
          {error}
        </p>
      )}
    </div>
  );
}

export function DocumentsStep() {
  const { state, updateDocuments, nextStep, prevStep } = useOnboarding();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpload = async (type: string, file: File) => {
    try {
      const { url } = await onboardingService.uploadDocument(state.requestId!, type, file);
      const newDocuments = {
        ...state.documents,
        [type]: [...(state.documents[type] || []), url]
      };
      updateDocuments(newDocuments);
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  };

  const handleRemove = (type: string, url: string) => {
    const newDocuments = {
      ...state.documents,
      [type]: state.documents[type]?.filter(u => u !== url) || []
    };
    updateDocuments(newDocuments);
  };

  const handleNext = async () => {
    // Validate that at least one document of each type is uploaded
    const requiredDocs = ['proofOfResidence', 'identityDocument', 'signature', 'bankDetails'];
    const missingDocs = requiredDocs.filter(type => 
      !state.documents[type] || state.documents[type].length === 0
    );

    if (missingDocs.length > 0) {
      toast.error(`Please upload all required documents: ${missingDocs.join(', ')}`);
      return;
    }

    setIsSubmitting(true);
    try {
      await nextStep();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <FileUpload
        label="Proof of Residence"
        name="proofOfResidence"
        files={state.documents.proofOfResidence || []}
        onUpload={(file) => handleUpload('proofOfResidence', file)}
        onRemove={(url) => handleRemove('proofOfResidence', url)}
      />

      <FileUpload
        label="Identity Document"
        name="identityDocument"
        files={state.documents.identityDocument || []}
        onUpload={(file) => handleUpload('identityDocument', file)}
        onRemove={(url) => handleRemove('identityDocument', url)}
      />

      <FileUpload
        label="Signature"
        name="signature"
        files={state.documents.signature || []}
        onUpload={(file) => handleUpload('signature', file)}
        onRemove={(url) => handleRemove('signature', url)}
      />

      <FileUpload
        label="Bank Details"
        name="bankDetails"
        files={state.documents.bankDetails || []}
        onUpload={(file) => handleUpload('bankDetails', file)}
        onRemove={(url) => handleRemove('bankDetails', url)}
      />

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
          onClick={handleNext}
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Saving...' : 'Continue'}
        </button>
      </div>
    </div>
  );
}