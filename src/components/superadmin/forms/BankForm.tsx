import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';

const bankSchema = z.object({
  name: z.string().min(2, 'Bank name is required'),
  registrationNumber: z.string().min(8, 'Registration number is required'),
  address: z.string().min(5, 'Address is required'),
  adminEmail: z.string().email('Valid email is required'),
  adminFirstName: z.string().min(2, 'First name is required'),
  adminLastName: z.string().min(2, 'Last name is required'),
});

type BankFormInputs = z.infer<typeof bankSchema>;

interface BankFormProps {
  onSubmit: (data: BankFormInputs) => void;
  onCancel: () => void;
  initialData?: Partial<BankFormInputs>;
  isSubmitting?: boolean;
}

export function BankForm({ onSubmit, onCancel, initialData, isSubmitting }: BankFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BankFormInputs>({
    resolver: zodResolver(bankSchema),
    defaultValues: initialData,
  });

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-medium text-gray-900">
            {initialData ? 'Edit Bank' : 'Add New Bank'}
          </h3>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
            {/* Bank Information */}
            <div className="sm:col-span-6">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Bank Information</h4>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    {...register('name')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">
                    Registration Number
                  </label>
                  <input
                    type="text"
                    {...register('registrationNumber')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {errors.registrationNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.registrationNumber.message}</p>
                  )}
                </div>

                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Address
                  </label>
                  <input
                    type="text"
                    {...register('address')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {errors.address && (
                    <p className="mt-1 text-sm text-red-600">{errors.address.message}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Bank Admin Information */}
            <div className="sm:col-span-6">
              <h4 className="text-sm font-medium text-gray-900 mb-4">Bank Administrator</h4>
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-6">
                  <label className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    {...register('adminEmail')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {errors.adminEmail && (
                    <p className="mt-1 text-sm text-red-600">{errors.adminEmail.message}</p>
                  )}
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">
                    First Name
                  </label>
                  <input
                    type="text"
                    {...register('adminFirstName')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {errors.adminFirstName && (
                    <p className="mt-1 text-sm text-red-600">{errors.adminFirstName.message}</p>
                  )}
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name
                  </label>
                  <input
                    type="text"
                    {...register('adminLastName')}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                  {errors.adminLastName && (
                    <p className="mt-1 text-sm text-red-600">{errors.adminLastName.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

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
              {isSubmitting ? 'Saving...' : initialData ? 'Save Changes' : 'Add Bank'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}