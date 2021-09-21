const { Router } = require('express');
const { check } = require('express-validator');

const { checkValidityFields, checkProfileAvailable } = require('../middlewares');

const { createProfile, getProfiles, getSpecificProfile } = require('../controllers/profiles');

const router = Router();

router.get('/', getProfiles);

router.get('/:id', getSpecificProfile);

router.post('/', [
  check('profile', 'Need to provide a name for the profile').notEmpty(),
  check('profile').custom( checkProfileAvailable ),
  checkValidityFields
], createProfile);

module.exports = router;