import React from 'react';
import { Check, AlertTriangle, X } from 'lucide-react';
import { ValidationFeedback } from '../../types/onboarding';

interface ValidationFeedbackDisplayProps {
  feedback: ValidationFeedback[];
  isAgentView?: boolean;
}

export function ValidationFeedbackDisplay({ feedback, isAgentView = false }: ValidationFeedbackDisplayProps) {
  const groupedFeedback = feedback.reduce((acc, item) => {
    const [section, field] = item.fieldId.split('.');
    if (!acc[section]) {
      acc[section] = [];
    }
    acc[section].push(item);
    return acc;
  }, {} as Record<string, ValidationFeedback[]>);

  const getStatusIcon = (status: 'ok' | 'error' | 'warning') => {
    switch (status) {
      case 'ok':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <X className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusColor = (status: 'ok' | 'error' | 'warning') => {
    switch (status) {
      case 'ok':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
    }
  };

  const getStatusText = (status: 'ok' | 'error' | 'warning') => {
    switch (status) {
      case 'ok':
        return 'Valid';
      case 'warning':
        return 'Needs Attention';
      case 'error':
        return 'Invalid';
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-medium text-gray-900">
        {isAgentView ? 'Validation Results' : 'Validation Feedback'}
      </h3>
      
      {Object.entries(groupedFeedback).map(([section, items]) => (
        <div key={section} className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 bg-gray-50">
            <h4 className="text-sm font-medium text-gray-900 capitalize">
              {section.replace(/([A-Z])/g, ' $1').trim()}
            </h4>
          </div>
          
          <div className="divide-y divide-gray-200">
            {items.map((item, index) => (
              <div 
                key={index} 
                className={`p-4 ${getStatusColor(item.status)}`}
              >
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    {getStatusIcon(item.status)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">
                        {item.fieldId.split('.')[1].replace(/([A-Z])/g, ' $1').trim()}
                      </p>
                      <span className={`
                        text-xs font-medium px-2 py-1 rounded-full
                        ${item.status === 'ok' ? 'text-green-800 bg-green-100' :
                          item.status === 'warning' ? 'text-yellow-800 bg-yellow-100' :
                          'text-red-800 bg-red-100'}
                      `}>
                        {getStatusText(item.status)}
                      </span>
                    </div>
                    {item.comment && (
                      <p className="mt-1 text-sm text-gray-500">{item.comment}</p>
                    )}
                    {!isAgentView && (
                      <p className="mt-1 text-xs text-gray-400">
                        Validated by {item.validatedBy} on {new Date(item.validatedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}