const { check, param }        = require('express-validator');
const { checkEmailAvailable } = require('../middlewares');
const EmployeeAttr = require('../utils/classes/EmployeeAttr');

const employeePostRules = [
  /** Fields */
  check('name')
    .notEmpty()
    .withMessage('Necesitas proporcionar el nombre')
    .isString()
    .withMessage('El nombre proporcionado no es válido'),
  check('first_lastname')
    .notEmpty()
    .withMessage('Necesitas proporcionar el apellido paterno')
    .isString()
    .withMessage('El apellido paterno proporcionado no es válido'),
  check('second_lastname')
    .notEmpty()
    .withMessage('Necesitas proporcionar el apellido materno')
    .isString()
    .withMessage('El apellido materno proporcionado no es válido'),
  check('gender')
    .isIn( EmployeeAttr.GENDERS )
    .withMessage('Género no válido. Géneros disponibles: ' + EmployeeAttr.GENDERS.join(', ')),
  check('email')
    .notEmpty()
    .withMessage('Necesita proporcionar un correo electrónico')
    .isEmail()
    .withMessage('El correo electrónico proporcionado no es válido')
    .custom( checkEmailAvailable ),
];

const employeePutRules = [
  /** Params */
  param('id', 'El empleado no existe').isNumeric(),
  /** Fields */
  check('name')
    .optional()
    .notEmpty()
    .withMessage('Necesitas proporcionar el nombre')
    .isString()
    .withMessage('El nombre proporcionado no es válido'),
  check('first_lastname')
    .optional()
    .notEmpty()
    .withMessage('Necesitas proporcionar el apellido paterno')
    .isString()
    .withMessage('El apellido paterno proporcionado no es válido'),
  check('second_lastname')
    .optional()
    .notEmpty()
    .withMessage('Necesitas proporcionar el apellido materno')
    .isString()
    .withMessage('El apellido materno proporcionado no es válido'),
  check('gender')
    .optional()
    .isIn( EmployeeAttr.GENDERS )
    .withMessage('Género no válido. Géneros disponibles: ' + EmployeeAttr.GENDERS.join(', ')),
  check('email')
    .optional()
    .isEmail()
    .withMessage('El correo electrónico proporcionado no es válido')
    .custom( checkEmailAvailable ),
];

module.exports = {
  employeePostRules,
  employeePutRules,
};