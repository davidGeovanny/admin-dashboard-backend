const { check } = require('express-validator');
const { employeePostRules }   = require('./EmployeeRules');
const { checkPasswordsMatch } = require('../middlewares');

const authRegisterRules = [
  /** Fields */
  ...employeePostRules,
  check('password')
    .notEmpty()
    .withMessage('Necesita proporcionar una contraseña'),
  check('password_confirmation')
    .notEmpty()
    .withMessage('Las contraseñas no coinciden')
    .custom( checkPasswordsMatch ),
];

const authLoginRules = [
  /** Fields */
  check('username')
    .notEmpty()
    .withMessage('Necesita proporcionar un nombre de usuario'),
  check('password')
    .notEmpty()
    .withMessage('Necesita proporcionar una contraseña'),
];

module.exports = {
  authRegisterRules,
  authLoginRules,
};