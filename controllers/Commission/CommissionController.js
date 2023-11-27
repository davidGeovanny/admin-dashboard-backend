const { request, response } = require('express');
const _ = require('underscore');

const CommissionWater         = require('../../utils/CommissionWater');
const CommissionIcebar        = require('../../utils/CommissionIcebar');
const CommissionIcecube       = require('../../utils/CommissionIcecube');
const CommissionDeliveryPoint = require('../../utils/CommissionDeliveryPoint');

const { formatSequelizeError } = require('../../helpers/FormatSequelizeError');
const hieleraApi = require('../../helpers/HieleraApi');

const getCommissions = async ( req = request, res = response ) => {
  try {
    const { initDate, finalDate } = req.query;

    const resp = await hieleraApi.get(`/sales/?initDate=${ initDate }&finalDate=${ finalDate }&employees=1`);

    if( !resp.data.ok ) {
      return res.status(400).json({
        ok:     false,
        msg:    resp.data.msg,
        errors: []
      });
    }

    const respDeliveryPoints = await hieleraApi.get(`/delivery-points/`);

    if( !respDeliveryPoints.data.ok ) {
      return res.status(400).json({
        ok:     false,
        msg:    respDeliveryPoints.data.msg,
        errors: []
      });
    }

    const sales = resp.data.sales.filter( sale => !sale.route_name.includes('PISO') );

    const waterCommissions   = await getWaterCommission( sales.filter( sale => sale.type_product.toLowerCase() === 'agua embotellada' ) );
    const icebarCommissions  = await getIcebarCommissions( sales.filter( sale => sale.type_product.toLowerCase() === 'barra' ) );
    const icecubeCommissions = await getIcecubeCommissions( sales.filter( sale => sale.type_product.toLowerCase() === 'cubo' ) );
    
    const salesDeliveryPoints = sales.filter( sale => respDeliveryPoints.data.deliveryPointEmployees.some( deliveryPoint => deliveryPoint.delivery_point_key === sale.delivery_point_key ) );
    const deliveryPointCommissions = await getDeliveryPointCommissions( salesDeliveryPoints, respDeliveryPoints.data.deliveryPointEmployees );

    console.log('Cantidad de ventas: ', sales.length);

    return res.json({
      ok: true,
      water_commissions         : waterCommissions,
      icebar_commissions        : icebarCommissions,
      icecube_commissions       : icecubeCommissions,
      delivery_point_commissions: deliveryPointCommissions,
    });
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'Ha ocurrido un error',
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
      /** @type { 'operator' | 'assistant' | 'operator_assistant' } */
      let position = ( sale.assistant || sale.helper ) ? 'operator' : 'operator_assistant';
      commissionWater.addSale( sale.branch_company, sale.operator, sale.final_price, position );
      
      /** Assistant */
      if( sale.assistant ) {
        position = ( sale.is_assistant_operator ) ? 'operator' : 'assistant';
        commissionWater.addSale( sale.branch_company, sale.assistant, sale.final_price, position );
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
      /** @type { 'operator' | 'assistant' | 'operator_assistant' } */
      let position = ( sale.assistant || sale.helper ) ? 'operator' : 'operator_assistant';
      commissionIceBar.addSale({
        branch  : sale.branch_company,
        name    : sale.operator,
        quantity: sale.quantity,
        price   : sale.final_price,
        position
      });
      
      /** Assistant */
      if( sale.assistant ) {
        position = ( sale.is_assistant_operator ) ? 'operator' : 'assistant';
        commissionIceBar.addSale({
          branch  : sale.branch_company,
          name    : sale.assistant,
          quantity: sale.quantity,
          price   : sale.final_price,
          position
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
      /** @type { 'operator' | 'assistant' | 'operator_assistant' } */
      let position = ( sale.assistant || sale.helper ) ? 'operator' : 'operator_assistant';
      commissionIcecube.addSale( sale.branch_company, sale.operator, ( sale.quantity * sale.yield ), position );
      
      /** Assistant */
      if( sale.assistant ) {
        position = ( sale.is_assistant_operator ) ? 'operator' : 'assistant';
        commissionIcecube.addSale( sale.branch_company, sale.assistant, ( sale.quantity * sale.yield ), position );
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

const getDeliveryPointCommissions = async ( sales = [], deliveryPointEmployees = [] ) => {
  try {
    const commissionDeliveryPoint = new CommissionDeliveryPoint();
    await commissionDeliveryPoint.findCommissionConfig();

    deliveryPointEmployees.forEach( deliveryPointEmployee => {
      let salesForDeliveryPoint = sales.filter( sale => sale.delivery_point_key === deliveryPointEmployee.delivery_point_key );

      if (salesForDeliveryPoint.length === 0) return;

      salesForDeliveryPoint.forEach( sale => {
        commissionDeliveryPoint.addSale({
          branch  : sale.branch_company,
          name    : deliveryPointEmployee.employee_name,
          price   : sale.final_price,
        });
      });
    });

    commissionDeliveryPoint.calculateCommissions();

    return _.sortBy( commissionDeliveryPoint.getCommissionsToArray(), 'commission' ).reverse();
  } catch ( err ) {
    return [];
  }
}

module.exports = {
  getCommissions,
};