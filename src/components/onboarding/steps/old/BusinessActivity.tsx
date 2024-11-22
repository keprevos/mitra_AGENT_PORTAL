import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const businessSchema = z.object({
  legalForm: z.string().min(1, 'Forme juridique requise'),
  siret: z.string().min(14, 'SIRET doit contenir 14 chiffres').max(14),
  companyName: z.string().min(2, 'Dénomination requise'),
  industryCode: z.string().min(1, 'Code APE requis'),
  brandName: z.string().optional(),
  address: z.object({
    street: z.string().min(5, 'Adresse requise'),
    city: z.string().min(2, 'Ville requise'),
    postalCode: z.string().min(5, 'Code postal requis'),
    country: z.string().min(2, 'Pays requis'),
  }),
  activityDescription: z.string().min(10, 'Description requise'),
  clientLocation: z.string().min(2, 'Localisation des clients requise'),
  clientTypes: z.string().min(2, 'Types de clients requis'),
  lastTurnover: z.string().min(1, 'Chiffre d\'affaires requis'),
});

type BusinessInputs = z.infer<typeof businessSchema>;

interface BusinessActivityProps {
  data: any;
  onNext: (data: BusinessInputs) => void;
  onBack: () => void;
}

const legalForms = [
  'SAS', 'SARL', 'EURL', 'SA', 'SCI', 'Auto-entrepreneur',
  'SASU', 'SELARL', 'SCP', 'SCM'
];

export function BusinessActivity({ data, onNext, onBack }: BusinessActivityProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BusinessInputs>({
    resolver: zodResolver(businessSchema),
    defaultValues: data,
  });

  return (
    <form onSubmit={handleSubmit(onNext)} className="space-y-6">
      <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
        {/* Legal Form */}
        <div className="sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700">
            Forme juridique
          </label>
          <select
            {...register('legalForm')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            <option value="">Sélectionnez</option>
            {legalForms.map(form => (
              <option key={form} value={form}>{form}</option>
            ))}
          </select>
          {errors.legalForm && (
            <p className="mt-1 text-sm text-red-600">{errors.legalForm.message}</p>
          )}
        </div>

        {/* SIRET */}
        <div className="sm:col-span-3">
          <label className="block text-sm font-medium text-gray-700">
            SIRET
          </label>
          <input
            type="text"
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
            Dénomination / raison sociale
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
            Code APE
          </label>
          <input
            type="text"
            {...register('industryCode')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="ex: 8891A"
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
          <label className="block text-sm font-medium text-gray-700">
            Adresse de l'entreprise
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

        {/* Activity Description */}
        <div className="sm:col-span-6">
          <label className="block text-sm font-medium text-gray-700">
            Description de votre activité
          </label>
          <textarea
            {...register('activityDescription')}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {errors.activityDescription && (
            <p className="mt-1 text-sm text-red-600">{errors.activityDescription.message}</p>
          )}
        </div>

        {/* Client Location */}
        <div className="sm:col-span-6">
          <label className="block text-sm font-medium text-gray-700">
            Où se situent vos clients et / ou fournisseurs ?
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
            Qui sont vos clients et / ou fournisseurs ?
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
          {errors.lastTurnover && (
            <p className="mt-1 text-sm text-red-600">{errors.lastTurnover.message}</p>
          )}
        </div>
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