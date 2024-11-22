import React, { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, X, Check, AlertTriangle } from 'lucide-react';
import { useOnboarding } from '../OnboardingContext';
import toast from 'react-hot-toast';

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

const documentsSchema = z.object({
  proofOfResidence: z.any()
    .refine((files) => files?.length > 0, "Proof of residence is required")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      "File must be less than 5MB"
    )
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      "File must be JPEG, PNG, or PDF"
    ),
  identityDocument: z.any()
    .refine((files) => files?.length > 0, "Identity document is required")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      "File must be less than 5MB"
    )
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      "File must be JPEG, PNG, or PDF"
    ),
  signature: z.any()
    .refine((files) => files?.length > 0, "Signature is required")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      "File must be less than 5MB"
    )
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      "File must be JPEG, PNG, or PDF"
    ),
  bankDetails: z.any()
    .refine((files) => files?.length > 0, "Bank details document is required")
    .refine(
      (files) => files?.[0]?.size <= MAX_FILE_SIZE,
      "File must be less than 5MB"
    )
    .refine(
      (files) => ACCEPTED_FILE_TYPES.includes(files?.[0]?.type),
      "File must be JPEG, PNG, or PDF"
    ),
});

type DocumentInputs = z.infer<typeof documentsSchema>;

interface FileUploadProps {
  label: string;
  name: keyof DocumentInputs;
  register: any;
  error?: string;
  file?: File;
  onRemove: () => void;
}

function FileUpload({ label, name, register, error, file, onRemove }: FileUploadProps) {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length > 0) {
      const input = document.querySelector(`input[name="${name}"]`) as HTMLInputElement;
      if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(droppedFiles[0]);
        input.files = dataTransfer.files;
        input.dispatchEvent(new Event('change', { bubbles: true }));
      }
    }
  }, [name]);

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-6
          ${error ? 'border-red-300 bg-red-50' : 
            file ? 'border-green-300 bg-green-50' : 
            'border-gray-300 bg-gray-50'}
        `}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {file ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-sm text-gray-600">{file.name}</span>
            </div>
            <button
              type="button"
              onClick={onRemove}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div className="text-center">
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <div className="mt-4">
              <label
                htmlFor={name}
                className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
              >
                <span>Upload a file</span>
                <input
                  id={name}
                  type="file"
                  className="sr-only"
                  {...register(name)}
                  accept=".jpg,.jpeg,.png,.pdf"
                />
              </label>
              <p className="pl-1 text-gray-500">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              PNG, JPG, PDF up to 5MB
            </p>
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

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<DocumentInputs>({
    resolver: zodResolver(documentsSchema),
  });

  const files = watch();

  const handleRemoveFile = (name: keyof DocumentInputs) => {
    setValue(name, undefined);
    const input = document.querySelector(`input[name="${name}"]`) as HTMLInputElement;
    if (input) {
      input.value = '';
    }
  };

  const onSubmit = async (data: DocumentInputs) => {
    try {
      // Convert FileList to File array for each document type
      const documents = {
        proofOfResidence: data.proofOfResidence[0],
        identityDocument: data.identityDocument[0],
        signature: data.signature[0],
        bankDetails: data.bankDetails[0]
      };

      updateDocuments(documents);
      nextStep();
    } catch (error) {
      console.error('Error uploading documents:', error);
      toast.error('Failed to upload documents');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-8">
        <FileUpload
          label="Justificatif de domicile"
          name="proofOfResidence"
          register={register}
          error={errors.proofOfResidence?.message?.toString()}
          file={files.proofOfResidence?.[0]}
          onRemove={() => handleRemoveFile('proofOfResidence')}
        />

        <FileUpload
          label="Pièce d'identité"
          name="identityDocument"
          register={register}
          error={errors.identityDocument?.message?.toString()}
          file={files.identityDocument?.[0]}
          onRemove={() => handleRemoveFile('identityDocument')}
        />

        <FileUpload
          label="Signature"
          name="signature"
          register={register}
          error={errors.signature?.message?.toString()}
          file={files.signature?.[0]}
          onRemove={() => handleRemoveFile('signature')}
        />

        <FileUpload
          label="RIB (Relevé d'Identité Bancaire)"
          name="bankDetails"
          register={register}
          error={errors.bankDetails?.message?.toString()}
          file={files.bankDetails?.[0]}
          onRemove={() => handleRemoveFile('bankDetails')}
        />
      </div>

      <div className="flex justify-between pt-5">
        <button
          type="button"
          onClick={prevStep}
          className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? 'Uploading...' : 'Continue'}
        </button>
      </div>
    </form>
  );
}