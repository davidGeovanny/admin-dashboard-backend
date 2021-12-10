const { Router } = require('express');
const { param }  = require('express-validator');

const { checkValidityFields, validateJWT } = require('../middlewares');
const { 
  branchPostRules,
  branchPutRules, 
} = require('../rules/branch-company-rules');

const { 
  getBranchesCompany, 
  createBranchCompany, 
  updateBranchCompany,
  deleteBranchCompany,
  getExportData
} = require('../controllers/branches-company');

const router = Router();

router.get('/', [
  validateJWT
], getBranchesCompany);

router.post('/',[
  validateJWT,
  ...branchPostRules,
  checkValidityFields
], createBranchCompany);

router.put('/:id', [
  validateJWT,
  ...branchPutRules,
  checkValidityFields
], updateBranchCompany);

router.delete('/:id', [
  validateJWT,
  param('id', 'The branch company does not exist').isNumeric(),
  checkValidityFields
], deleteBranchCompany);

router.get("/Excel", getExportData)

module.exports = router;