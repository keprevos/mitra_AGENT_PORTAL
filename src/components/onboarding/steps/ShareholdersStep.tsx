import React from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Trash2, User, Building2, Loader2 } from 'lucide-react';
import { useOnboarding } from '../../../contexts/OnboardingContext';

const shareholderSchema = z.object({
  shareholders: z.array(z.discriminatedUnion('type', [
    z.object({
      type: z.literal('individual'),
      ownershipPercentage: z.number()
        .min(0, 'Percentage must be greater than 0')
        .max(100, 'Percentage cannot exceed 100'),
      firstName: z.string().min(2, 'First name must be at least 2 characters'),
      lastName: z.string().min(2, 'Last name must be at least 2 characters'),
      birthDate: z.string().min(1, 'Birth date is required'),
      nationality: z.string().min(2, 'Nationality must be at least 2 characters'),
    }),
    z.object({
      type: z.literal('company'),
      ownershipPercentage: z.number()
        .min(0, 'Percentage must be greater than 0')
        .max(100, 'Percentage cannot exceed 100'),
      companyName: z.string().min(2, 'Company name must be at least 2 characters'),
      registrationNumber: z.string().min(5, 'Registration number must be at least 5 characters'),
    })
  ])).min(1, 'At least one shareholder is required')
    .refine(
      shareholders => {
        const total = shareholders.reduce((sum, s) => sum + s.ownershipPercentage, 0);
        return Math.abs(total - 100) < 0.01; // Allow for small floating point differences
      },
      'Total ownership percentage must equal 100%'
    ),
});

type ShareholderInputs = z.infer<typeof shareholderSchema>;

export function ShareholdersStep() {
  const { state, updateShareholders, nextStep, prevStep } = useOnboarding();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting }
  } = useForm<ShareholderInputs>({
    resolver: zodResolver(shareholderSchema),
    defaultValues: {
      shareholders: state.shareholders?.length ? state.shareholders : [{
        type: 'individual',
        ownershipPercentage: 100,
        firstName: '',
        lastName: '',
        birthDate: '',
        nationality: ''
      }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'shareholders'
  });

  const shareholders = watch('shareholders');
  const totalPercentage = shareholders?.reduce(
    (sum, s) => sum + (parseFloat(s.ownershipPercentage?.toString() || '0') || 0),
    0
  );

  const onSubmit = async (data: ShareholderInputs) => {
    try {
      updateShareholders(data.shareholders);
      await nextStep();
    } catch (error) {
      console.error('Error saving shareholders:', error);
    }
  };

  const addShareholder = () => {
    const remainingPercentage = Math.max(0, 100 - totalPercentage);
    append({
      type: 'individual',
      ownershipPercentage: remainingPercentage,
      firstName: '',
      lastName: '',
      birthDate: '',
      nationality: ''
    });
  };

  const handleTypeChange = (index: number, newType: 'individual' | 'company') => {
    const currentPercentage = shareholders[index]?.ownershipPercentage || 0;
    if (newType === 'individual') {
      setValue(`shareholders.${index}`, {
        type: 'individual',
        ownershipPercentage: currentPercentage,
        firstName: '',
        lastName: '',
        birthDate: '',
        nationality: ''
      });
    } else {
      setValue(`shareholders.${index}`, {
        type: 'company',
        ownershipPercentage: currentPercentage,
        companyName: '',
        registrationNumber: ''
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Total Percentage Indicator */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">
            Total Ownership:
          </span>
          <span className={`text-lg font-semibold ${
            Math.abs(totalPercentage - 100) < 0.01 ? 'text-green-600' : 'text-red-600'
          }`}>
            {totalPercentage.toFixed(2)}%
          </span>
        </div>
        <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              Math.abs(totalPercentage - 100) < 0.01 ? 'bg-green-500' : 'bg-red-500'
            }`}
            style={{ width: `${Math.min(totalPercentage, 100)}%` }}
          />
        </div>
      </div>

      {fields.map((field, index) => {
        const shareholder = shareholders[index];
        const isIndividual = shareholder?.type === 'individual';
        
        return (
          <div key={field.id} className="bg-gray-50 p-6 rounded-lg space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                {isIndividual ? (
                  <User className="h-5 w-5 mr-2 text-gray-500" />
                ) : (
                  <Building2 className="h-5 w-5 mr-2 text-gray-500" />
                )}
                Shareholder {index + 1}
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
                  Type *
                </label>
                <select
                  value={shareholder?.type}
                  onChange={(e) => handleTypeChange(index, e.target.value as 'individual' | 'company')}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                >
                  <option value="individual">Individual</option>
                  <option value="company">Company</option>
                </select>
              </div>

              {/* Ownership Percentage */}
              <div className="sm:col-span-3">
                <label className="block text-sm font-medium text-gray-700">
                  Ownership Percentage *
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    {...register(`shareholders.${index}.ownershipPercentage` as const, {
                      valueAsNumber: true
                    })}
                    className="block w-full pr-8 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
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
                      First Name *
                    </label>
                    <input
                      type="text"
                      {...register(`shareholders.${index}.firstName` as const)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    {errors.shareholders?.[index]?.firstName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.shareholders[index]?.firstName?.message}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      {...register(`shareholders.${index}.lastName` as const)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    {errors.shareholders?.[index]?.lastName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.shareholders[index]?.lastName?.message}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Birth Date *
                    </label>
                    <input
                      type="date"
                      {...register(`shareholders.${index}.birthDate` as const)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    {errors.shareholders?.[index]?.birthDate && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.shareholders[index]?.birthDate?.message}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Nationality *
                    </label>
                    <input
                      type="text"
                      {...register(`shareholders.${index}.nationality` as const)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    {errors.shareholders?.[index]?.nationality && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.shareholders[index]?.nationality?.message}
                      </p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Company Fields */}
                  <div className="sm:col-span-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      {...register(`shareholders.${index}.companyName` as const)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    {errors.shareholders?.[index]?.companyName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.shareholders[index]?.companyName?.message}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-4">
                    <label className="block text-sm font-medium text-gray-700">
                      Registration Number *
                    </label>
                    <input
                      type="text"
                      {...register(`shareholders.${index}.registrationNumber` as const)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                    {errors.shareholders?.[index]?.registrationNumber && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.shareholders[index]?.registrationNumber?.message}
                      </p>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        );
      })}

      {/* Add Shareholder Button */}
      <button
        type="button"
        onClick={addShareholder}
        className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <Plus className="h-5 w-5 mr-2" />
        Add Shareholder
      </button>

      {/* Error message for total percentage */}
      {errors.shareholders?.message && (
        <p className="text-sm text-red-600">{errors.shareholders.message}</p>
      )}

      {/* Navigation Buttons */}
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
          className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Continue'
          )}
        </button>
      </div>
    </form>
  );
}