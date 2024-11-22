const { onboardingSchemas } = require('../validators/onboardingSchemas');

/**
 * Validates an onboarding request
 * @param {Object} request - The request object to validate
 * @param {boolean} isSubmission - Whether this is a final submission
 * @returns {Promise<{isValid: boolean, errors: Array}>}
 */
exports.validateRequest = async (request, isSubmission = false) => {
  try {
    const schema = isSubmission ? 
      onboardingSchemas.submitRequest : 
      onboardingSchemas.createRequest;

    const { error } = schema.validate(request, { abortEarly: false });

    if (error) {
      return {
        isValid: false,
        errors: error.details.map(detail => ({
          field: detail.path.join('.'),
          message: detail.message
        }))
      };
    }

    return {
      isValid: true,
      errors: []
    };
  } catch (error) {
    console.error('Validation error:', error);
    return {
      isValid: false,
      errors: [{ field: 'general', message: 'Validation failed' }]
    };
  }
};