import React from 'react';
import { Check } from 'lucide-react';

interface ReviewProps {
  data: {
    personal: any;
    activity: any;
    shareholders: any[];
    documents: any;
  };
  onBack: () => void;
  onSubmit: () => void;
}

export function Review({ data, onBack, onSubmit }: ReviewProps) {
  const { personal, activity, shareholders, documents } = data;

  const sections = [
    {
      title: 'Informations Personnelles',
      items: personal ? [
        { label: 'Nom', value: personal.surname },
        { label: 'Prénom', value: personal.firstName },
        { label: 'Email', value: personal.email },
        { label: 'Téléphone', value: personal.mobile },
        { label: 'Adresse', value: personal.address?.street },
      ] : [],
    },
    {
      title: 'Activité',
      items: activity ? [
        { label: 'Forme juridique', value: activity.legalForm },
        { label: 'SIRET', value: activity.siret },
        { label: 'Raison sociale', value: activity.companyName },
        { label: 'Code APE', value: activity.industryCode },
      ] : [],
    },
    {
      title: 'Actionnaires',
      items: shareholders ? shareholders.map((s, i) => ({
        label: `Actionnaire ${i + 1}`,
        value: s.type === 'individual'
          ? `${s.firstName} ${s.lastName} (${s.ownershipPercentage}%)`
          : `${s.companyName} (${s.ownershipPercentage}%)`,
      })) : [],
    },
    {
      title: 'Documents',
      items: documents ? [
        { label: 'Justificatif de domicile', value: documents.proofOfResidence?.[0]?.name },
        { label: "Pièce d'identité", value: documents.identityDocument?.[0]?.name },
        { label: 'Signature', value: documents.signature?.[0]?.name },
        { label: 'RIB', value: documents.bankDetails?.[0]?.name },
      ] : [],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg divide-y divide-gray-200">
        {sections.map((section) => (
          <div key={section.title} className="p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              {section.title}
            </h3>
            <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              {section.items.map((item) => (
                <div key={item.label} className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">{item.label}</dt>
                  <dd className="mt-1 text-sm text-gray-900">{item.value || '-'}</dd>
                </div>
              ))}
            </dl>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 p-6 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <div className="flex h-6 items-center">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="text-sm">
            <label htmlFor="terms" className="font-medium text-gray-700">
              Conditions générales
            </label>
            <p className="text-gray-500">
              En soumettant ce formulaire, je certifie que les informations fournies sont exactes et j'accepte les{' '}
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                conditions d'utilisation
              </a>
              {' '}et la{' '}
              <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                politique de confidentialité
              </a>
              .
            </p>
          </div>
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
          type="button"
          onClick={onSubmit}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Soumettre la demande
        </button>
      </div>
    </div>
  );
}