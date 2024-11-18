import { passwordService } from '../services/passwordService.js';

export const validatePassword = (req, res, next) => {
  const { password } = req.body;

  const { isValid, errors } = passwordService.validatePasswordStrength(password);

  if (!isValid) {
    return res.status(400).json({
      message: 'Password does not meet requirements',
      errors,
    });
  }

  next();
};