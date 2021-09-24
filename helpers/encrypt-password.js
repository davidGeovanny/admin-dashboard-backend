const bcrypt = require('bcryptjs');

const encryptPassword = ( password = '' ) => {
  try {
    const salt     = bcrypt.genSaltSync();
    const passHash = bcrypt.hashSync( password, salt );
    
    return passHash;
  } catch ( err ) {
    return '';
  }
}

module.exports = {
  encryptPassword,
};