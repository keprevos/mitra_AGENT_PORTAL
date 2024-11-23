const { onboardingSchemas } = require('../validators/onboardingSchemas');

/**
 * Validates an onboarding request
 * @param {Object} request - The request object to validate
 * @param {boolean} isSubmission - Whether this is a final submission
 * @returns {Promise<{isValid: boolean, errors: Array}>}
 */
exports.validateRequest = async (request, isSubmission = false) => {
  try {
    // Only validate required fields for final submission
    if (!isSubmission) {
      return {
        isValid: true,
        errors: []
      };
    }

    // For final submission, validate all required fields
    const { error } = onboardingSchemas.submitRequest.validate(request, {
      abortEarly: false,
      allowUnknown: true
    });

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