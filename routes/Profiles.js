const { Router } = require('express');
const { param }  = require('express-validator');

const { checkValidityFields }  = require('../middlewares');
const { profilePutRules, profilePostRules } = require('../rules/ProfileRules');

const { 
  createProfile, 
  getProfiles, 
  updateProfile, 
  deleteProfile, 
} = require('../controllers/Profile/ProfileController');
const { getProfileUsers } = require('../controllers/Profile/ProfileUserController');

const router = Router();

router.get('/', [], getProfiles);

router.get('/:id/users', [], getProfileUsers);

router.post('/', [
  ...profilePostRules,
  checkValidityFields
], createProfile);

router.put('/:id', [
  ...profilePutRules,
  checkValidityFields
], updateProfile);

router.delete('/:id', [
  param('id', 'La configuración no existe').isNumeric(),
  checkValidityFields
], deleteProfile);

module.exports = router;