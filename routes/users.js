const { Router } = require('express');
const { param }  = require('express-validator');

const { checkValidityFields, validateJWT } = require('../middlewares');
const { 
  userPostRules, 
  userPutRules, 
  userPasswordRules, 
  userAddRemoveProfileRules, 
} = require('../rules/user-rules');

const { 
  getUsers, 
  createUser, 
  updateUser, 
  updateUserPassword, 
  deleteUser,
  userAddProfile,
  userRemoveProfile,
} = require('../controllers/users');

const router = Router();

router.get('/', [
  validateJWT
], getUsers);

router.post('/',[
  validateJWT,
  ...userPostRules,
  checkValidityFields
], createUser);

router.put('/:id', [
  validateJWT,
  ...userPutRules,
  checkValidityFields
], updateUser);

router.put('/:id/change-password', [
  validateJWT,
  ...userPasswordRules,
  checkValidityFields
], updateUserPassword);

router.put('/:id/add-profile', [
  validateJWT,
  ...userAddRemoveProfileRules,
  checkValidityFields
], userAddProfile);

router.put('/:id/remove-profile', [
  validateJWT,
  ...userAddRemoveProfileRules,
  checkValidityFields
], userRemoveProfile);

router.delete('/:id', [
  validateJWT,
  param('id', 'El usuario no existe').isNumeric(),
  checkValidityFields
], deleteUser);

module.exports = router;