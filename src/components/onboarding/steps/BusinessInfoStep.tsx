import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useOnboarding } from '../OnboardingContext';

const businessInfoSchema = z.object({
  legalForm: z.string().min(1, 'Legal form is required'),
  siret: z.string()
    .length(14, 'SIRET must be exactly 14 digits')
    .regex(/^\d+$/, 'SIRET must contain only numbers'),
  companyName: z.string().min(2, 'Company name is required'),
  industryCode: z.string().optional(),
  brandName: z.string().optional(),
  address: z.object({
    street: z.string().min(5, 'Street address is required'),
    city: z.string().min(2, 'City is required'),
    postalCode: z.string().min(5, 'Postal code is required'),
    country: z.string().min(2, 'Country is required')
  }),
  activityDescription: z.string().min(10, 'Please provide a detailed description of your activity'),
  clientLocation: z.string().min(2, 'Client location is required'),
  clientTypes: z.string().min(2, 'Client types are required'),
  lastTurnover: z.string().optional()
});

type BusinessInfoInputs = z.infer<typeof businessInfoSchema>;

const LEGAL_FORMS = [
  { value: 'SAS', label: 'Société par Actions Simplifiée (SAS)' },
  { value: 'SARL', label: 'Société à Responsabilité Limitée (SARL)' },
  { value: 'EURL', label: 'Entreprise Unipersonnelle à Responsabilité Limitée (EURL)' },
  { value: 'SA', label: 'Société Anonyme (SA)' },
  { value: 'SCI', label: 'Société Civile Immobilière (SCI)' },
  { value: 'SASU', label: 'Société par Actions Simplifiée Unipersonnelle (SASU)' },
  { value: 'SNC', label: 'Société en Nom Collectif (SNC)' },
  { value: 'SELARL', label: 'Société d\'Exercice Libéral à Responsabilité Limitée (SELARL)' },
  { value: 'SCP', label: 'Société Civile Professionnelle (SCP)' },
  { value: 'SCM', label: 'Société Civile de Moyens (SCM)' }
];

export function BusinessInfoStep() {
  const { state, updateBusinessInfo, nextStep, prevStep } = useOnboarding();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<BusinessInfoInputs>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues: state.businessInfo
  });

  const onSubmit = (data: BusinessInfoInputs) => {
    updateBusinessInfo(data);
    nextStep();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        {/* Legal Form */}
        <div className="sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700">
            Forme juridique *
          </label>
          <select
            {...register('legalForm')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Sélectionnez une forme juridique</option>
            {LEGAL_FORMS.map(form => (
              <option key={form.value} value={form.value}>
                {form.label}
              </option>
            ))}
          </select>
          {errors.legalForm && (
            <p className="mt-1 text-sm text-red-600">{errors.legalForm.message}</p>
          )}
        </div>

        {/* SIRET */}
        <div className="sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700">
            SIRET *
          </label>
          <input
            type="text"
            maxLength={14}
            {...register('siret')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="12345678901234"
          />
          {errors.siret && (
            <p className="mt-1 text-sm text-red-600">{errors.siret.message}</p>
          )}
        </div>

        {/* Company Name */}
        <div className="sm:col-span-4">
          <label className="block text-sm font-medium text-gray-700">
            Dénomination / raison sociale *
          </label>
          <input
            type="text"
            {...register('companyName')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.companyName && (
            <p className="mt-1 text-sm text-red-600">{errors.companyName.message}</p>
          )}
        </div>

        {/* Industry Code */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700">
            Code APE *
          </label>
          <input
            type="text"
            {...register('industryCode')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="ex: 6202A"
          />
          {errors.industryCode && (
            <p className="mt-1 text-sm text-red-600">{errors.industryCode.message}</p>
          )}
        </div>

        {/* Brand Name */}
        <div className="sm:col-span-4">
          <label className="block text-sm font-medium text-gray-700">
            Enseigne
          </label>
          <input
            type="text"
            {...register('brandName')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        {/* Company Address */}
        <div className="sm:col-span-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Adresse de l'entreprise *
          </label>
          <div className="space-y-4">
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
        </div>

        {/* Activity Description */}
        <div className="sm:col-span-6">
          <label className="block text-sm font-medium text-gray-700">
            Description de votre activité *
          </label>
          <textarea
            {...register('activityDescription')}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.activityDescription && (
            <p className="mt-1 text-sm text-red-600">{errors.activityDescription.message}</p>
          )}
        </div>

        {/* Client Location */}
        <div className="sm:col-span-6">
          <label className="block text-sm font-medium text-gray-700">
            Où se situent vos clients et / ou fournisseurs ? *
          </label>
          <input
            type="text"
            {...register('clientLocation')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.clientLocation && (
            <p className="mt-1 text-sm text-red-600">{errors.clientLocation.message}</p>
          )}
        </div>

        {/* Client Types */}
        <div className="sm:col-span-6">
          <label className="block text-sm font-medium text-gray-700">
            Qui sont vos clients et / ou fournisseurs ? *
          </label>
          <input
            type="text"
            {...register('clientTypes')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.clientTypes && (
            <p className="mt-1 text-sm text-red-600">{errors.clientTypes.message}</p>
          )}
        </div>

        {/* Last Turnover */}
        <div className="sm:col-span-4">
          <label className="block text-sm font-medium text-gray-700">
            Montant de votre dernier chiffre d'affaires
          </label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <input
              type="text"
              {...register('lastTurnover')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="0.00"
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <span className="text-gray-500 sm:text-sm">€</span>
            </div>
          </div>
        </div>
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
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Continue
        </button>
      </div>
    </form>
  );
}