const { Router } = require('express');
const { check, param } = require('express-validator');

const { 
  checkValidityFields, 
  checkEmailAvailable, 
  validateJWT,
  validateQueryParams,
} = require('../middlewares');

const { 
  getEmployees, 
  createEmployee, 
  updateEmployee, 
  deleteEmployee
} = require('../controllers/employees');
const { userGenders } = require('../data/static-data');

const router = Router();

router.get('/', [
  validateJWT,
  validateQueryParams
], getEmployees);

router.post('/', [
  validateJWT,
  check('name', 'Need to provide your name').notEmpty(),
  check('first_lastname', 'Need to provide your first_lastname').notEmpty(),
  check('second_lastname', 'Need to provide your second_lastname').notEmpty(),
  check('gender', 'Gender not valid. Available values: ' + userGenders.join(', ')).isIn( userGenders ),
  check('email', 'Need to provide an email').notEmpty(),
  check('email', 'Email provided is not valid').isEmail(),
  check('email').custom( checkEmailAvailable ),
  checkValidityFields
], createEmployee);

router.put('/:id', [
  validateJWT,
  param('id', 'The employee does not exist').isNumeric(),
  checkValidityFields
], updateEmployee);

router.delete('/:id', [
  validateJWT,
  param('id', 'The employee does not exist').isNumeric(),
  checkValidityFields
], deleteEmployee);

module.exports = router;