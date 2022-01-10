const { Router } = require('express');
const { param }  = require('express-validator');

const { checkValidityFields, validateJWT }  = require('../middlewares');
const { profilePutRules, profilePostRules } = require('../rules/ProfileRules');

const { 
  createProfile, 
  getProfiles, 
  updateProfile, 
  deleteProfile, 
  getSpecificProfile
} = require('../controllers/Profile/ProfileController');

const router = Router();

router.get('/', [
  validateJWT
], getProfiles);

router.get('/:id', [
  validateJWT
], getSpecificProfile);

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
  param('id', 'La configuración no existe').isNumeric(),
  checkValidityFields
], deleteProfile);

module.exports = router;