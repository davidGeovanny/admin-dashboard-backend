const { Router } = require('express');
const { param }  = require('express-validator');

const { checkValidityFields, validateJWT }    = require('../middlewares');
const { employeePostRules, employeePutRules } = require('../rules/EmployeeRules');

const { 
  getEmployees, 
  createEmployee, 
  updateEmployee, 
  deleteEmployee,
} = require('../controllers/Employee/EmployeeController');
const { getEmployeeUsers } = require('../controllers/Employee/EmployeeUserController');

const router = Router();

router.get('/', [
  validateJWT
], getEmployees);

router.get('/:id/users', [
  validateJWT
], getEmployeeUsers);

router.post('/', [
  validateJWT,
  ...employeePostRules,
  checkValidityFields
], createEmployee);

router.put('/:id', [
  validateJWT,
  ...employeePutRules,
  checkValidityFields
], updateEmployee);

router.delete('/:id', [
  validateJWT,
  param('id', 'El empleado no existe').isNumeric(),
  checkValidityFields
], deleteEmployee);

module.exports = router;