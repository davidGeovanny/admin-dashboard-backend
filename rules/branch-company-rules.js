const { check, param } = require('express-validator');
const { checkBranchCompanyAvailable } = require('../middlewares');
const { branchCompanyStatus } = require('../data/static-data');

const branchPostRules = [
  check('branch')
    .notEmpty()
    .withMessage('Need to provide a branch name')
    .isString()
    .withMessage('Need to provide a valid branch name')
    .custom( checkBranchCompanyAvailable )
];

const branchPutRules = [
  /** Params */
  param('id', 'The branch company does not exist').isNumeric(),
  /** Fields */
  check('branch')
    .optional()
    .notEmpty()
    .withMessage('Need to provide a branch name')
    .isString()
    .withMessage('Need to provide a valid branch name')
    .custom( checkBranchCompanyAvailable ),
  check('status')
    .optional()
    .isIn( branchCompanyStatus )
    .withMessage('Status not valid'),
];

module.exports = {
  branchPostRules,
  branchPutRules,
};