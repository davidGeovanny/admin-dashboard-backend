const fs = require('fs');

const deleteFile = ( fileName = '' ) => {
  try {
    console.log({ fileName })
    fs.unlinkSync( `tmp/${ fileName }` );

    return true;
  } catch ( err ) {
    return false;
  }
}

module.exports = {
  deleteFile,
};