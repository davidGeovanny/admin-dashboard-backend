const { check } = require('express-validator');
const { employeePostRules }   = require('./employee-rules');
const { checkPasswordsMatch } = require('../middlewares');

const authRegisterRules = [
  /** Fields */
  ...employeePostRules,
  check('password')
    .notEmpty()
    .withMessage('Need to provide a password'),
  check('password_confirmation')
    .notEmpty()
    .withMessage('The passwords do not match')
    .custom( checkPasswordsMatch ),
];

const authLoginRules = [
  /** Fields */
  check('username')
    .notEmpty()
    .withMessage('Need to provide an username'),
  check('password')
    .notEmpty()
    .withMessage('Need to provide a password'),
];

module.exports = {
  authRegisterRules,
  authLoginRules,
};