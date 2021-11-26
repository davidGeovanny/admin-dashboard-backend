const _ = require('underscore');

const DEFAULT_LIMIT     = 20;
const DEFAULT_PAGE      = 1;
const DEFAULT_PAGINATED = 'true';
const DEFAULT_ORDER     = 'ASC';

const pagination = ( rows = [], queries, listAttr = [] ) => {
  let results = rows;
  let {
    limit     = DEFAULT_LIMIT,
    page      = DEFAULT_PAGE,
    paginated = DEFAULT_PAGINATED,
    order     = DEFAULT_ORDER,
    sort,
  } = queries;

  limit = parseInt( limit );
  page  = parseInt( page );
  
  if( limit < 0 ) limit = 1;
  if( page  < 0 ) page  = 1;

  for( const key in queries ) {
    const query = queries[ key ];
    const attr  = listAttr.find( item => item.attr.toLowerCase() === key.toLowerCase() );

    if( attr ) {
      switch ( attr.type ) {
        case 'string':
          results = results.filter( item => {
            if( item[ key ].toLowerCase().includes( query.toLowerCase() ) ) {
              return item;
            }
          });
          break;

        case 'number': 
          results = results.filter( item => {
            if( parseFloat( item[ key ] ) === parseFloat( query ) ) {
              return item;
            }
          });
          break;
      
        default:
          break;
      }
    }
  }

  if( paginated === 'false' ) {
    limit = results.length;
    page  = 1;
    skip  = ( limit * ( page - 1 ) );
  }

  const skip  = ( limit * ( page - 1 ) );
  const count = results.length;

  if( sort ) {
    const attr = listAttr.find( item => item.attr.toLowerCase() === sort.toLowerCase() );
    if( attr ) results = _.sortBy( results, sort );
  }

  if( order === 'DESC' ) results = results.reverse();

  results = results.slice( skip, ( skip + limit ) );

  return {
    data: results,
    page,
    count,
  };
}

module.exports = {
  pagination,
};