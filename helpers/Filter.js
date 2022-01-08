const filterResultQueries = ( rows = [], queries, listAttr = [] ) => {
  for( const key in queries ) {
    const query = queries[ key ];
    const attr  = listAttr.find( item => item.attr.toLowerCase() === key.toLowerCase() );

    if( attr ) {
      switch ( attr.type ) {
        case 'string':
          rows = rows.filter( item => {
            if( item[ key ].toLowerCase().includes( query.toLowerCase() ) ) {
              return item;
            }
          });
          break;

        case 'number': 
          rows = rows.filter( item => {
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

  return rows;
}

module.exports = {
  filterResultQueries,
};