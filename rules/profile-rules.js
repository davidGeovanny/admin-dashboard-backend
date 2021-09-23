const { check, param } = require('express-validator');
const { checkProfileAvailable } = require('../middlewares');

/** Post Request */
const profilePostRules = [
  /** Fields */
  check('profile')
    .notEmpty()
    .withMessage('Need to provide a profile name')
    .isString()
    .withMessage('Need to provide a valid profile name')
    .custom( checkProfileAvailable ),
];

/** Put Request */
const profilePutRules = [
  /** Params */
  param('id', 'The profile does not exist').isNumeric(),
  /** Queries */

  /** Fields */
  check('profile')
    .optional()
    .isString()
    .withMessage('Need to provide a valid profile name')
    .custom( checkProfileAvailable ),
  check('default')
    .optional()
    .isBoolean()
    .withMessage('Error checking this profile as default')
    .toBoolean(),
];

module.exports = {
  profilePostRules,
  profilePutRules,
};