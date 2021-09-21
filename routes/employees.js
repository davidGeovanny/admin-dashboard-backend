const { Router } = require('express');
const { check } = require('express-validator');

const { checkValidityFields, checkEmailAvailable } = require('../middlewares');

const { getEmployees, createEmployee } = require('../controllers/employees');
const { userGenders } = require('../data/static-data');

const router = Router();

router.get('/', getEmployees);

router.post('/', [
  check('name', 'Need to provide your name').notEmpty(),
  check('first_lastname', 'Need to provide your first_lastname').notEmpty(),
  check('second_lastname', 'Need to provide your second_lastname').notEmpty(),
  check('gender', 'Gender not valid. Available values: ' + userGenders.join(', ')).isIn( userGenders ),
  check('email', 'Need to provide an email').notEmpty(),
  check('email', 'Email provided is not valid').isEmail(),
  check('email').custom( checkEmailAvailable ),
  checkValidityFields
], createEmployee);

module.exports = router;