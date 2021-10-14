const { check, param }        = require('express-validator');
const { checkEmailAvailable } = require('../middlewares');
const { userGenders } = require('../data/static-data');

const employeePostRules = [
  /** Fields */
  check('name')
    .notEmpty()
    .withMessage('Need to provide your name')
    .isString()
    .withMessage('The name provided is not valid'),
  check('first_lastname')
    .notEmpty()
    .withMessage('Need to provide your first_lastname')
    .isString()
    .withMessage('The first_lastname provided is not valid'),
  check('second_lastname')
    .notEmpty()
    .withMessage('Need to provide your second_lastname')
    .isString()
    .withMessage('The second_lastname provided is not valid'),
  check('gender')
    .isIn( userGenders )
    .withMessage('Gender not valid. Available values: ' + userGenders.join(', ')),
  check('email')
    .notEmpty()
    .withMessage('Need to provide an email')
    .isEmail()
    .withMessage('The email provided is not valid')
    .custom( checkEmailAvailable ),
];

const employeePutRules = [
  /** Params */
  param('id', 'The employee does not exist').isNumeric(),
  /** Fields */
  check('name')
    .optional()
    .notEmpty()
    .withMessage('Need to provide your name')
    .isString()
    .withMessage('The name provided is not valid'),
  check('first_lastname')
    .optional()
    .notEmpty()
    .withMessage('Need to provide your first_lastname')
    .isString()
    .withMessage('The first_lastname provided is not valid'),
  check('second_lastname')
    .optional()
    .notEmpty()
    .withMessage('Need to provide your second_lastname')
    .isString()
    .withMessage('The second_lastname provided is not valid'),
  check('gender')
    .optional()
    .isIn( userGenders )
    .withMessage('Gender not valid. Available values: ' + userGenders.join(', ')),
  check('email')
    .optional()
    .isEmail()
    .withMessage('The email provided is not valid')
    .custom( checkEmailAvailable ),
];

module.exports = {
  employeePostRules,
  employeePutRules,
};