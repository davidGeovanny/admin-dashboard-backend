const { Router } = require('express');
const { param }  = require('express-validator');

const { checkValidityFields, validateJWT } = require('../middlewares');
const { 
  userPostRules, 
  userPutRules, 
  userPasswordRules, 
  userAddRemoveProfileRules, 
} = require('../rules/UserRules');

const { 
  getUsers, 
  createUser, 
  updateUser, 
  updateUserPassword, 
  deleteUser,
} = require('../controllers/User/UserController');
const { 
  userAddProfile, 
  userRemoveProfile, 
  getUserProfiles 
} = require('../controllers/User/UserProfileController');
const { getUserEmployee } = require('../controllers/User/UserEmployeeController');

const router = Router();

router.get('/', [
  validateJWT
], getUsers);

router.get('/:id/profiles', [
  validateJWT
], getUserProfiles);

router.get('/:id/employee', [
  validateJWT
], getUserEmployee);

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