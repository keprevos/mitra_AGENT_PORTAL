import React, { useEffect } from 'react';
import { ValidatableField } from './FieldValidation';

interface ValidationSection {
  title: string;
  fields: {
    key: string;
    label: string;
    value: string;
    editable?: boolean;
  }[];
}

interface RequestValidationProps {
  sections: ValidationSection[];
  validationStatus: Record<string, {
    status?: 'ok' | 'error' | 'warning';
    comment?: string;
  }>;
  onValidateField: (
    fieldKey: string,
    status: 'ok' | 'error' | 'warning',
    comment?: string
  ) => void;
  onEditField?: (fieldKey: string, newValue: string) => void;
}

export function RequestValidation({
  sections,
  validationStatus,
  onValidateField,
  onEditField,
}: RequestValidationProps) {
  // Initialize validation status for all fields
  useEffect(() => {
    sections.forEach((section) => {
      section.fields.forEach((field) => {
        if (!validationStatus.hasOwnProperty(field.key)) {
          onValidateField(field.key, undefined as any);
        }
      });
    });
  }, [sections]);

  return (
    <div className="space-y-8">
      {sections.map((section) => (
        <div key={section.title} className="bg-white rounded-lg shadow">
          <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {section.title}
            </h3>
          </div>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6">
              {section.fields.map((field) => (
                <ValidatableField
                  key={field.key}
                  label={field.label}
                  value={field.value}
                  status={validationStatus[field.key]?.status}
                  comment={validationStatus[field.key]?.comment}
                  onValidate={(status, comment) => 
                    onValidateField(field.key, status, comment)
                  }
                  onEdit={field.editable && onEditField ? 
                    (newValue) => onEditField(field.key, newValue) : 
                    undefined
                  }
                  editable={field.editable}
                />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}