const { Router } = require('express');

const { 
  checkValidityFields, 
  validateJWT, 
  cache 
} = require('../middlewares');
const { saleGetRules, topClientsGetRules } = require('../rules/sale-rules');

const { 
  getSales,
  getTopTypeProducts,
  getTopClients,
  getTopProducts,
  getSalesPerProduct
} = require('../controllers/sales');
const { getCommissions } = require('../controllers/commissions');

const router = Router();

router.get('/', [
  validateJWT,
  ...saleGetRules,
  checkValidityFields,
], getSales);

router.get('/commissions', [
  validateJWT,
  cache( 300 ),
  ...saleGetRules,
  checkValidityFields,
], getCommissions);

router.get('/top-clients', [
  validateJWT,
  // cache( 300 ),
  ...topClientsGetRules,
  checkValidityFields,
], getTopClients);

router.get('/top-products', [
  validateJWT,
  // cache( 300 ),
  ...saleGetRules,
  checkValidityFields,
], getTopProducts);

router.get('/top-type-product', [
  validateJWT,
  // cache( 300 ),
  ...saleGetRules,
  checkValidityFields,
], getTopTypeProducts);

router.get('/sales-product', [
  validateJWT,
  // cache( 300 ),
  ...saleGetRules,
  checkValidityFields,
], getSalesPerProduct);

module.exports = router;