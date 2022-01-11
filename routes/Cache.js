const { Router }     = require('express');
const { query }      = require('express-validator');
const { clearCache } = require('../controllers/Cache/CacheController');

const { checkValidityFields } = require('../middlewares');

const router = Router();

router.delete('/', [
  query('key')
    .optional()
    .notEmpty()
    .withMessage('Need to provide a key'),
  checkValidityFields
], clearCache);

module.exports = router;