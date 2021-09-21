const { Router } = require('express');
const { check } = require('express-validator');

const { 
  checkValidityFields,
  checkPasswordsMatch,
  checkEmployeeExists,
  checkUserAvailable,
} = require('../middlewares');

const { getUsers, createUser } = require('../controllers/users');

const router = Router();

router.get('/', getUsers);
router.post('/',[
  check('username', 'Need to provide an username').notEmpty(),
  check('username').custom( checkUserAvailable ),
  check('password').notEmpty(),
  check('password_confirmation').custom( checkPasswordsMatch ),
  check('id_employee').custom( checkEmployeeExists ),
  checkValidityFields
], createUser);

module.exports = router;