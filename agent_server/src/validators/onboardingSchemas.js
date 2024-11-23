const Joi = require('joi');

const documentsSchema = Joi.object({
  proofOfResidence: Joi.array().items(Joi.string().required()).default([]),
  identityDocument: Joi.array().items(Joi.string().required()).default([]),
  signature: Joi.array().items(Joi.string().required()).default([]),
  bankDetails: Joi.array().items(Joi.string().required()).default([])
}).default({
  proofOfResidence: [],
  identityDocument: [],
  signature: [],
  bankDetails: []
});

const personalInfoSchema = Joi.object({
  title: Joi.string().valid('madame', 'monsieur').required(),
  surname: Joi.string().min(2).required(),
  firstName: Joi.string().min(2).required(),
  maidenName: Joi.string().allow('', null),
  email: Joi.string().email().required(),
  mobile: Joi.string().min(10).required(),
  address: Joi.object({
    street: Joi.string().min(5).required(),
    city: Joi.string().min(2).required(),
    postalCode: Joi.string().min(5).required(),
    country: Joi.string().min(2).required()
  }).required(),
  birthDate: Joi.string().required(),
  birthPlace: Joi.string().min(2).required(),
  birthCountry: Joi.string().min(2).required(),
  nationality: Joi.string().min(2).required(),
  taxResidence: Joi.string().min(2).required(),
  isUsCitizen: Joi.boolean().required()
});

const businessInfoSchema = Joi.object({
  legalForm: Joi.string().required(),
  siret: Joi.string().length(14).pattern(/^\d+$/).required(),
  companyName: Joi.string().min(2).required(),
  industryCode: Joi.string().pattern(/^\d{4}[A-Z]$/).required()
    .messages({
      'string.pattern.base': 'Industry code must be in format: 4 digits followed by 1 letter (e.g., 6202A)'
    }),
  brandName: Joi.string().allow('', null),
  address: Joi.object({
    street: Joi.string().min(5).required(),
    city: Joi.string().min(2).required(),
    postalCode: Joi.string().min(5).required(),
    country: Joi.string().min(2).required()
  }).required(),
  activityDescription: Joi.string().min(10).required(),
  clientLocation: Joi.string().min(2).required(),
  clientTypes: Joi.string().min(2).required(),
  lastTurnover: Joi.string().allow('', null)
});

const individualShareholderSchema = Joi.object({
  type: Joi.string().valid('individual').required(),
  ownershipPercentage: Joi.number().min(0).max(100).required(),
  firstName: Joi.string().min(2).required(),
  lastName: Joi.string().min(2).required(),
  birthDate: Joi.string().required(),
  nationality: Joi.string().min(2).required()
}).unknown(false);

const companyShareholderSchema = Joi.object({
  type: Joi.string().valid('company').required(),
  ownershipPercentage: Joi.number().min(0).max(100).required(),
  companyName: Joi.string().min(2).required(),
  registrationNumber: Joi.string().min(5).required()
}).unknown(false);

const shareholderSchema = Joi.alternatives().try(
  individualShareholderSchema,
  companyShareholderSchema
);

exports.onboardingSchemas = {
  // Schema for creating/updating personal info only
  personalInfo: Joi.object({
    personalInfo: personalInfoSchema.required()
  }),

  // Schema for creating/updating business info only
  businessInfo: Joi.object({
    businessInfo: businessInfoSchema.required()
  }),

  // Schema for creating/updating shareholders only
  shareholders: Joi.object({
    shareholders: Joi.array().items(shareholderSchema)
      .custom((value, helpers) => {
        if (value && value.length > 0) {
          const total = value.reduce((sum, shareholder) => sum + shareholder.ownershipPercentage, 0);
          if (Math.abs(total - 100) > 0.01) {
            return helpers.error('any.invalid', { message: 'Total ownership percentage must equal 100%' });
          }
        }
        return value;
      })
  }),

  // Schema for creating/updating documents only
  documents: Joi.object({
    documents: documentsSchema
  }),

  // Schema for creating a new request (allows partial data)
  createRequest: Joi.object({
    personalInfo: personalInfoSchema.optional(),
    businessInfo: businessInfoSchema.optional(),
    shareholders: Joi.array().items(shareholderSchema).optional(),
    documents: documentsSchema.optional()
  }).min(1),

  // Schema for updating an existing request (allows partial data)
  updateRequest: Joi.object({
    personalInfo: personalInfoSchema.optional(),
    businessInfo: businessInfoSchema.optional(),
    shareholders: Joi.array().items(shareholderSchema).optional(),
    documents: documentsSchema.optional()
  }).min(1),

  // Schema for submitting the final request (requires all data)
  submitRequest: Joi.object({
    personalInfo: personalInfoSchema.required(),
    businessInfo: businessInfoSchema.required(),
    shareholders: Joi.array().items(shareholderSchema).min(1).required()
      .custom((value, helpers) => {
        const total = value.reduce((sum, shareholder) => sum + shareholder.ownershipPercentage, 0);
        if (Math.abs(total - 100) > 0.01) {
          return helpers.error('any.invalid', { message: 'Total ownership percentage must equal 100%' });
        }
        return value;
      }),
    documents: documentsSchema.required()
      .custom((value, helpers) => {
        const requiredDocs = ['proofOfResidence', 'identityDocument', 'signature', 'bankDetails'];
        const missingDocs = requiredDocs.filter(type => !value[type] || value[type].length === 0);
        
        if (missingDocs.length > 0) {
          return helpers.error('any.invalid', { 
            message: `Missing required documents: ${missingDocs.join(', ')}`
          });
        }
        return value;
      })
  })
};