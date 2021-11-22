/**
 * @typedef { import('../utils/interfaces/sales-interface').RespSalesType } RespSalesType
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

const getSalesPerProduct = async ( req = request, res = response ) => {
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

    /** @type { Map<string, { frequency: number, money: number }> } */
    const productsMap = new Map();
    
    resp.data.sales.forEach( sale => {
      if( productsMap.has( sale.product ) ) {
        const { frequency, money } = productsMap.get( sale.product );
        productsMap.set( sale.product, { frequency: frequency + sale.quantity, money: money + sale.final_price } );
      } else {
        productsMap.set( sale.product, { frequency: sale.quantity, money: sale.final_price } );
      }
    });

    const productsArray = Array.from( productsMap, ( [ key, value ] ) => ({ 
      ...value, 
      product: key, 
      money:   parseFloat( value.money.toFixed( 2 ) ) 
    }));

    return res.json({
      ok:           true,
      by_frequency: _.sortBy( productsArray, 'frequency' ).reverse(),
      by_money:     _.sortBy( productsArray, 'money' ).reverse(),
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

    /** @type { Map<string, { frequency: number, money: number }> } */
    const clientsMap = new Map();
    
    resp.data.sales.forEach( sale => {
      if( clientsMap.has( sale.client ) ) {
        const { frequency, money } = clientsMap.get( sale.client );
        clientsMap.set( sale.client, { frequency: frequency + 1, money: money + sale.final_price } );
      } else {
        clientsMap.set( sale.client, { frequency: 1, money: sale.final_price } );
      }
    });

    const clientsArray = Array.from( clientsMap, ( [ key, value ] ) => ({ 
      ...value, 
      client: key, 
      money:  parseFloat( value.money.toFixed( 2 ) ) 
    }));

    return res.json({
      ok:           true,
      by_frequency: _.sortBy( clientsArray, 'frequency' ).reverse().slice(0, limit),
      by_money:     _.sortBy( clientsArray, 'money' ).reverse().slice(0, limit),
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

    /** @type { Map<string, { frequency: number, money: number }> } */
    const productsMap = new Map();

    resp.data.sales.forEach( sale => {
      if( productsMap.has( sale.product ) ) {
        const { frequency, money } = productsMap.get( sale.product );
        productsMap.set( sale.product, { frequency: frequency + sale.quantity, money: money + sale.final_price } );
      } else {
        productsMap.set( sale.product, { frequency: sale.quantity, money: sale.final_price } );
      }
    });

    const productsFrequencyArray = Array.from( productsMap, ( [ key, value ] ) => ({ 
      ...value,
      product:   key, 
      frequency: parseFloat( value.frequency.toFixed( 2 ) ) ,
      money:     parseFloat( value.money.toFixed( 2 ) ) ,
    }));
    
    return res.json({
      ok:           true,
      by_frequency: _.sortBy( productsFrequencyArray, 'frequency' ).reverse(),
      by_money:     _.sortBy( productsFrequencyArray, 'money' ).reverse(),
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

    /** @type { Map<string, { frequency: number, money: number }> } */
    const productsHigherMoneyMap = new Map();

    resp.data.sales.forEach( sale => {
      if( productsHigherMoneyMap.has( sale.type_product ) ) {
        const { frequency, money } = productsHigherMoneyMap.get( sale.type_product );
        productsHigherMoneyMap.set( sale.type_product, { frequency: frequency + sale.quantity, money: money + sale.final_price } );
      } else {
        productsHigherMoneyMap.set( sale.type_product, { frequency: sale.quantity, money: sale.final_price } );
      }
    });

    const productsHigherMoneyArray = Array.from( productsHigherMoneyMap, ( [ key, value ] ) => ({ 
      ...value,
      type_product: key,
      frequency:    parseFloat( value.frequency.toFixed( 2 ) ),
      money:        parseFloat( value.money.toFixed( 2 ) ),
    }));

    return res.json({
      ok:           true,
      by_frequency: _.sortBy( productsHigherMoneyArray, 'frequency' ).reverse(),
      by_money:     _.sortBy( productsHigherMoneyArray, 'money' ).reverse(),
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

module.exports = {
  getSales,
  getTopClients,
  getTopProducts,
  getTopTypeProducts,
  getSalesPerProduct,
};