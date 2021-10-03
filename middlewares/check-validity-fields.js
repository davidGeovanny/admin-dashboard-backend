const { response } = require('express');
const { validationResult } = require('express-validator');

const checkValidityFields = ( req, res = response, next ) => {
  const errors = validationResult( req );

  if( !errors.isEmpty() ) {
    return res.status(400).json({
      ok: false,
      msg: 'An error has ocurred',
      errors: errors.errors.map( error => {
        return {
          attr  : error.param,
          value : error.value | '',
          msg   : error.msg
        };
      })
    });
  }

  next();
}

module.exports = {
  checkValidityFields,
};