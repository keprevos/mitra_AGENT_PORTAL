const Joi = require('joi');

const documentsSchema = Joi.object({
  proofOfResidence: Joi.array().items(Joi.string()).default([]),
  identityDocument: Joi.array().items(Joi.string()).default([]),
  signature: Joi.array().items(Joi.string()).default([]),
  bankDetails: Joi.array().items(Joi.string()).default([])
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
  industryCode: Joi.string().pattern(/^\d{4}[A-Z]$/).required(),
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

const shareholderSchema = Joi.alternatives().try(
  Joi.object({
    type: Joi.string().valid('individual').required(),
    ownershipPercentage: Joi.number().min(0).max(100).required(),
    firstName: Joi.string().min(2).required(),
    lastName: Joi.string().min(2).required(),
    birthDate: Joi.string().required(),
    nationality: Joi.string().min(2).required()
  }),
  Joi.object({
    type: Joi.string().valid('company').required(),
    ownershipPercentage: Joi.number().min(0).max(100).required(),
    companyName: Joi.string().min(2).required(),
    registrationNumber: Joi.string().min(5).required()
  })
);

exports.onboardingSchemas = {
  // Schema for creating/updating request
  createRequest: Joi.object({
    personalInfo: personalInfoSchema.optional(),
    businessInfo: businessInfoSchema.optional(),
    shareholders: Joi.array().items(shareholderSchema).optional(),
    documents: documentsSchema.optional()
  }).min(1),

  // Schema for updating request
  updateRequest: Joi.object({
    personalInfo: personalInfoSchema.optional(),
    businessInfo: businessInfoSchema.optional(),
    shareholders: Joi.array().items(shareholderSchema).optional(),
    documents: documentsSchema.optional(),
    status: Joi.number().optional()
  }).min(1),

  // Schema for final submission
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
    documents: Joi.object({
      proofOfResidence: Joi.array().min(1).required(),
      identityDocument: Joi.array().min(1).required(),
      signature: Joi.array().min(1).required(),
      bankDetails: Joi.array().min(1).required()
    }).required()
  })
};