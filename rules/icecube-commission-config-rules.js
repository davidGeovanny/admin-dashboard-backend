const { check } = require('express-validator');
const { checkBranchCompanyExists } = require('../middlewares');

const icecubeCommissionConfigPostRules = [
  /** Fields */
  check('non_commissionable_kg')
    .notEmpty()
    .withMessage('Need to provide a non-commissionable kg')
    .isFloat({ min: 0.01 })
    .withMessage('Non-commissionable kg must be greather than 0'),
  check('percent_operator')
    .notEmpty()
    .withMessage('Need to provide a commission percentage for the operator')
    .isFloat({ min: 0, max: 100 })
    .withMessage('Percentage for the operator must be a number between 0 and 100'),
  check('percent_assistant')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Percentage for the assistant must be a number between 0 and 100'),
  check('percent_operator_assistant')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Percentage for the operator assistant must be a number between 0 and 100'),
  check('id_branch_company')
    .notEmpty()
    .withMessage('The branch company selected does not exist')
    .custom( checkBranchCompanyExists )
    .toInt(),
];

module.exports = {
  icecubeCommissionConfigPostRules,
};