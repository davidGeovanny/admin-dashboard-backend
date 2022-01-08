const jwt = require('jsonwebtoken');

/**
 * Generate JSON Web Token
 * @param  { string } id    User ID to save
 * @return { Promise<string> }
 */
const generateJWT = ( id = '' ) => {
  return new Promise( ( resolve, reject ) => {
    const payload = { id };

    jwt.sign( payload, process.env.SECRETORPRIVATEKEY, {
      expiresIn: '7d',
    }, ( err, token ) => {
      if( err ) {
        reject('An error was ocurred while token whas generating');
      } else {
        resolve( token );
      }
    });
  });
}

module.exports = {
  generateJWT,
};