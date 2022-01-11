const { Router } = require('express');
const { param }  = require('express-validator');

const { checkValidityFields } = require('../middlewares');
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

router.get('/', [], getUsers);

router.get('/:id/profiles', [], getUserProfiles);

router.get('/:id/employee', [], getUserEmployee);

router.post('/',[
  ...userPostRules,
  checkValidityFields
], createUser);

router.put('/:id', [
  ...userPutRules,
  checkValidityFields
], updateUser);

router.put('/:id/change-password', [
  ...userPasswordRules,
  checkValidityFields
], updateUserPassword);

router.put('/:id/add-profile', [
  ...userAddRemoveProfileRules,
  checkValidityFields
], userAddProfile);

router.put('/:id/remove-profile', [
  ...userAddRemoveProfileRules,
  checkValidityFields
], userRemoveProfile);

router.delete('/:id', [
  param('id', 'El usuario no existe').isNumeric(),
  checkValidityFields
], deleteUser);

module.exports = router;