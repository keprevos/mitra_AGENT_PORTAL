import { z } from 'zod';

export enum RequestStatus {
  // Initial States
  DRAFT = 0,                    // REQSTATUS00030 - Demande enregistrée
  COMPLETED = 50,               // REQSTATUS00031 - Saisie complétée
  SIGNED = 90,                  // REQSTATUS00032 - Signature de la demande
  SUBMITTED = 100,              // REQSTATUS00033 - Nouvelle demande
  
  // Correction States
  CORRECTION_N0 = 110,          // REQSTATUS00034 - Demande de correction par N0
  CORRECTION_N1 = 105,          // REQSTATUS00052 - Demande de correction par N1
  CORRECTION_N2 = 106,          // REQSTATUS00061 - Demande de correction par N2
  CLIENT_CORRECTED = 120,       // REQSTATUS00035 - Correction client
  
  // CTO Review States
  CTO_REVIEW = 130,            // REQSTATUS00036 - Contrôle CTO
  CTO_CORRECTION_N1 = 133,     // REQSTATUS00037 - Contrôle CTO en attente N1
  CTO_N2_REVIEW = 135,         // REQSTATUS00038 - Contrôle CTO en attente avis N2
  
  // Double Validation States
  N2_REVIEW = 140,             // REQSTATUS00039 - Avis N2 demandé
  N2_CORRECTION = 141,         // REQSTATUS00053 - Avis N2 avec retour client
  
  // Capital and Payment States
  CAPITAL_PENDING = 155,       // REQSTATUS00043 - En attente du dépôt de capital N0
  CAPITAL_N1 = 156,           // REQSTATUS00064 - En attente du dépôt de capital N1
  CAPITAL_N2 = 157,           // REQSTATUS00065 - En attente du dépôt de capital N2
  INITIAL_TRANSFER = 150,      // REQSTATUS00042 - En attente de virement N0
  
  // Registration States
  KBIS_PENDING = 160,         // REQSTATUS00044 - En attente du K-Bis
  KBIS_RECEIVED = 161,        // REQSTATUS00070 - Kbis envoyé par le client
  
  // Final States
  REJECTED_N0 = 101,          // REQSTATUS00045 - Demande refusée N0
  REJECTED_N1 = 171,          // REQSTATUS00066 - Demande refusée N1
  REJECTED_N2 = 172,          // REQSTATUS00067 - Demande refusée N2
  BANK_SIGNED = 180,          // REQSTATUS00046 - Signature Banque apposée
  ACCOUNT_OPENED = 190,       // REQSTATUS00048 - Compte ouvert
  CLOSED = 999                // REQSTATUS00159 - Demande clôturée
}

export interface PersonalInfo {
  title: 'madame' | 'monsieur';
  surname: string;
  firstName: string;
  maidenName?: string;
  email: string;
  mobile: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  birthDate: string;
  birthPlace: string;
  birthCountry: string;
  nationality: string;
  taxResidence: string;
  isUsCitizen: boolean;
}

export interface BusinessInfo {
  legalForm: string;
  siret: string;
  companyName: string;
  industryCode: string;
  brandName?: string;
  address: {
    street: string;
    city: string;
    postalCode: string;
    country: string;
  };
  activityDescription: string;
  clientLocation: string;
  clientTypes: string;
  lastTurnover?: string;
}

export interface Shareholder {
  type: 'individual' | 'company';
  ownershipPercentage: number;
  // Individual fields
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  nationality?: string;
  // Company fields
  companyName?: string;
  registrationNumber?: string;
}

export interface Documents {
  proofOfResidence: string[];
  identityDocument: string[];
  signature: string[];
  bankDetails: string[];
}

export interface ValidationFeedback {
  status: 'ok' | 'error' | 'warning';
  comment?: string;
  fieldId: string;
  validatedBy: string;
  validatedAt: Date;
}


export interface OnboardingRequest {
  id: string;
  personalInfo: PersonalInfo;
  businessInfo: BusinessInfo;
  shareholders: Shareholder[];
  documents: Documents;
  status: RequestStatus;
  agentId: string;
  bankId: string;
  agencyId: string;
  validatedBy?: string;
  validationDate?: Date;
  validationComments?: Record<string, any>;
  lastModifiedBy?: string;
  createdAt: Date;
  updatedAt: Date;
  history?: Array<{
    id: string;
    status: RequestStatus;
    userId: string;
    userName: string;
    comment?: string;
    timestamp: Date;
  }>;
}