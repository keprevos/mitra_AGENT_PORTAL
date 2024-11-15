import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Upload, X, Check } from 'lucide-react';

const MAX_FILE_SIZE = 5000000; // 5MB
const ACCEPTED_FILE_TYPES = ['image/jpeg', 'image/png', 'application/pdf'];

const documentsSchema = z.object({
  proofOfResidence: z.any()
    .refine((file) => file?.length > 0, "Justificatif de domicile requis")
    .refine((file) => file?.[0]?.size <= MAX_FILE_SIZE, "Le fichier doit faire moins de 5MB")
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file?.[0]?.type),
      "Format accepté : .jpg, .png, .pdf"
    ),
  identityDocument: z.any()
    .refine((file) => file?.length > 0, "Pièce d'identité requise")
    .refine((file) => file?.[0]?.size <= MAX_FILE_SIZE, "Le fichier doit faire moins de 5MB")
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file?.[0]?.type),
      "Format accepté : .jpg, .png, .pdf"
    ),
  signature: z.any()
    .refine((file) => file?.length > 0, "Signature requise")
    .refine((file) => file?.[0]?.size <= MAX_FILE_SIZE, "Le fichier doit faire moins de 5MB")
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file?.[0]?.type),
      "Format accepté : .jpg, .png, .pdf"
    ),
  bankDetails: z.any()
    .refine((file) => file?.length > 0, "RIB requis")
    .refine((file) => file?.[0]?.size <= MAX_FILE_SIZE, "Le fichier doit faire moins de 5MB")
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file?.[0]?.type),
      "Format accepté : .jpg, .png, .pdf"
    ),
});

type DocumentInputs = z.infer<typeof documentsSchema>;

interface DocumentsProps {
  data: any;
  onNext: (data: DocumentInputs) => void;
  onBack: () => void;
}

interface FileUploadProps {
  label: string;
  name: keyof DocumentInputs;
  register: any;
  error?: string;
  file?: File;
}

function FileUpload({ label, name, register, error, file }: FileUploadProps) {
  return (
    <div className="col-span-full">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
        <div className="text-center">
          {file ? (
            <div className="flex items-center justify-center space-x-2">
              <Check className="h-8 w-8 text-green-500" />
              <span className="text-sm text-gray-600">{file.name}</span>
              <button
                type="button"
                className="text-red-500 hover:text-red-700"
                onClick={() => {
                  const input = document.querySelector(`input[name="${name}"]`) as HTMLInputElement;
                  if (input) {
                    input.value = '';
                    input.dispatchEvent(new Event('change', { bubbles: true }));
                  }
                }}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <>
              <Upload className="mx-auto h-12 w-12 text-gray-300" />
              <div className="mt-4 flex text-sm leading-6 text-gray-600">
                <label
                  htmlFor={name}
                  className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                >
                  <span>Télécharger un fichier</span>
                  <input
                    id={name}
                    type="file"
                    className="sr-only"
                    {...register(name)}
                    accept=".jpg,.jpeg,.png,.pdf"
                  />
                </label>
                <p className="pl-1">ou glisser-déposer</p>
              </div>
              <p className="text-xs leading-5 text-gray-600">
                PNG, JPG, PDF jusqu'à 5MB
              </p>
            </>
          )}
        </div>
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

export function Documents({ data, onNext, onBack }: DocumentsProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<DocumentInputs>({
    resolver: zodResolver(documentsSchema),
  });

  const files = watch();

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="grid grid-cols-1 gap-x-6 gap-y-8">
        <FileUpload
          label="Justificatif de domicile"
          name="proofOfResidence"
          register={register}
          error={errors.proofOfResidence?.message?.toString()}
          file={files.proofOfResidence?.[0]}
        />

        <FileUpload
          label="Pièce d'identité"
          name="identityDocument"
          register={register}
          error={errors.identityDocument?.message?.toString()}
          file={files.identityDocument?.[0]}
        />

        <FileUpload
          label="Signature"
          name="signature"
          register={register}
          error={errors.signature?.message?.toString()}
          file={files.signature?.[0]}
        />

        <FileUpload
          label="RIB"
          name="bankDetails"
          register={register}
          error={errors.bankDetails?.message?.toString()}
          file={files.bankDetails?.[0]}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onBack}
          className="py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Retour
        </button>
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Continuer
        </button>
      </div>
    </form>
  );
}