const { Router } = require('express');
const { check } = require('express-validator');
const { register } = require('../controllers/auth');
const { validateFields } = require('../helpers/validate-fields');

const router = Router();

router.post('/register', [
  check('name', 'Need to provide your name').notEmpty(),
  validateFields
], register);

module.exports = router;