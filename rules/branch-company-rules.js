const { check } = require('express-validator');
const { branchCompanyStatus } = require('../data/static-data');
const { checkBranchCompanyAvailable } = require('../middlewares');

const branchPostRules = [
  check('branch')
    .notEmpty()
    .withMessage('Need to provide a branch name')
    .isString()
    .withMessage('Need to provide a valid branch name')
    .custom( checkBranchCompanyAvailable )
]

module.exports = {
  branchPostRules,
};