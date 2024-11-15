import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2 } from 'lucide-react';

const shareholderSchema = z.object({
  shareholders: z.array(z.object({
    type: z.enum(['individual', 'company']),
    // Individual fields
    firstName: z.string().optional(),
    lastName: z.string().optional(),
    birthDate: z.string().optional(),
    nationality: z.string().optional(),
    // Company fields
    companyName: z.string().optional(),
    registrationNumber: z.string().optional(),
    // Common fields
    ownershipPercentage: z.string()
      .refine(val => !isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 100, {
        message: "Le pourcentage doit être entre 0 et 100"
      }),
  })).min(1, "Au moins un actionnaire est requis"),
});

type ShareholderInputs = z.infer<typeof shareholderSchema>;

interface ShareholdersProps {
  data: any;
  onNext: (data: ShareholderInputs) => void;
  onBack: () => void;
}

export function Shareholders({ data, onNext, onBack }: ShareholdersProps) {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ShareholderInputs>({
    resolver: zodResolver(shareholderSchema),
    defaultValues: {
      shareholders: data?.shareholders || [{ type: 'individual', ownershipPercentage: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "shareholders",
  });

  const shareholderTypes = watch('shareholders');

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      {fields.map((field, index) => {
        const isIndividual = shareholderTypes[index]?.type === 'individual';
        
        return (
          <div key={field.id} className="bg-gray-50 p-4 rounded-lg space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Actionnaire {index + 1}
              </h3>
              {fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
              {/* Shareholder Type */}
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Type d'actionnaire
                </label>
                <select
                  {...register(`shareholders.${index}.type`)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="individual">Personne Physique</option>
                  <option value="company">Personne Morale</option>
                </select>
              </div>

              {/* Ownership Percentage */}
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Pourcentage de détention
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="text"
                    {...register(`shareholders.${index}.ownershipPercentage`)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">%</span>
                  </div>
                </div>
                {errors.shareholders?.[index]?.ownershipPercentage && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.shareholders[index]?.ownershipPercentage?.message}
                  </p>
                )}
              </div>

              {isIndividual ? (
                <>
                  {/* Individual Fields */}
                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Prénom
                    </label>
                    <input
                      type="text"
                      {...register(`shareholders.${index}.firstName`)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Nom
                    </label>
                    <input
                      type="text"
                      {...register(`shareholders.${index}.lastName`)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Date de naissance
                    </label>
                    <input
                      type="date"
                      {...register(`shareholders.${index}.birthDate`)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Nationalité
                    </label>
                    <input
                      type="text"
                      {...register(`shareholders.${index}.nationality`)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </>
              ) : (
                <>
                  {/* Company Fields */}
                  <div className="sm:col-span-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Raison sociale
                    </label>
                    <input
                      type="text"
                      {...register(`shareholders.${index}.companyName`)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Numéro d'immatriculation
                    </label>
                    <input
                      type="text"
                      {...register(`shareholders.${index}.registrationNumber`)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}

      <button
        type="button"
        onClick={() => append({ type: 'individual', ownershipPercentage: '' })}
        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Plus className="h-5 w-5 mr-2" />
        Ajouter un actionnaire
      </button>

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