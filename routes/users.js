const { Router } = require('express');
const { check } = require('express-validator');
const { checkValidityFields } = require('../middlewares/check-validity-fields');
const { checkPasswordsMatch, checkEmployeeExists, checkUserAvailable } = require('../middlewares/validate-fields');
const { getUsers, createUser } = require('../controllers/users');

const router = Router();

router.get('/', getUsers);
router.post('/',[
  check('username', 'Need to provide an username').notEmpty(),
  // check('username').custom( checkUserAvailable ),
  check('password').notEmpty(),
  check('password_confirmation').custom( checkPasswordsMatch ),
  check('id_employee').custom( checkEmployeeExists ),
  checkValidityFields
], createUser);

module.exports = router;