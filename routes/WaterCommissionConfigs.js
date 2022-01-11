const { Router } = require('express');
const { param }  = require('express-validator');

const { checkValidityFields }  = require('../middlewares');
const { waterCommissionConfigPostRules }    = require('../rules/WaterCommissionConfigRules');

const { 
  getWaterCommissionConfig, 
  createWaterCommissionConfig, 
  deleteWaterCommissionConfig 
} = require('../controllers/WaterCommissionConfig/WaterCommissionConfigController');

const router = Router();

router.get('/', [], getWaterCommissionConfig);

router.post('/', [
  ...waterCommissionConfigPostRules,
  checkValidityFields
], createWaterCommissionConfig);

router.delete('/:id', [
  param('id', 'La configuración no existe').isNumeric(),
  checkValidityFields
], deleteWaterCommissionConfig);

module.exports = router;