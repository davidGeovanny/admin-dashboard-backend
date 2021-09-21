const { response } = require('express');
const { validationResult } = require('express-validator');

const checkValidityFields = ( req, res = response, next ) => {
  const errors = validationResult( req );

  if( !errors.isEmpty() ) {
    return res.status(400).json({
      ok: false,
      msg: 'An error has ocurred',
      errors: {
        name: 'ValidationFieldError',
        errors
      }
    });
  }

  next();
}

module.exports = {
  checkValidityFields,
};