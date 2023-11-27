const { Router } = require('express');
const { param } = require('express-validator');

const { checkValidityFields } = require('../middlewares');
const { deliveryPointCommissionConfigPostRules, deliveryPointCommissionConfigPutRules } = require('../rules/DeliveryPointCommissionConfigRules');

const { 
  getDeliveryPointCommissionConfig, 
  createDeliveryPointCommissionConfig, 
  updateDeliveryPointCommissionConfig, 
  deleteDeliveryPointCommissionConfig 
} = require('../controllers/DeliveryPointCommissionConfig/DeliveryPointCommissionConfigController');

const router = Router();

router.get('/', [], getDeliveryPointCommissionConfig);

router.post('/', [
  ...deliveryPointCommissionConfigPostRules,
  checkValidityFields
], createDeliveryPointCommissionConfig);

router.put('/:id', [
  ...deliveryPointCommissionConfigPutRules,
  checkValidityFields
], updateDeliveryPointCommissionConfig);

router.delete('/:id', [
  param('id', 'La configuración no existe').isNumeric(),
  checkValidityFields
], deleteDeliveryPointCommissionConfig);

module.exports = router;