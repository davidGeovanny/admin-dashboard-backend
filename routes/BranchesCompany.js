const { Router } = require('express');
const { param }  = require('express-validator');

const { checkValidityFields } = require('../middlewares');
const { branchPostRules, branchPutRules }  = require('../rules/BranchCompanyRules');

const { 
  getBranchesCompany, 
  createBranchCompany, 
  updateBranchCompany,
  deleteBranchCompany,
  getExportData,
} = require('../controllers/BranchCompany/BranchCompanyController');

const router = Router();

router.get('/', [], getBranchesCompany);

router.post('/',[
  ...branchPostRules,
  checkValidityFields
], createBranchCompany);

router.put('/:id', [
  ...branchPutRules,
  checkValidityFields
], updateBranchCompany);

router.delete('/:id', [
  param('id', 'La sucursal no existe').isNumeric(),
  checkValidityFields
], deleteBranchCompany);

router.get('/export', [], getExportData);

module.exports = router;