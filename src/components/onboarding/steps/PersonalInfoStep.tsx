import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useOnboarding } from '../OnboardingContext';

const personalInfoSchema = z.object({
  title: z.enum(['madame', 'monsieur'], {
    required_error: 'Title is required'
  }),
  surname: z.string().min(2, 'Surname must be at least 2 characters'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  maidenName: z.string().optional(),
  email: z.string().email('Invalid email address'),
  mobile: z.string().min(10, 'Invalid phone number'),
  address: z.object({
    street: z.string().min(5, 'Street address is required'),
    city: z.string().min(2, 'City is required'),
    postalCode: z.string().min(5, 'Postal code is required'),
    country: z.string().min(2, 'Country is required')
  }),
  birthDate: z.string().min(1, 'Birth date is required'),
  birthPlace: z.string().min(2, 'Birth place is required'),
  birthCountry: z.string().min(2, 'Birth country is required'),
  nationality: z.string().min(2, 'Nationality is required'),
  taxResidence: z.string().min(2, 'Tax residence country is required'),
  isUsCitizen: z.boolean()
});

type PersonalInfoInputs = z.infer<typeof personalInfoSchema>;

export function PersonalInfoStep() {
  const { state, updatePersonalInfo, nextStep } = useOnboarding();
  
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<PersonalInfoInputs>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: state.personalInfo
  });

  const onSubmit = (data: PersonalInfoInputs) => {
    updatePersonalInfo(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Title Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Civilité *
        </label>
        <div className="mt-2 space-x-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              {...register('title')}
              value="madame"
              className="form-radio h-4 w-4 text-indigo-600"
            />
            <span className="ml-2">Madame</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              {...register('title')}
              value="monsieur"
              className="form-radio h-4 w-4 text-indigo-600"
            />
            <span className="ml-2">Monsieur</span>
          </label>
        </div>
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nom d'usage *
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

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Prénom *
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

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nom de naissance
          </label>
          <input
            type="text"
            {...register('maidenName')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email *
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

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Téléphone mobile *
          </label>
          <input
            type="tel"
            {...register('mobile')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.mobile && (
            <p className="mt-1 text-sm text-red-600">{errors.mobile.message}</p>
          )}
        </div>
      </div>

      {/* Address */}
      <div className="space-y-4">
        <label className="block text-sm font-medium text-gray-700">
          Adresse postale *
        </label>
        
        <input
          type="text"
          {...register('address.street')}
          placeholder="Rue"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.address?.street && (
          <p className="mt-1 text-sm text-red-600">{errors.address.street.message}</p>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              {...register('address.city')}
              placeholder="Ville"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.address?.city && (
              <p className="mt-1 text-sm text-red-600">{errors.address.city.message}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              {...register('address.postalCode')}
              placeholder="Code postal"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.address?.postalCode && (
              <p className="mt-1 text-sm text-red-600">{errors.address.postalCode.message}</p>
            )}
          </div>
        </div>

        <input
          type="text"
          {...register('address.country')}
          placeholder="Pays"
          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        {errors.address?.country && (
          <p className="mt-1 text-sm text-red-600">{errors.address.country.message}</p>
        )}
      </div>

      {/* Birth Information */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date de naissance *
          </label>
          <input
            type="date"
            {...register('birthDate')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.birthDate && (
            <p className="mt-1 text-sm text-red-600">{errors.birthDate.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Lieu de naissance *
          </label>
          <input
            type="text"
            {...register('birthPlace')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.birthPlace && (
            <p className="mt-1 text-sm text-red-600">{errors.birthPlace.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Pays de naissance *
          </label>
          <input
            type="text"
            {...register('birthCountry')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.birthCountry && (
            <p className="mt-1 text-sm text-red-600">{errors.birthCountry.message}</p>
          )}
        </div>
      </div>

      {/* Nationality and Tax Information */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Nationalité *
          </label>
          <input
            type="text"
            {...register('nationality')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.nationality && (
            <p className="mt-1 text-sm text-red-600">{errors.nationality.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Pays de résidence fiscale *
          </label>
          <input
            type="text"
            {...register('taxResidence')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.taxResidence && (
            <p className="mt-1 text-sm text-red-600">{errors.taxResidence.message}</p>
          )}
        </div>
      </div>

      {/* US Citizenship */}
      <div className="relative flex items-start">
        <div className="flex h-5 items-center">
          <input
            type="checkbox"
            {...register('isUsCitizen')}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
        </div>
        <div className="ml-3 text-sm">
          <label className="font-medium text-gray-700">
            Ressortissant américain
          </label>
          <p className="text-gray-500">
            Cochez si vous êtes citoyen des États-Unis
          </p>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Continue
        </button>
      </div>
    </form>
  );
}