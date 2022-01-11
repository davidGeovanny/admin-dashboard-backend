const { Router } = require('express');
const { param }  = require('express-validator');

const { checkValidityFields } = require('../middlewares');
const { icecubeCommissionConfigPostRules } = require('../rules/IcecubeCommissionConfigRules');

const { 
  getIcecubeCommissionConfig, 
  createIcecubeCommissionConfig, 
  deleteIcecubeCommissionConfig 
} = require('../controllers/IcecubeCommissionConfig/IcecubeCommissionConfigController');

const router = Router();

router.get('/', [], getIcecubeCommissionConfig);

router.post('/', [
  ...icecubeCommissionConfigPostRules,
  checkValidityFields
], createIcecubeCommissionConfig);

router.delete('/:id', [
  param('id', 'The config selected does not exist').isNumeric(),
  checkValidityFields
], deleteIcecubeCommissionConfig);

module.exports = router;