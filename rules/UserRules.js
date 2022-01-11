const { check, param, body } = require('express-validator');
const { 
  checkUserAvailable, 
  checkPasswordsMatch, 
  checkEmployeeExists 
} = require('../middlewares');
const UserAttr = require('../utils/classes/UserAttr');

const userPostRules = [
  /** Fields */
  check('username')
    .notEmpty()
    .withMessage('Necesita proporcionar un nombre de usuario')
    .isString()
    .withMessage('Necesita proporcionar un nombre de usuario válido')
    .isLength({ min: 4, max: 25 })
    .withMessage('La longitud del nombre de usuario debe estar entre 4 y 25 caracteres')
    .custom( checkUserAvailable ),
  check('password')
    .notEmpty()
    .withMessage('Necesita proporcionar una contraseña'),
  check('password_confirmation')
    .custom( checkPasswordsMatch ),
  check('id_employee')
    .notEmpty()
    .withMessage('El empleado seleccionado no existe')
    .custom( checkEmployeeExists )
    .toInt(),
];

const userPutRules = [
  /** Params */
  param('id', 'The username does not exist').isNumeric(),
  /** Fields */
  check('status')
    .optional()
    .isIn( UserAttr.STATUS )
    .withMessage('Error changing user status')
    .not()
    .isIn( [ UserAttr.STATUS[2] ] )
    .withMessage('Error changing user status - not available'),
  check('username')
    .optional()
    .notEmpty()
    .withMessage('Necesita proporcionar un nombre de usuario')
    .isString()
    .withMessage('Necesita proporcionar un nombre de usuario válido')
    .isLength({ min: 4, max: 25 })
    .withMessage('La longitud del nombre de usuario debe estar entre 4 y 25 caracteres')
    .custom( checkUserAvailable ),
  check('password')
    .optional()
    .notEmpty()
    .withMessage('Necesita proporcionar una contraseña'),
  check('password_confirmation')
    .if( body('password').exists() )
    .custom( checkPasswordsMatch ),
  check('id_employee')
    .optional()
    .notEmpty()
    .withMessage('El empleado seleccionado no existe')
    .custom( checkEmployeeExists ),
];

const userPasswordRules = [
  check('password')
    .notEmpty()
    .withMessage('Necesita proporcionar una nueva contraseña'),
  check('password_confirmation')
    .if( body('password').exists() )
    .custom( checkPasswordsMatch ),
];

const userAddRemoveProfileRules = [
  /** Params */
  param('id')
    .notEmpty()
    .withMessage('El usuario no existe')
    .isNumeric()
    .withMessage('El usuario no existe'),
  /** Fields */
  body('id_profile')
    .notEmpty()
    .withMessage('Es obligatorio enviar el perfil')
    .isNumeric()
    .withMessage('El perfil no existe')
];

module.exports = {
  userPostRules,
  userPutRules,
  userPasswordRules,
  userAddRemoveProfileRules,
};