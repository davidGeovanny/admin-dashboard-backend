const mcache = require('memory-cache');

const CACHE_TIME_DEFAULT = 300000;

/**
 * Gets the cache value.
 * @param   { string } key         Cache identified name.
 * @returns { string | undefined } Data in JSON.stringify format.
 */
const GET_CACHE = ( key ) => {
  try {
    const data = mcache.get( `__admin-backend__${ key }` );

    return data;
  } catch ( err ) {
    console.log( err );
    return undefined;
  }
}

/**
 * Gets the cache value.
 * @param   { string } data Data to cache in JSON.stringify format.
 * @param   { string } key  Cache identified name.
 * @param   { number } time How long the information is cached ( ms ).
 * @returns { boolean }     Returns if the data was saved or not.
 */
const SET_CACHE = ( key, data, time = CACHE_TIME_DEFAULT ) => {
  try {
    mcache.put( `__admin-backend__${ key }`, data, time );

    return true;
  } catch ( err ) {
    console.log( err );
    return false;
  }
}

/**
 * Delete a cached item or all cached items.
 * @param { string | undefined } key Cache identified name.
 */
const CLEAR_CACHE = ( key ) => {
  try {
    if( key ) {
      mcache.del( `__admin-backend__${ key }` );
    } else {
      mcache.clear();
    }
  } catch ( err ) {
    console.log( err );
  }
}

module.exports = {
  GET_CACHE,
  SET_CACHE,
  CLEAR_CACHE,
};