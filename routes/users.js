const { Router } = require('express');
const { param } = require('express-validator');

const { checkValidityFields, validateJWT } = require('../middlewares');
const { 
  userPostRules, 
  userPutRules, 
  userPasswordRules, 
  userAddProfileRules 
} = require('../rules/user-rules');

const { 
  getUsers, 
  createUser, 
  updateUser, 
  updateUserPassword, 
  deleteUser,
  userAddProfile
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
// TODO:
router.put('/:id/add-profile', [
  validateJWT,
  ...userAddProfileRules,
  checkValidityFields
], userAddProfile);

router.delete('/:id', [
  validateJWT,
  param('id', 'The user does not exist').isNumeric(),
  checkValidityFields
], deleteUser);

module.exports = router;