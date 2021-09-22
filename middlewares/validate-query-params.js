const { request, response } = require('express');

const validateQueryParams = async ( req = request, res = response, next ) => {
  const queryParams = req.query;

  if( !queryParams ) { next(); }
  
  const baseUrl = req.baseUrl.split('/');
  const endpoint = baseUrl[ baseUrl.length - 1 ];

  for (const key in queryParams) {
    if (Object.hasOwnProperty.call(queryParams, key)) {
      const element = queryParams[key];
      console.log( element );
      if( element ) {
        console.log('tiene algo')
      } else {
        console.log('no tiene')
      }
    }
  }

  console.log('sale')

  next();
}

module.exports = {
  validateQueryParams,
};