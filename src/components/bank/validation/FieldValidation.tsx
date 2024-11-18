import React, { useState } from 'react';
import { Check, AlertTriangle, X, Edit2 } from 'lucide-react';

interface ValidationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onValidate: (status: 'ok' | 'error' | 'warning', comment?: string) => void;
  onEdit?: (newValue: string) => void;
  currentValue: string;
  fieldName: string;
}

export function ValidationPopup({
  isOpen,
  onClose,
  onValidate,
  onEdit,
  currentValue,
  fieldName,
}: ValidationPopupProps) {
  const [comment, setComment] = useState('');
  const [editValue, setEditValue] = useState(currentValue);
  const [isEditing, setIsEditing] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-25 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Validate {fieldName}</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Current Value
          </label>
          {isEditing ? (
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          ) : (
            <div className="flex items-center justify-between">
              <p className="text-gray-900">{currentValue}</p>
              {onEdit && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Comment
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            rows={3}
          />
        </div>

        <div className="flex justify-end space-x-2">
          <button
            onClick={() => {
              if (isEditing && onEdit) {
                onEdit(editValue);
              }
              onValidate('ok', comment);
              onClose();
            }}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
          >
            <Check className="h-4 w-4 mr-2" />
            Valid
          </button>
          <button
            onClick={() => {
              onValidate('warning', comment);
              onClose();
            }}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-yellow-500 hover:bg-yellow-600"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Warning
          </button>
          <button
            onClick={() => {
              onValidate('error', comment);
              onClose();
            }}
            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            <X className="h-4 w-4 mr-2" />
            Invalid
          </button>
        </div>
      </div>
    </div>
  );
}

interface ValidatableFieldProps {
  label: string;
  value: string;
  status?: 'ok' | 'error' | 'warning';
  comment?: string;
  onValidate: (status: 'ok' | 'error' | 'warning', comment?: string) => void;
  onEdit?: (newValue: string) => void;
  editable?: boolean;
}

export function ValidatableField({
  label,
  value,
  status,
  comment,
  onValidate,
  onEdit,
  editable = false,
}: ValidatableFieldProps) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  return (
    <div className="group relative">
      <div 
        className={`
          flex items-center justify-between p-3 rounded-lg border
          ${status === 'ok' ? 'border-green-200 bg-green-50' :
            status === 'error' ? 'border-red-200 bg-red-50' :
            status === 'warning' ? 'border-yellow-200 bg-yellow-50' :
            'border-gray-200 bg-white hover:bg-gray-50'}
          cursor-pointer transition-colors
        `}
        onClick={() => setIsPopupOpen(true)}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            {label}
          </label>
          <p className="mt-1 text-sm text-gray-900">{value}</p>
          {comment && (
            <p className={`
              mt-1 text-xs
              ${status === 'ok' ? 'text-green-600' :
                status === 'error' ? 'text-red-600' :
                status === 'warning' ? 'text-yellow-600' :
                'text-gray-500'}
            `}>
              {comment}
            </p>
          )}
        </div>
        <div className={`
          flex items-center space-x-2
          ${status ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
          transition-opacity
        `}>
          {status === 'ok' && <Check className="h-5 w-5 text-green-500" />}
          {status === 'error' && <X className="h-5 w-5 text-red-500" />}
          {status === 'warning' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
        </div>
      </div>

      <ValidationPopup
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        onValidate={onValidate}
        onEdit={editable ? onEdit : undefined}
        currentValue={value}
        fieldName={label}
      />
    </div>
  );
}