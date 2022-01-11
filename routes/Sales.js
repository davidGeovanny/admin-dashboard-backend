const { Router } = require('express');

const { checkValidityFields } = require('../middlewares');
const { saleGetRules, topClientsGetRules } = require('../rules/SaleRules');

const { 
  getSales,
  getTopClients,
  getTopProducts,
  getTopBranches,
  getTopTypeProducts,
} = require('../controllers/Sale/SaleController');
const { getCommissions } = require('../controllers/Commission/CommissionController');

const router = Router();

router.get('/', [
  ...saleGetRules,
  checkValidityFields,
], getSales);

router.get('/commissions', [
  ...saleGetRules,
  checkValidityFields,
], getCommissions);

router.get('/top-clients', [
  ...topClientsGetRules,
  checkValidityFields,
], getTopClients);

router.get('/top-products', [
  ...saleGetRules,
  checkValidityFields,
], getTopProducts);

router.get('/top-type-product', [
  ...saleGetRules,
  checkValidityFields,
], getTopTypeProducts);

router.get('/top-branches', [
  ...saleGetRules,
  checkValidityFields,
], getTopBranches);

module.exports = router;