const { Router }     = require('express');
const { query }      = require('express-validator');
const { clearCache } = require('../controllers/cache');

const { validateJWT, checkValidityFields } = require('../middlewares');

const router = Router();

router.delete('/', [
  validateJWT,
  query('key')
    .optional()
    .notEmpty()
    .withMessage('Need to provide a key'),
  checkValidityFields
], clearCache);

module.exports = router;