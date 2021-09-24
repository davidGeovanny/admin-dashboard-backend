const { Router } = require('express');

const { checkValidityFields, validateJWT }  = require('../middlewares');
const { authRegisterRules, authLoginRules } = require('../rules/auth-rules');

const { register, login, validateUserToken } = require('../controllers/auth');

const router = Router();

router.post('/register', [
  ...authRegisterRules,
  checkValidityFields
], register);

router.post('/login', [
  ...authLoginRules,
  checkValidityFields
], login);

router.get('/', [
  validateJWT,
], validateUserToken);

module.exports = router;