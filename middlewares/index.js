const validateFields = require('./validate-fields');
const checkValidityFields = require('./check-validity-fields');
const validateJWT = require('./validate-jwt');
const validateQueryParams = require('./validate-query-params');

module.exports = {
  ...validateFields,
  ...checkValidityFields,
  ...validateJWT,
  ...validateQueryParams,
};