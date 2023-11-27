const { 
  ValidationError,
  ForeignKeyConstraintError,
} = require('sequelize');

const formatSequelizeError = ( err ) => {
  let errors = [];

  if( !err ) return errors;

  if( err instanceof ValidationError ) {
    errors = err.errors.map( error => {
      return {
        attr : error.path,
        value: error.value,
        msg  : error.message,
      };
    });
  }

  if( err instanceof ForeignKeyConstraintError ) {
    errors = [{
      attr : err.fields.join(', '),
      value: err.value | '',
      msg  : err.parent.message.split('(')[0]
    }];
  }

  // if (errors.length === 0 && err?.message) {
  //   errors = [{
  //     attr : '',
  //     value: '',
  //     msg  : err.message
  //   }];
  // }

  return errors;
}

module.exports = {
  formatSequelizeError,
};