const validateFields = require('./validate-fields');
const checkValidityFields = require('./check-validity-fields');

module.exports = {
  ...validateFields,
  ...checkValidityFields,
};