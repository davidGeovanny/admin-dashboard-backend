const { check, param }          = require('express-validator');
const { checkProfileAvailable } = require('../middlewares');
const { profileStatus } = require('../data/static-data');

/** Post Request */
const profilePostRules = [
  /** Fields */
  check('profile')
    .notEmpty()
    .withMessage('Necesita proporcionar un nombre para el perfil')
    .isString()
    .withMessage('Necesita proporcionar un nombre de perfil válido')
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
    .withMessage('Necesita proporcionar un nombre para el perfil')
    .isString()
    .withMessage('Necesita proporcionar un nombre de perfil válido')
    .custom( checkProfileAvailable ),
  check('default')
    .optional()
    .isBoolean()
    .withMessage('Error marcando este perfil como "por defecto"')
    .toBoolean(),
  check('status')
    .optional()
    .isIn( profileStatus )
    .withMessage('Error cambiando el estatus del perfil')
];

module.exports = {
  profilePostRules,
  profilePutRules,
};