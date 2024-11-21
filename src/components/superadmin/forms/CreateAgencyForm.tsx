import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { createAgencySchema, CreateAgencyDto } from '../../../types/agency';
import { Bank } from '../../../types/bank';

interface CreateAgencyFormProps {
  banks: Bank[];
  initialData?: Partial<CreateAgencyDto>;
  onSubmit: (data: CreateAgencyDto) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function CreateAgencyForm({ banks, initialData, onSubmit, onCancel, isSubmitting }: CreateAgencyFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAgencyDto>({
    resolver: zodResolver(createAgencySchema),
    defaultValues: initialData,
  });

  const isEditing = !!initialData;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            {isEditing ? 'Edit Agency' : 'Create New Agency'}
          </h3>
          <button onClick={onCancel} className="text-gray-400 hover:text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Bank Selection */}
          <div className="sm:col-span-6">
            <label className="block text-sm font-medium text-gray-700">Bank *</label>
            <select
              {...register('bankId')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              disabled={isEditing}
            >
              <option value="">Select a bank</option>
              {banks.map((bank) => (
                <option key={bank.id} value={bank.id}>
                  {bank.name}
                </option>
              ))}
            </select>
            {errors.bankId && (
              <p className="mt-1 text-sm text-red-600">{errors.bankId.message}</p>
            )}
          </div>

          {/* Agency Information */}
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Agency Name *</label>
              <input
                type="text"
                {...register('name')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Agency Code *</label>
              <input
                type="text"
                {...register('code')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.code && (
                <p className="mt-1 text-sm text-red-600">{errors.code.message}</p>
              )}
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Email *</label>
              <input
                type="email"
                {...register('email')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div className="sm:col-span-3">
              <label className="block text-sm font-medium text-gray-700">Phone *</label>
              <input
                type="text"
                {...register('phone')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>

            <div className="sm:col-span-6">
              <label className="block text-sm font-medium text-gray-700">Address *</label>
              <input
                type="text"
                {...register('address')}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
              {errors.address && (
                <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
              )}
            </div>
          </div>

          {/* Admin Information - Only show for new agencies */}
          {!isEditing && (
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-sm font-medium text-gray-900">Agency Administrator</h4>
              <div className="mt-4 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700">Email *</label>
                  <input
                    type="email"
                    {...register('adminEmail')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.adminEmail && (
                    <p className="mt-1 text-sm text-red-600">{errors.adminEmail.message}</p>
                  )}
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">First Name *</label>
                  <input
                    type="text"
                    {...register('adminFirstName')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.adminFirstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.adminFirstName.message}</p>
                  )}
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">Last Name *</label>
                  <input
                    type="text"
                    {...register('adminLastName')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.adminLastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.adminLastName.message}</p>
                  )}
                </div>

                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700">Password *</label>
                  <input
                    type="password"
                    {...register('adminPassword')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {errors.adminPassword && (
                    <p className="mt-1 text-sm text-red-600">{errors.adminPassword.message}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (isEditing ? 'Saving...' : 'Creating...') : (isEditing ? 'Save Changes' : 'Create Agency')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}