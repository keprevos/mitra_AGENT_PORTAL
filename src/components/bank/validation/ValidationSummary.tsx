import React from 'react';
import { Check, AlertTriangle, X } from 'lucide-react';

interface ValidationSummaryProps {
  validationStatus: Record<string, {
    status?: 'ok' | 'error' | 'warning';
    comment?: string;
  }>;
}

export function ValidationSummary({ validationStatus }: ValidationSummaryProps) {
  const summary = Object.entries(validationStatus).reduce(
    (acc, [_, curr]) => {
      if (curr.status === 'ok') acc.valid++;
      else if (curr.status === 'error') acc.invalid++;
      else if (curr.status === 'warning') acc.warnings++;
      return acc;
    },
    { valid: 0, invalid: 0, warnings: 0 }
  );

  const total = Object.keys(validationStatus).length || 1; // Prevent division by zero
  const validated = summary.valid + summary.invalid + summary.warnings;
  const progressPercentage = Math.round((validated / total) * 100);

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Validation Progress
      </h3>
      
      <div className="flex justify-between mb-4">
        <div className="text-sm text-gray-500">
          {validated} of {total} fields validated
        </div>
        <div className="text-sm font-medium text-gray-900">
          {progressPercentage}%
        </div>
      </div>

      <div className="h-2 bg-gray-200 rounded-full mb-6">
        <div
          className="h-2 bg-indigo-600 rounded-full transition-all duration-300"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center p-3 bg-green-50 rounded-lg">
          <Check className="h-5 w-5 text-green-500 mr-2" />
          <div>
            <div className="text-sm font-medium text-green-900">
              Valid
            </div>
            <div className="text-2xl font-semibold text-green-700">
              {summary.valid}
            </div>
          </div>
        </div>

        <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2" />
          <div>
            <div className="text-sm font-medium text-yellow-900">
              Warnings
            </div>
            <div className="text-2xl font-semibold text-yellow-700">
              {summary.warnings}
            </div>
          </div>
        </div>

        <div className="flex items-center p-3 bg-red-50 rounded-lg">
          <X className="h-5 w-5 text-red-500 mr-2" />
          <div>
            <div className="text-sm font-medium text-red-900">
              Invalid
            </div>
            <div className="text-2xl font-semibold text-red-700">
              {summary.invalid}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}