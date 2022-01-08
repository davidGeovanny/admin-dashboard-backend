const { check } = require('express-validator');
const { checkBranchCompanyExists } = require('../middlewares');

const waterCommissionConfigPostRules = [
  /** Fields */
  check('percent_operator')
    .notEmpty()
    .withMessage('Necesita proporcionar un porcentaje de comisión para el operador')
    .isFloat({ min: 0, max: 100 })
    .withMessage('El porcentaje para el operador debe ser un número entre 0 y 100'),
  check('percent_assistant')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('El porcentaje para el asistente debe ser un número entre 0 y 100'),
  check('percent_operator_assistant')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('El porcentaje para el operador asistente debe ser un número entre 0 y 100'),
  check('id_branch_company')
    .notEmpty()
    .withMessage('La sucursal seleccionada no existe')
    .custom( checkBranchCompanyExists )
    .toInt(),
];

module.exports = {
  waterCommissionConfigPostRules,
};