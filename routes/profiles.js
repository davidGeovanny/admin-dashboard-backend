const { Router } = require('express');
const { check } = require('express-validator');
const { createProfile, getProfiles, getSpecificProfile } = require('../controllers/profiles');
const { checkValidityFields } = require('../middlewares/check-validity-fields');
const { checkProfileAvailable } = require('../middlewares/validate-fields');

const router = Router();

router.get('/', getProfiles);

router.get('/:id', getSpecificProfile);

router.post('/', [
  check('profile', 'Need to provide a name for the profile').notEmpty(),
  check('profile').custom( checkProfileAvailable ),
  checkValidityFields
], createProfile);

module.exports = router;