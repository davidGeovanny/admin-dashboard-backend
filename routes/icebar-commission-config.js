const { Router } = require('express');
const { param } = require('express-validator');

const { validateJWT, checkValidityFields } = require('../middlewares');
const { icebarCommissionConfigPostRules, icebarCommissionConfigPutRules } = require('../rules/icebar-commission-config-rules');

const { 
  getIcebarCommissionConfig, 
  createIcebarCommissionConfig, 
  updateIcebarCommissionConfig, 
  deleteIcebarCommissionConfig 
} = require('../controllers/icebar-commission-config');

const router = Router();

router.get('/', [
  validateJWT,
], getIcebarCommissionConfig);

router.post('/', [
  validateJWT,
  ...icebarCommissionConfigPostRules,
  checkValidityFields
], createIcebarCommissionConfig);

router.put('/:id', [
  validateJWT,
  ...icebarCommissionConfigPutRules,
  checkValidityFields
], updateIcebarCommissionConfig);

router.delete('/:id', [
  validateJWT,
  param('id', 'The configuration does not exist').isNumeric(),
  checkValidityFields
], deleteIcebarCommissionConfig);

module.exports = router;