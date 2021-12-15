const { check, param } = require('express-validator');
const { checkBranchCompanyAvailable } = require('../middlewares');
const { branchCompanyStatus } = require('../data/static-data');

const branchPostRules = [
  check('branch')
    .notEmpty()
    .withMessage('Necesita proporcionar un nombre para la sucursal')
    .isString()
    .withMessage('Necesita proporcionar un nombre válido')
    .custom( checkBranchCompanyAvailable )
];

const branchPutRules = [
  /** Params */
  param('id', 'La sucursal no existe').isNumeric(),
  /** Fields */
  check('branch')
    .optional()
    .notEmpty()
    .withMessage('Necesita proporcionar un nombre para la sucursal')
    .isString()
    .withMessage('Necesita proporcionar un nombre válido')
    .custom( checkBranchCompanyAvailable ),
  check('status')
    .optional()
    .isIn( branchCompanyStatus )
    .withMessage('Estatus no válido'),
];

module.exports = {
  branchPostRules,
  branchPutRules,
};