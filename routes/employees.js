const { Router } = require('express');
const { param }  = require('express-validator');

const { checkValidityFields, validateJWT }    = require('../middlewares');
const { employeePostRules, employeePutRules } = require('../rules/employee-rules');

const { 
  getEmployees, 
  createEmployee, 
  updateEmployee, 
  deleteEmployee
} = require('../controllers/employees');

const router = Router();

router.get('/', [
  validateJWT
], getEmployees);

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