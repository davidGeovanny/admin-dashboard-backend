const { Router } = require('express');
const { checkValidityFields, validateJWT, cache } = require('../middlewares');
const { saleGetRules } = require('../rules/sale-rules');
const { getSales, getCommissions } = require('../controllers/sales');

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

module.exports = router;