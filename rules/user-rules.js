const { check, param, body } = require('express-validator');
const { 
  checkUserAvailable, 
  checkPasswordsMatch, 
  checkEmployeeExists 
} = require('../middlewares');
const { userStatus } = require('../data/static-data');

const userPostRules = [
  /** Fields */
  check('username')
    .notEmpty()
    .withMessage('Need to provide an username')
    .isString()
    .withMessage('Need to provide a valid username')
    .isLength({ min: 4, max: 25 })
    .withMessage('The username length must be between 4 and 25 characters')
    .custom( checkUserAvailable ),
  check('password')
    .notEmpty()
    .withMessage('Need to provide a password'),
  check('password_confirmation')
    .custom( checkPasswordsMatch ),
  check('id_employee')
    .notEmpty()
    .withMessage('The employee selected does not exist')
    .custom( checkEmployeeExists )
    .toInt(),
];

const userPutRules = [
  /** Params */
  param('id', 'The username does not exist').isNumeric(),
  /** Fields */
  check('status')
    .optional()
    .isIn( userStatus )
    .withMessage('Error changing user status')
    .not()
    .isIn( [ userStatus[2] ] )
    .withMessage('Error changing user status - not available'),
  check('username')
    .optional()
    .notEmpty()
    .withMessage('Need to provide an username')
    .isString()
    .withMessage('Need to provide a valid username')
    .isLength({ min: 4, max: 25 })
    .withMessage('The username length must be between 4 and 25 characters')
    .custom( checkUserAvailable ),
  check('password')
    .optional()
    .notEmpty()
    .withMessage('Need to provide a password'),
  check('password_confirmation')
    .if( body('password').exists() )
    .custom( checkPasswordsMatch ),
  check('id_employee')
    .optional()
    .notEmpty()
    .withMessage('The employee selected does not exist')
    .custom( checkEmployeeExists ),
];

const userPasswordRules = [
  check('password')
    .notEmpty()
    .withMessage('Need to provide a new password'),
  check('password_confirmation')
    .if( body('password').exists() )
    .custom( checkPasswordsMatch ),
];

const userAddRemoveProfileRules = [
  /** Params */
  param('id')
    .notEmpty()
    .withMessage('The username does not exist')
    .isNumeric()
    .withMessage('The username does not exist'),
  /** Fields */
  body('id_profile')
    .notEmpty()
    .withMessage('The profile does not exist')
    .isNumeric()
    .withMessage('The profile does not exist')
];

module.exports = {
  userPostRules,
  userPutRules,
  userPasswordRules,
  userAddRemoveProfileRules,
};