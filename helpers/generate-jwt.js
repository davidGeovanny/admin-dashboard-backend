const jwt = require('jsonwebtoken');

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