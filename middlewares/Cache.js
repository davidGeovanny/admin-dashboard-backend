const { request, response } = require('express');
const mcache = require('memory-cache');

/**
 * @param { number } duration in seconds
 */
const cache = ( duration = 6000 ) => {
  return ( req = request, res = response, next ) => {
    const key = `__express__${ req.originalUrl || req.url }`;
    const cacheBody = mcache.get( key );

    if( cacheBody ) {
      return res.json( cacheBody );
    } else {
      res.sendResponse = res.json;
      res.json = ( body ) => {
        mcache.put( key, body, duration * 1000 );
        res.sendResponse( body );
      }

      next();
    }
  };
}

module.exports = {
  cache,
};