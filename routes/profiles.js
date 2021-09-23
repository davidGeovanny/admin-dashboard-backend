const { Router } = require('express');
const { check, param  } = require('express-validator');

const { checkValidityFields, validateJWT } = require('../middlewares');

const { createProfile, getProfiles, updateProfile, deleteProfile } = require('../controllers/profiles');
const { profilePutRules, profilePostRules } = require('../rules/profile-rules');

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