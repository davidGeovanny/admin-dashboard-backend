const { request, response } = require('express');
const _ = require('underscore');

const CommissionWater   = require('../utils/commission-water');
const CommissionIcebar  = require('../utils/commission-icebar');
const CommissionIcecube = require('../utils/commission-icecube');

const hieleraApi = require('../helpers/hielera-api');
const { formatSequelizeError } = require('../helpers/format-sequelize-error');

const getCommissions = async ( req = request, res = response ) => {
  try {
    const { initDate, finalDate } = req.query;

    const resp = await hieleraApi.get(`/sales/?initDate=${ initDate }&finalDate=${ finalDate }&employees=1`);

    if( !resp.data.ok ) {
      return res.status(400).json({
        ok: false,
        msg: resp.data.msg,
        errors: {}
      });
    }

    const waterCommissions   = await getWaterCommission( resp.data.sales.filter( sale => sale.type_product.toLowerCase() === 'agua embotellada' && !sale.route_name.includes('PISO') ) );
    const icebarCommissions  = await getIcebarCommissions( resp.data.sales.filter( sale => sale.type_product.toLowerCase() === 'barra' && !sale.route_name.includes('PISO') ) );
    const icecubeCommissions = await getIcecubeCommissions( resp.data.sales.filter( sale => sale.type_product.toLowerCase() === 'cubo' && !sale.route_name.includes('PISO') ) );

    res.json({
      ok: true,
      water_commissions  : waterCommissions,
      icebar_commissions : icebarCommissions,
      icecube_commissions: icecubeCommissions,
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

const getWaterCommission = async ( sales = [] ) => {
  try {
    const commissionWater = new CommissionWater();
    await commissionWater.findCommissionConfig();
    
    sales.forEach( sale => {
      /** Operator */
      const position = ( sale.assistant || sale.helperr ) ? 'operator' : 'operator_assistant';
      commissionWater.addSale( sale.branch_company, sale.operator, sale.final_price, position );
      
      /** Assistant */
      if( sale.assistant ) {
        commissionWater.addSale( sale.branch_company, sale.assistant, sale.final_price, 'assistant' );
      }

      /** Helper */
      if( sale.helper ) {
        commissionWater.addSale( sale.branch_company, sale.helper, sale.final_price, 'assistant' );
      }
    });
    

    return _.sortBy( commissionWater.getCommissionsToArray(), 'commission' ).reverse();
  } catch ( err ) {
    return [];
  }
}

const getIcebarCommissions = async ( sales = [] ) => {
  try {
    const commissionIceBar = new CommissionIcebar();
    await commissionIceBar.findCommissionConfig();

    sales.forEach( sale => {
      /** Operator */
      const position = ( sale.assistant || sale.helper ) ? 'operator' : 'operator_assistant';
      commissionIceBar.addSale({
        branch  : sale.branch_company,
        name    : sale.operator,
        quantity: sale.quantity,
        price   : sale.final_price,
        position
      });
      
      /** Assistant */
      if( sale.assistant ) {
        commissionIceBar.addSale({
          branch  : sale.branch_company,
          name    : sale.assistant,
          quantity: sale.quantity,
          price   : sale.final_price,
          position: 'assistant'
        });
      }

      /** Helper */
      if( sale.helper ) {
        commissionIceBar.addSale({
          branch  : sale.branch_company,
          name    : sale.helper,
          quantity: sale.quantity,
          price   : sale.final_price,
          position: 'assistant'
        });
      }
    });

    commissionIceBar.calculateCommissions();
    
    return _.sortBy( commissionIceBar.getCommissionsToArray(), 'commission' ).reverse();
  } catch ( err ) {
    return [];
  }
}

const getIcecubeCommissions = async ( sales = [] ) => {
  try {
    const commissionIcecube = new CommissionIcecube();
    await commissionIcecube.findCommissionConfig();

    sales.forEach( sale => {
      /** Operator */
      const position = ( sale.assistant || sale.helper ) ? 'operator' : 'operator_assistant';
      commissionIcecube.addSale( sale.branch_company, sale.operator, ( sale.quantity * sale.yield ), position );
      
      /** Assistant */
      if( sale.assistant ) {
        commissionIcecube.addSale( sale.branch_company, sale.assistant, ( sale.quantity * sale.yield ), 'assistant' );
      }
      
      /** Helper */
      if( sale.helper ) {
        commissionIcecube.addSale( sale.branch_company, sale.helper, ( sale.quantity * sale.yield ), 'assistant' );
      }
    });

    commissionIcecube.calculateCommissions();
    
    return _.sortBy( commissionIcecube.getCommissionsToArray(), 'commission' ).reverse();
  } catch ( err ) {
    return [];
  }
}

module.exports = {
  getCommissions,
};