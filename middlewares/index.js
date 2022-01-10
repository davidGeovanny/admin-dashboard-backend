const validateFields      = require('./ValidateFields');
const checkValidityFields = require('./CheckValidityFields');
const validateJWT         = require('./ValidateJWT');
const cache               = require('./Cache_t');

module.exports = {
  ...validateFields,
  ...checkValidityFields,
  ...validateJWT,
  ...cache,
};