const { check, param }          = require('express-validator');
const { checkProfileAvailable } = require('../middlewares');
const { profileStatus } = require('../data/static-data');

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
    .notEmpty()
    .withMessage('Neet to provide a profile name')
    .isString()
    .withMessage('Need to provide a valid profile name')
    .custom( checkProfileAvailable ),
  check('default')
    .optional()
    .isBoolean()
    .withMessage('Error checking this profile as default')
    .toBoolean(),
  check('status')
    .optional()
    .isIn( profileStatus )
    .withMessage("Error changing profile status")
];

module.exports = {
  profilePostRules,
  profilePutRules,
};