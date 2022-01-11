const { Router } = require('express');
const { param }  = require('express-validator');

const { checkValidityFields } = require('../middlewares');
const { employeePostRules, employeePutRules } = require('../rules/EmployeeRules');

const { 
  getEmployees, 
  createEmployee, 
  updateEmployee, 
  deleteEmployee,
} = require('../controllers/Employee/EmployeeController');
const { getEmployeeUsers } = require('../controllers/Employee/EmployeeUserController');

const router = Router();

router.get('/', [], getEmployees);

router.get('/:id/users', [], getEmployeeUsers);

router.post('/', [
  ...employeePostRules,
  checkValidityFields
], createEmployee);

router.put('/:id', [
  ...employeePutRules,
  checkValidityFields
], updateEmployee);

router.delete('/:id', [
  param('id', 'El empleado no existe').isNumeric(),
  checkValidityFields
], deleteEmployee);

module.exports = router;