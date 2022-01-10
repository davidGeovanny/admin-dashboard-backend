const validateFields      = require('./ValidateFields');
const checkValidityFields = require('./CheckValidityFields');
const validateJWT         = require('./ValidateJWT');
const cache               = require('./Cache');

module.exports = {
  ...validateFields,
  ...checkValidityFields,
  ...validateJWT,
  ...cache,
};