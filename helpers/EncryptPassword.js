const bcrypt = require('bcryptjs');

/**
 * Encrypt the password.
 * @param { string } password Password to encrypt.
 * @returns Returns the password encrypted.
 */
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