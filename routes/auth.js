const { Router } = require('express');
const { check } = require('express-validator');
const { checkValidityFields } = require('../middlewares/check-validity-fields');
const { checkEmailAvailable, checkPasswordsMatch } = require('../middlewares/validate-fields');
const { register } = require('../controllers/auth');
const { userGenders } = require('../data/static-data');

const router = Router();

router.post('/register', [
  check('name', 'Need to provide your name').notEmpty(),
  check('first_lastname', 'Need to provide your first_lastname').notEmpty(),
  check('second_lastname', 'Need to provide your second_lastname').notEmpty(),
  check('gender', 'Gender not valid. Available values: ' + userGenders.join(', ')).isIn( userGenders ),
  check('email', 'Need to provide an email').notEmpty(),
  check('email', 'Email provided is not valid').isEmail(),
  check('email').custom( checkEmailAvailable ),
  check('password').notEmpty(),
  check('password_confirmation').custom( checkPasswordsMatch ),
  checkValidityFields
], register);

module.exports = router;