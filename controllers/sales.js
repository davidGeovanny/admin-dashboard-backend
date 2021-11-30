/**
 * @typedef { import('../utils/types/sales-type').RespSalesType } RespSalesType
 * @typedef { import('../utils/interfaces/sales-interface').Sale } Sale
 * @typedef { import('../utils/interfaces/sales-interface').TopSale } TopSale
 * @typedef { import('../utils/interfaces/sales-interface').RespTopSale } RespTopSale
 */
const { request, response } = require('express');
const _ = require('underscore');

const { attrSales } = require('../data/attr-sales');
const { formatSequelizeError } = require('../helpers/format-sequelize-error');
const { pagination }           = require('../helpers/pagination');
const { GET_CACHE, SET_CACHE } = require('../helpers/cache');
const hieleraApi = require('../helpers/hielera-api');

const getSales = async ( req = request, res = response ) => {
  try {
    const { list } = attrSales;
    const queries = req.query;
    const { initDate, finalDate } = queries;
    const key = `__sales__between__${ initDate }_${ finalDate }`;
    
    let resp = JSON.parse( GET_CACHE( key ) );

    if( !resp ) {
      resp = await hieleraApi.get(`/sales/?initDate=${ initDate }&finalDate=${ finalDate }`);
      
      if( !resp.data.ok ) {
        return res.status(400).json({
          ok:     false,
          msg:    resp.data.msg,
          errors: {}
        });
      }

      SET_CACHE( key, JSON.stringify( resp.data.sales ), 60000 );
      rows = resp.data.sales;
    }

    const paginated = pagination( rows, queries, list );
  
    return res.json({
      ok: true,
      ...paginated
    });
  } catch ( err ) {
    console.log( err )
    return res.status(400).json({
      ok:     false,
      msg:    'An error has ocurred',
      errors: formatSequelizeError( err )
    });
  }
}

/**
 * Get the top of a specific item in sales.
 * @param   { Sale[] }           sales        Array of sales.
 * @param   { keyof Sale }       key          Top sales element.
 * @param   { boolean }          fromQuantity Indicates if the frequency comes from the amount consumed.
 * @param   { ( keyof Sale )[] } extraKeys    Array of extra attributes to show in the object.
 * @returns { RespTopSale }
 */
const getTopFromSales = ( sales, key, fromQuantity, extraKeys = [] ) => {
  try {
    /** @type { Map<string, TopSale }> } */
    const map = new Map();

    sales.forEach( sale => {
      if( map.has( sale[ key ] ) ) {
        const element = map.get( sale[ key ] );
        const { frequency, money } = element;

        map.set( sale[ key ], {
          ...element,
          frequency: frequency + ( ( fromQuantity ) ? sale.quantity : 1 ),
          money:     money + sale.final_price,
        });
      } else {
        /** @type { TopSale } */
        const data = {
          frequency: ( fromQuantity ) ? sale.quantity : 1,
          money:     sale.final_price,
          ...extraKeys.map( k => ({
            [ k ] : sale[ k ]
          }))
        };

        map.set( sale[ key ], data );
      }
    });
    
    const array = Array.from( map, ([ k, value ]) => ({
      ...value,
      [ key ]:   k,
      frequency: parseFloat( value.frequency.toFixed( 3 ) ),
      money:     parseFloat( value.money.toFixed( 3 ) ),
    }));

    return {
      ok:   true,
      data: {
        by_frequency: _.sortBy( array, 'frequency' ).reverse(),
        by_money    : _.sortBy( array, 'money' ).reverse(),
      },
      err:  null,
    }
  } catch ( err ) {
    console.log( err );
    return {
      ok:   false,
      data: { by_frequency: [], by_money: [], },
      err,
    };
  }
}

const getTopClients = async ( req = request, res = response ) => {
  try {
    const queries = req.query;
    let { initDate, finalDate, limit = 5 } = queries;
    const key = `__sales__between__${ initDate }_${ finalDate }`;

    limit = parseInt( limit );

    if( limit < 1 )  limit = 1;
    if( limit > 10 ) limit = 10;

    req.query.page  = 1;
    
    let resp = JSON.parse( GET_CACHE( key ) );

    if( !resp ) {
      resp = await hieleraApi.get(`/sales/?initDate=${ initDate }&finalDate=${ finalDate }`);
      
      if( !resp.data.ok ) {
        return res.status(400).json({
          ok:     false,
          msg:    resp.data.msg,
          errors: {}
        });
      }

      SET_CACHE( key, JSON.stringify( resp.data.sales ), 60000 );
      rows = resp.data.sales;
    }

    const topData = getTopFromSales( rows, 'client', false );
  
    return res.json({
      ok:           true,
      by_frequency: topData.data.by_frequency.slice(0, limit),
      by_money:     topData.data.by_money.slice(0, limit),
    });
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'An error has ocurred',
      errors: formatSequelizeError( err )
    });
  }
}

const getTopProducts = async ( req = request, res = response ) => {
  try {
    const queries = req.query;
    let { initDate, finalDate, limit = 5 } = queries;
    const key = `__sales__between__${ initDate }_${ finalDate }`;

    limit = parseInt( limit );

    if( limit < 1 )  limit = 1;
    if( limit > 10 ) limit = 10;

    req.query.page  = 1;
    
    let resp = JSON.parse( GET_CACHE( key ) );

    if( !resp ) {
      resp = await hieleraApi.get(`/sales/?initDate=${ initDate }&finalDate=${ finalDate }`);
      
      if( !resp.data.ok ) {
        return res.status(400).json({
          ok:     false,
          msg:    resp.data.msg,
          errors: {}
        });
      }

      SET_CACHE( key, JSON.stringify( resp.data.sales ), 60000 );
      rows = resp.data.sales;
    }

    const topData = getTopFromSales( rows, 'product', true );
  
    return res.json({
      ok:           true,
      by_frequency: topData.data.by_frequency.slice(0, limit),
      by_money:     topData.data.by_money.slice(0, limit),
    });
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'An error has ocurred',
      errors: formatSequelizeError( err )
    });
  }
}

const getTopTypeProducts = async ( req = request, res = response ) => {
  try {
    const queries = req.query;
    let { initDate, finalDate, limit = 5 } = queries;
    const key = `__sales__between__${ initDate }_${ finalDate }`;

    limit = parseInt( limit );

    if( limit < 1 )  limit = 1;
    if( limit > 10 ) limit = 10;

    req.query.page  = 1;
    
    let resp = JSON.parse( GET_CACHE( key ) );

    if( !resp ) {
      resp = await hieleraApi.get(`/sales/?initDate=${ initDate }&finalDate=${ finalDate }`);
      
      if( !resp.data.ok ) {
        return res.status(400).json({
          ok:     false,
          msg:    resp.data.msg,
          errors: {}
        });
      }

      SET_CACHE( key, JSON.stringify( resp.data.sales ), 60000 );
      rows = resp.data.sales;
    }

    const topData = getTopFromSales( rows, 'type_product', true );
  
    return res.json({
      ok:           true,
      by_frequency: topData.data.by_frequency.slice(0, limit),
      by_money:     topData.data.by_money.slice(0, limit),
    });
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'An error has ocurred',
      errors: formatSequelizeError( err )
    });
  }
}

const getTopBranches = async ( req = request, res = response ) => {
  try {
    const queries = req.query;
    let { initDate, finalDate, limit = 5 } = queries;
    const key = `__sales__between__${ initDate }_${ finalDate }`;

    limit = parseInt( limit );

    if( limit < 1 )  limit = 1;
    if( limit > 10 ) limit = 10;

    req.query.page  = 1;
    
    let resp = JSON.parse( GET_CACHE( key ) );

    if( !resp ) {
      resp = await hieleraApi.get(`/sales/?initDate=${ initDate }&finalDate=${ finalDate }`);
      
      if( !resp.data.ok ) {
        return res.status(400).json({
          ok:     false,
          msg:    resp.data.msg,
          errors: {}
        });
      }

      SET_CACHE( key, JSON.stringify( resp.data.sales ), 60000 );
      rows = resp.data.sales;
    }

    const topData = getTopFromSales( rows, 'branch_company', true );
  
    return res.json({
      ok:           true,
      by_frequency: topData.data.by_frequency.slice(0, limit),
      by_money:     topData.data.by_money.slice(0, limit),
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
  getSales,
  getTopClients,
  getTopProducts,
  getTopTypeProducts,
  getTopBranches
};