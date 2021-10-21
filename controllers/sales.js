const { request, response } = require('express');
const { Op, Sequelize } = require('sequelize');

const { WaterCommissionConfig, BranchCompany, Sale, IcebarCommissionConfig } = require('../models');

const hieleraApi = require('../helpers/hielera-api');
const { formatSequelizeError } = require('../helpers/format-sequelize-error');

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

    // await Sale.bulkCreate( resp.data.sales );

    const waterCommissions = await getWaterCommission( resp.data.sales );

    res.json({
      ok: true,
      water_commissions: waterCommissions,
      icebar_commissions: [],
      icecube_commissions: [],
    });
  } catch ( err ) {
    res.status(400).json({
      ok: false,
      msg: 'An error has ocurred',
      errors: formatSequelizeError( err )
    });
  }
}

const getWaterCommission = async ( sales ) => {
  try {
    const salesWater = sales.filter( sale => sale.type_product === 'AGUA EMBOTELLADA' );

    const configCommissions = await WaterCommissionConfig.findAll({
      include: [
        {
          model     : BranchCompany,
          as        : 'branch',
          attributes: []
        }
      ],
      attributes: [
        'percent_operator', 
        'percent_assistant', 
        'percent_operator_assistant', 
        'branch.branch'
      ],
      raw: true,
    });

    let commissionsObject = {};
    let commissionsArray  = [];

    salesWater.forEach( sale => {

      const commissionPercents  = configCommissions.find( item => item.branch.toLowerCase() === sale.branch_company.toLowerCase() );

      const commissionOperator  = commissionPercents ? commissionPercents.percent_operator  : 0;
      const commissionAssistant = commissionPercents ? commissionPercents.percent_assistant : 0;
      const commissionOperatorAssistant = commissionPercents ? commissionPercents.percent_operator_assistant : 0;

      if( commissionsObject.hasOwnProperty( sale.operator ) ) {
        if( sale.assistant ) {
          commissionsObject[ sale.operator ].commission += ( sale.final_price * commissionOperator );
        } else {
          commissionsObject[ sale.operator ].commission += ( sale.final_price * commissionOperatorAssistant );
        }
      } else {
        if( sale.assistant ) {
          commissionsObject[ sale.operator ] = {
            employee: sale.operator,
            commission: ( sale.final_price * commissionOperator ),
            branch: sale.branch_company
          }
        } else {
          commissionsObject[ sale.operator ] = {
            employee: sale.operator,
            commission: ( sale.final_price * commissionOperatorAssistant ),
            branch: sale.branch_company
          }
        }
      }

      if( sale.assistant ) {
        if( commissionsObject.hasOwnProperty( sale.assistant ) ) {
          commissionsObject[ sale.assistant ].commission += ( sale.final_price * commissionAssistant )
        } else {
          commissionsObject[ sale.assistant ] = {
            employee: sale.assistant,
            commission: ( sale.final_price * commissionAssistant ),
            branch: sale.branch_company
          }
        }
      }
    });

    for( const key in commissionsObject ) {
      if( Object.hasOwnProperty.call( commissionsObject, key ) ) {
        commissionsArray = [ ...commissionsArray, {
          ...commissionsObject[ key ],
          commission: parseFloat( commissionsObject[ key ].commission.toFixed( 2 ) ),
        }];
      }
    }

    return commissionsArray;
  } catch ( err ) {
    return [];
  }
}

const getIcebarCommissions = async ( sales ) => {
  try {
    const salesIcebar = sales.filter( sale => sale.type_product === 'BARRA' );

    const configCommissions = await IcebarCommissionConfig.findAll({
      include: [
        {
          model     : BranchCompany,
          as        : 'branch',
          attributes: []
        }
      ],
      attributes: [
        'min_range', 
        'max_range', 
        'cost_bar_operator', 
        'cost_bar_assistant', 
        'cost_bar_operator_assistant', 
        'branch.branch'
      ],
      raw: true,
    });

    let commissionsObject = {};
    let commissionsArray  = [];

    salesIcebar.forEach( sale => {
      if( commissionsObject.hasOwnProperty( sale.operator ) ) {
        commissionsObject[ sale.operator ].quantity_sold += sale.quantity;
        commissionsObject[ sale.operator ].average_price += sale.final_price;
      } else {
        commissionsObject[ sale.operator ] = {
          employee: sale.operator,
          branch  : sale.branch_company,
          quantity_sold: sale.quantity,
          average_price: sale.final_price
        };
      }

      if( sale.assistant ) {
        if( commissionsObject.hasOwnProperty( sale.assistant ) ) {
          commissionsObject[ sale.assistant ].commission = commissionsObject[ sale.assistant ].commission + ( sale.final_price * commissionAssistant )
        } else {
          commissionsObject[ sale.assistant ] = {
            employee: sale.assistant,
            commission: ( sale.final_price * commissionAssistant ),
            branch: sale.branch_company
          }
        }
      }
    });
  } catch ( err ) {
    return [];
  }
}

module.exports = {
  getSales,
  getCommissions,
};