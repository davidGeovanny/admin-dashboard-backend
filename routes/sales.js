const { Router } = require('express');
const { checkValidityFields, validateJWT } = require('../middlewares');
const { saleGetRules } = require('../rules/sale-rules');
const { getSales } = require('../controllers/sales');

const router = Router();

router.get('/', [
  validateJWT,
  ...saleGetRules,
  checkValidityFields,
], getSales);

module.exports = router;