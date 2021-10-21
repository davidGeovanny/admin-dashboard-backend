const { check, param } = require('express-validator');
const { checkBranchCompanyExists } = require('../middlewares');

const icebarCommissionConfigPostRules = [
  /** Fields */
  check('min_range')
    .notEmpty()
    .withMessage('Need to provide a min range')
    .isInt({ min: 0 })
    .withMessage('Min range is not a valid value'),
  check('max_range')
    .notEmpty()
    .withMessage('Need to provide a max range')
    .isInt({ min: 1 })
    .withMessage('Max range is not a valid value'),
  check('cost_bar_operator')
    .notEmpty()
    .withMessage('Need to provide a cost bar for the operator')
    .isFloat({ min: 0.001 })
    .withMessage('Cost bar must be greather than 0'),
  check('cost_bar_assistant')
    .optional()
    .isFloat({ min: 0.001 })
    .withMessage('Cost bar must be greather than 0'),
  check('cost_bar_operator_assistant')
    .optional()
    .isFloat({ min: 0.001 })
    .withMessage('Cost bar must be greather than 0'),
  check('id_branch_company')
    .notEmpty()
    .withMessage('The branch company selected does not exist')
    .custom( checkBranchCompanyExists )
    .toInt(),
];

const icebarCommissionConfigPutRules = [
  /** Params */
  param('id')
    .notEmpty()
    .withMessage('The configuration does not exist')
    .isNumeric()
    .withMessage('The configuration does not exist'),

  /** Fields */
  check('min_range')
    .optional()
    .notEmpty()
    .withMessage('Need to provide a min range')
    .isInt({ min: 0 })
    .withMessage('Min range is not a valid value'),
  check('max_range')
    .optional()
    .notEmpty()
    .withMessage('Need to provide a max range')
    .isInt({ min: 1 })
    .withMessage('Max range is not a valid value'),
  check('cost_bar_operator')
    .optional()
    .notEmpty()
    .withMessage('Need to provide a cost bar for the operator')
    .isFloat({ min: 0.001 })
    .withMessage('Cost bar must be greather than 0'),
  check('cost_bar_assistant')
    .optional()
    .isFloat({ min: 0.001 })
    .withMessage('Cost bar must be greather than 0'),
  check('cost_bar_operator_assistant')
    .optional()
    .isFloat({ min: 0.001 })
    .withMessage('Cost bar must be greather than 0'),
  check('id_branch_company')
    .optional()
    .notEmpty()
    .withMessage('The branch company selected does not exist')
    .custom( checkBranchCompanyExists )
    .toInt(),
];

module.exports = {
  icebarCommissionConfigPostRules,
  icebarCommissionConfigPutRules,
};