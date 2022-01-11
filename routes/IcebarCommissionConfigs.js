const { Router } = require('express');
const { param } = require('express-validator');

const { checkValidityFields } = require('../middlewares');
const { icebarCommissionConfigPostRules, icebarCommissionConfigPutRules } = require('../rules/IcebarCommissionConfigRules');

const { 
  getIcebarCommissionConfig, 
  createIcebarCommissionConfig, 
  updateIcebarCommissionConfig, 
  deleteIcebarCommissionConfig 
} = require('../controllers/IcebarCommissionConfig/IcebarCommissionConfigController');

const router = Router();

router.get('/', [], getIcebarCommissionConfig);

router.post('/', [
  ...icebarCommissionConfigPostRules,
  checkValidityFields
], createIcebarCommissionConfig);

router.put('/:id', [
  ...icebarCommissionConfigPutRules,
  checkValidityFields
], updateIcebarCommissionConfig);

router.delete('/:id', [
  param('id', 'La configuración no existe').isNumeric(),
  checkValidityFields
], deleteIcebarCommissionConfig);

module.exports = router;