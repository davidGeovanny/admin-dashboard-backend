const { Router } = require('express');
const { param }  = require('express-validator');

const { checkValidityFields, validateJWT }  = require('../middlewares');
const { waterCommissionConfigPostRules }    = require('../rules/water-commission-config-rules');

const { 
  getWaterCommissionConfig, 
  createWaterCommissionConfig, 
  deleteWaterCommissionConfig 
} = require('../controllers/water-commission-config');

const router = Router();

router.get('/', [
  validateJWT
], getWaterCommissionConfig);

router.post('/', [
  validateJWT,
  ...waterCommissionConfigPostRules,
  checkValidityFields
], createWaterCommissionConfig);

router.delete('/:id', [
  validateJWT,
  param('id', 'La configuración no existe').isNumeric(),
  checkValidityFields
], deleteWaterCommissionConfig);

module.exports = router;