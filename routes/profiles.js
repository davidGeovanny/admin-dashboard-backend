const { Router } = require('express');
const { param }  = require('express-validator');

const { checkValidityFields, validateJWT }  = require('../middlewares');
const { profilePutRules, profilePostRules } = require('../rules/profile-rules');

const { 
  createProfile, 
  getProfiles, 
  updateProfile, 
  deleteProfile 
} = require('../controllers/profiles');

const router = Router();

router.get('/', [
  validateJWT
], getProfiles);

router.post('/', [
  validateJWT,
  ...profilePostRules,
  checkValidityFields
], createProfile);

router.put('/:id', [
  validateJWT,
  ...profilePutRules,
  checkValidityFields
], updateProfile);

router.delete('/:id', [
  validateJWT,
  param('id', 'The profile does not exist').isNumeric(),
  checkValidityFields
], deleteProfile);

module.exports = router;