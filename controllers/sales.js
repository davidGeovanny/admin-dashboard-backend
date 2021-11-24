/**
 * @typedef { import('../utils/types/sales-type').RespSalesType } RespSalesType
 * @typedef { import('../utils/interfaces/sales-interface').Sale } Sale
 * @typedef { import('../utils/interfaces/sales-interface').TopSale } TopSale
 * @typedef { import('../utils/interfaces/sales-interface').RespTopSale } RespTopSale
 */
const { request, response } = require('express');
const _ = require('underscore');

const hieleraApi = require('../helpers/hielera-api');
const { formatSequelizeError } = require('../helpers/format-sequelize-error');

const getSales = async ( req = request, res = response ) => {
  try {
    const { initDate, finalDate } = req.query;

    /** @type { RespSalesType } */
    const resp = await hieleraApi.get(`/sales/?initDate=${ initDate }&finalDate=${ finalDate }`);
    
    if( !resp.data.ok ) {
      return res.status(400).json({
        ok: false,
        msg: resp.data.msg,
        errors: {}
      });
    }

    // await Sale.destroy({
    //   where: {},
    //   truncate: true,
    // });
    // await Sale.bulkCreate( resp.data.sales );
    
    return res.json({
      ok:    true,
      sales: resp.data.sales.slice(0, 100)
    });
  } catch ( err ) {
    return res.status(400).json({
      ok: false,
      msg: 'An error has ocurred',
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
 * @returns { RespTopSale] }
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

    console.log({array: _.sortBy( array, 'money' ).reverse()})

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
    let { initDate, finalDate, limit = 5 } = req.query;
    
    if( limit < 1 )  limit = 1;
    if( limit > 10 ) limit = 10;
    
    /** @type { RespSalesType } */
    const resp = await hieleraApi.get(`/sales/?initDate=${ initDate }&finalDate=${ finalDate }`);
    
    if( !resp.data.ok ) {
      return res.status(400).json({
        ok:     false,
        msg:    resp.data.msg,
        errors: {}
      });
    }

    const topData = getTopFromSales( resp.data.sales, 'client', false );

    return res.json({
      ok:           true,
      by_frequency: topData.data.by_frequency.slice(0, limit),
      by_money:     topData.data.by_money.slice(0, limit),
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

const getTopProducts = async ( req = request, res = response ) => {
  try {
    let { initDate, finalDate } = req.query;
    
    /** @type { RespSalesType } */
    const resp = await hieleraApi.get(`/sales/?initDate=${ initDate }&finalDate=${ finalDate }`);

    if( !resp.data.ok ) {
      return res.status(400).json({
        ok:     false,
        msg:    resp.data.msg,
        errors: {}
      });
    }

    const topData = getTopFromSales( resp.data.sales, 'product', true );

    return res.json({
      ok:           true,
      by_frequency: topData.data.by_frequency,
      by_money:     topData.data.by_money,
    });
  } catch ( err ) {
    console.log( err );
    return res.status(400).json({
      ok: false,
      msg: 'An error has ocurred',
      errors: formatSequelizeError( err )
    });
  }
}

const getTopTypeProducts = async ( req = request, res = response ) => {
  try {
    let { initDate, finalDate } = req.query;
    
    /** @type { RespSalesType } */
    const resp = await hieleraApi.get(`/sales/?initDate=${ initDate }&finalDate=${ finalDate }`);

    if( !resp.data.ok ) {
      return res.status(400).json({
        ok:     false,
        msg:    resp.data.msg,
        errors: {}
      });
    }

    const topData = getTopFromSales( resp.data.sales, 'type_product', true );

    return res.json({
      ok:           true,
      by_frequency: topData.data.by_frequency,
      by_money:     topData.data.by_money,
    });
  } catch ( err ) {
    console.log( err );
    return res.status(400).json({
      ok: false,
      msg: 'An error has ocurred',
      errors: formatSequelizeError( err )
    });
  }
}

const getTopBranches = async ( req = request, res = response ) => {
  try {
    let { initDate, finalDate } = req.query;
    
    /** @type { RespSalesType } */
    const resp = await hieleraApi.get(`/sales/?initDate=${ initDate }&finalDate=${ finalDate }`);
    
    if( !resp.data.ok ) {
      return res.status(400).json({
        ok:     false,
        msg:    resp.data.msg,
        errors: {}
      });
    }

    const topData = getTopFromSales( resp.data.sales, 'branch_company', false );

    return res.json({
      ok:           true,
      by_frequency: topData.data.by_frequency,
      by_money:     topData.data.by_money,
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

module.exports = {
  getSales,
  getTopClients,
  getTopProducts,
  getTopTypeProducts,
  getTopBranches
};