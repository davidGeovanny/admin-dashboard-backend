const { check, param } = require('express-validator');
const { checkBranchCompanyExists } = require('../middlewares');

const deliveryPointCommissionConfigPostRules = [
  /** Fields */
  check('min_range')
    .notEmpty()
    .withMessage('Necesita proporcionar un rango mínimo')
    .isInt({ min: 0 })
    .withMessage('El rango mínimo no es un valor válido'),
  check('max_range')
    .notEmpty()
    .withMessage('Necesita proporcionar un valor máximo')
    .isInt({ min: 1 })
    .withMessage('El rango máximo no es un valor válido'),
  check('percent')
    .notEmpty()
    .withMessage('Necesita proveer el porcentaje de comisión para el empleado')
    .isFloat({ min: 0.001 })
    .withMessage('El porcentaje de la comisión debe de ser mayor a 0'),
  check('id_branch_company')
    .notEmpty()
    .withMessage('La sucursal seleccionada no existe')
    .custom( checkBranchCompanyExists )
    .toInt(),
];

const deliveryPointCommissionConfigPutRules = [
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
    .withMessage('Necesita proporcionar un rango mínimo')
    .isInt({ min: 0 })
    .withMessage('El rango mínimo no es un valor válido'),
  check('max_range')
    .optional()
    .notEmpty()
    .withMessage('Necesita proporcionar un valor máximo')
    .isInt({ min: 1 })
    .withMessage('El rango máximo no es un valor válido'),
  check('percent')
    .notEmpty()
    .withMessage('Necesita proveer el porcentaje de comisión para el empleado')
    .isFloat({ min: 0.001 })
    .withMessage('El porcentaje de la comisión debe de ser mayor a 0'),
  check('id_branch_company')
    .optional()
    .notEmpty()
    .withMessage('La sucursal seleccionada no existe')
    .custom( checkBranchCompanyExists )
    .toInt(),
];

module.exports = {
  deliveryPointCommissionConfigPostRules,
  deliveryPointCommissionConfigPutRules,
};