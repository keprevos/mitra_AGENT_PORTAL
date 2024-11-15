import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const personalInfoSchema = z.object({
  title: z.enum(['madame', 'monsieur']),
  surname: z.string().min(2, 'Le nom est requis'),
  firstName: z.string().min(2, 'Le prénom est requis'),
  maidenName: z.string().optional(),
  email: z.string().email('Email invalide'),
  mobile: z.string().min(10, 'Numéro de téléphone invalide'),
  address: z.object({
    street: z.string().min(5, 'Adresse requise'),
    city: z.string().min(2, 'Ville requise'),
    postalCode: z.string().min(5, 'Code postal requis'),
    country: z.string().min(2, 'Pays requis'),
  }),
  birthDate: z.string(),
  birthPlace: z.string().min(2, 'Lieu de naissance requis'),
  birthCountry: z.string().min(2, 'Pays de naissance requis'),
  nationality: z.string().min(2, 'Nationalité requise'),
  taxResidence: z.string().min(2, 'Pays de résidence fiscale requis'),
  isUsCitizen: z.boolean(),
});

type PersonalInfoInputs = z.infer<typeof personalInfoSchema>;

interface PersonalInfoProps {
  data: any;
  onNext: (data: PersonalInfoInputs) => void;
  isFirstStep: boolean;
}

export function PersonalInfo({ data, onNext, isFirstStep }: PersonalInfoProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PersonalInfoInputs>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: data,
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        {/* Title */}
        <div className="sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700">
            Civilité
          </label>
          <div className="mt-1 space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                {...register('title')}
                value="madame"
                className="form-radio text-indigo-600"
              />
              <span className="ml-2">Madame</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                {...register('title')}
                value="monsieur"
                className="form-radio text-indigo-600"
              />
              <span className="ml-2">Monsieur</span>
            </label>
          </div>
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Name Fields */}
        <div className="sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700">
            Nom d'usage
          </label>
          <input
            type="text"
            {...register('surname')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.surname && (
            <p className="mt-1 text-sm text-red-600">{errors.surname.message}</p>
          )}
        </div>

        <div className="sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700">
            Prénom
          </label>
          <input
            type="text"
            {...register('firstName')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        {/* Contact Information */}
        <div className="sm:col-span-4">
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            {...register('email')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        {/* Address */}
        <div className="sm:col-span-6">
          <label className="block text-sm font-medium text-gray-700">
            Adresse
          </label>
          <input
            type="text"
            {...register('address.street')}
            placeholder="Rue"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.address?.street && (
            <p className="mt-1 text-sm text-red-600">{errors.address.street.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <input
            type="text"
            {...register('address.city')}
            placeholder="Ville"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.address?.city && (
            <p className="mt-1 text-sm text-red-600">{errors.address.city.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <input
            type="text"
            {...register('address.postalCode')}
            placeholder="Code postal"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.address?.postalCode && (
            <p className="mt-1 text-sm text-red-600">{errors.address.postalCode.message}</p>
          )}
        </div>

        <div className="sm:col-span-2">
          <input
            type="text"
            {...register('address.country')}
            placeholder="Pays"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.address?.country && (
            <p className="mt-1 text-sm text-red-600">{errors.address.country.message}</p>
          )}
        </div>

        {/* US Citizen */}
        <div className="sm:col-span-6">
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                type="checkbox"
                {...register('isUsCitizen')}
                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label className="font-medium text-gray-700">
                Ressortissant américain
              </label>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
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