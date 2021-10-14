const { request, response } = require('express');

const hieleraApi = require('../helpers/hielera-api');
const { formatSequelizeError } = require('../helpers/format-sequelize-error');
const Sale = require('../models/sale');
// const { sequelize } = require('../models/Sale');
const { Op, Sequelize } = require('sequelize');
const { WaterCommissionConfig } = require('../models');

const getSales = async ( req = request, res = response ) => {
  try {
    const { initDate, finalDate } = req.query;

    const resp = await hieleraApi.get(`/sales/?initDate=${ initDate }&finalDate=${ finalDate }`);
    
    if( !resp.data.ok ) {
      return res.status(400).json({
        ok: false,
        msg: resp.data.msg,
        errors: {}
      });
    }
    
    res.json({
      ok: true,
      sales: resp.data.sales.slice(0, 100)
    });
  } catch ( err ) {
    res.status(400).json({
      ok: false,
      msg: 'An error has ocurred',
      errors: formatSequelizeError( err )
    });
  }
}

const getCommissions = async ( req = request, res = response ) => {
  try {
    const { initDate, finalDate } = req.query;

    const resp = await hieleraApi.get(`/sales/?initDate=${ initDate }&finalDate=${ finalDate }`);

    if( !resp.data.ok ) {
      return res.status(400).json({
        ok: false,
        msg: resp.data.msg,
        errors: {}
      });
    }

    Sale.destroy({
      where: {},
      truncate: true,
    });

    await Sale.bulkCreate( resp.data.sales );

    getWaterCommission();

    res.json({
      ok: true,
      // commissions,
    });
  } catch ( err ) {
    res.status(400).json({
      ok: false,
      msg: 'An error has ocurred',
      errors: formatSequelizeError( err )
    });
  }
}

const getWaterCommission = async () => {
  try {

    // const configCommissions = await WaterCommissionConfig.

    const sales = await Sale.findAll({
      where: [
        { type_product: { [ Op.eq ] : 'AGUA EMBOTELLADA' } },
      ],
    });
    
    const commissions = sales.map( sale => {
      let commissionOperator  = 0;
      let commissionAssistant = 0;
  
      if( sale.assistant ) {
        commissionOperator  = sale.final_price * 0.03;
        commissionAssistant = sale.final_price * 0.02;
      } else {
        commissionOperator  = sale.final_price * 0.05;
      }
  
      const object = {
        operator: sale.operator,
        assistant: sale.assistant,
        
        commissionOperator,
        commissionAssistant
      };
  
      return object;
    });
  
    let nuevo = {};
  
    for (const key in nuevo) {
      if (Object.hasOwnProperty.call(nuevo, key)) {
        const element = nuevo[key];
        
      }
    }
  
    commissions.forEach( commission => {
      if( nuevo.hasOwnProperty( commission.operator ) ) {
        /** Exist: increment */
        nuevo[ commission.operator ] = nuevo[ commission.operator ] + commission.commissionOperator;
      } else {
        /** No exist: create and set value */
        nuevo[ commission.operator ] = commission.commissionOperator;
      }
  
      if( nuevo.hasOwnProperty( commission.assistant ) ) {
        /** Exist: increment */
        nuevo[ commission.assistant ] = nuevo[ commission.assistant ] + commission.commissionAssistant;
      } else {
        /** No exist: create and set value */
        nuevo[ commission.assistant ] = commission.commissionAssistant;
      }
    });
    
  } catch ( err ) {
    return [];
  }
}

const getWaterCommissionConfig = async () => {
  try {
    
  } catch ( err ) {
    
  }
}

module.exports = {
  getSales,
  getCommissions,
};