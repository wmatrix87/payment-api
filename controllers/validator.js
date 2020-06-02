const { body, param, validationResult } = require('express-validator');


const paymentParamValidationRules = () => [
  param('id').exists(),
];

const paymentValidationRules = () => [
  body('payeeId').exists().withMessage('\'payeeId\' field is required'),
  body('payerId').exists().withMessage('\'payerId\' field is required'),
  body('paymentSystem').exists().withMessage('\'paymentSystem\' field is required'),
  body('paymentMethod').exists().withMessage('\'paymentMethod\' field is required'),
  body('amount').exists().withMessage('\'amount\' field is required'),
  body('currency').exists().withMessage('\'currency\' field is required'),
  body('comment').exists().withMessage('\'comment\' field is required'),
];

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  const extractedErrors = [];
  errors.array().map((err) => extractedErrors.push({ message: err.msg, path: err.param }));

  return res.status(422).json({
    code: 'ERR_VALIDATION',
    massage: 'Validation failed',
    details: extractedErrors,
  });
};

module.exports = {
  paymentParamValidationRules,
  paymentValidationRules,
  validate,
};
