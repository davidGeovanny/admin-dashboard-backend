const validateFields = require('./validate-fields');
const checkValidityFields = require('./check-validity-fields');
const validateJWT = require('./validate-jwt');

module.exports = {
  ...validateFields,
  ...checkValidityFields,
  ...validateJWT,
};