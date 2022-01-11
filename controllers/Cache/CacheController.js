const { response, request } = require('express');
const { CLEAR_CACHE }       = require('../../helpers/Cache');

const clearCache = async ( req = request, res = response ) => {
  try {
    const { key } = req.query;

    CLEAR_CACHE( key );

    return res.json({
      ok:   true,
      msg: 'Cache deleted',
    });
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'An error has ocurred',
      errors: formatSequelizeError( err )
    });
  }
}

module.exports = {
  clearCache,
};