const { request, response } = require('express');
const { Op, Sequelize } = require('sequelize');

const { 
  WaterCommissionConfig, 
  BranchCompany, 
  Sale, 
  IcebarCommissionConfig, 
  IcecubeCommissionConfig 
} = require('../models');

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

    // await Sale.destroy({
    //   where: {},
    //   truncate: true,
    // });
    // await Sale.bulkCreate( resp.data.sales );
    
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

    const waterCommissions = await getWaterCommission( resp.data.sales );
    const icebarCommissions = await getIcebarCommissions( resp.data.sales );
    const icecubeCommissions = await getIcecubeCommissions( resp.data.sales );

    res.json({
      ok: true,
      icecube_commissions: icecubeCommissions,
      // icebar_commissions: icebarCommissions,
      // water_commissions: waterCommissions,
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
    const salesWater = sales.filter( sale => sale.type_product.toLowerCase() === 'agua embotellada' );

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
    const salesIcebar = sales.filter( sale => sale.type_product.toLowerCase() === 'barra' );

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
      order: [ ['min_range', 'ASC'] ]
    });

    let commissionsObject = {};
    let commissionsArray  = [];

    salesIcebar.forEach( sale => {
      if( commissionsObject.hasOwnProperty( sale.operator ) ) {
        commissionsObject[ sale.operator ].quantity_sold += sale.quantity;
        commissionsObject[ sale.operator ].average_price += sale.final_price;

        commissionsObject[ sale.operator ].operator_quantity += sale.assistant ? sale.quantity : 0;
        commissionsObject[ sale.operator ].operator_assistant_quantity += sale.assistant ? 0 : sale.quantity;
      } else {
        commissionsObject[ sale.operator ] = {
          employee: sale.operator,
          branch  : sale.branch_company,
          quantity_sold  : sale.quantity,
          average_price  : sale.final_price,
          operator_quantity : sale.assistant ? sale.quantity : 0,
          assistant_quantity: 0,
          operator_assistant_quantity: !sale.assistant ? sale.quantity : 0,
          commissionPercent: undefined,
          commission       : 0,
        };
      }

      if( sale.assistant ) {
        if( commissionsObject.hasOwnProperty( sale.assistant ) ) {
          commissionsObject[ sale.assistant ].quantity_sold += sale.quantity;
          commissionsObject[ sale.assistant ].average_price += sale.final_price;

          commissionsObject[ sale.assistant ].assistant_quantity += sale.quantity;
        } else {
          commissionsObject[ sale.assistant ] = {
            employee: sale.assistant,
            branch  : sale.branch_company,
            quantity_sold  : sale.quantity,
            average_price  : sale.final_price,
            operator_quantity          : 0,
            assistant_quantity         : sale.quantity,
            operator_assistant_quantity: 0,
            commissionPercent: undefined,
            commission       : 0,
          }
        }
      }
    });

    for( const key in commissionsObject ) {
      if( Object.hasOwnProperty.call( commissionsObject, key ) ) {
        let element = commissionsObject[ key ];
        element.average_price = Math.round( element.average_price / element.quantity_sold );
        
        /** Get commission percent */
        const commissionsBranch = configCommissions.filter( item => item.branch.toLowerCase() === element.branch.toLowerCase() );
        
        element.commissionPercent = commissionsBranch.find( ( item, index ) => {
          if( element.average_price >= item.min_range && element.average_price <= item.max_range ) {
            return item;
          }

          if( index === commissionsBranch.length - 1 ) {
            /** Return only if is the last element and if is more than range commission */
            if( element.average_price >= item.max_range ) {
              return item;
            } else {
              return {
                cost_bar_operator : 0,
                cost_bar_assistant: 0,
                cost_bar_operator_assistant: 0,
              };
            }
          }
        });

        element.operator_quantity  = element.operator_quantity  * element.commissionPercent.cost_bar_operator;
        element.assistant_quantity = element.assistant_quantity * element.commissionPercent.cost_bar_assistant;
        element.operator_assistant_quantity = element.operator_assistant_quantity * element.commissionPercent.cost_bar_operator_assistant;

        commissionsArray = [ ...commissionsArray, {
          branch    : element.branch,
          employee  : element.employee,
          commission: parseFloat( ( element.operator_quantity + element.assistant_quantity + element.operator_assistant_quantity ).toFixed( 2 ) ),
        }];
      }
    }

    return commissionsArray;
  } catch ( err ) {
    return [];
  }
}

const getIcecubeCommissions = async ( sales ) => {
  try {
    const salesIcecube = sales.filter( sale => sale.type_product.toLowerCase() === 'cubo' );

    const configCommissions = await IcecubeCommissionConfig.findAll({
      include: [
        {
          model     : BranchCompany,
          as        : 'branch',
          attributes: []
        }
      ],
      attributes: [
        'non_commissionable_kg', 
        'percent_operator', 
        'percent_assistant', 
        'percent_operator_assistant', 
        'branch.branch'
      ],
      raw: true,
    });

    let commissionsObject = {};
    let commissionsArray  = [];

    salesIcecube.forEach( sale => {
      const commissionPercents  = configCommissions.find( item => item.branch.toLowerCase() === sale.branch_company.toLowerCase() );

      if( commissionsObject.hasOwnProperty( sale.operator ) ) {
        const percent = sale.assistant ? commissionPercents.percent_operator : commissionPercents.percent_operator_assistant;

        commissionsObject[ sale.operator ].quantity.kg += ( sale.yield * sale.quantity );
        commissionsObject[ sale.operator ].quantity.price += ( sale.yield * sale.quantity ) * percent;
      } else {
        const percent = sale.assistant ? commissionPercents.percent_operator : commissionPercents.percent_operator_assistant;

        commissionsObject[ sale.operator ] = {
          employee: sale.operator,
          branch  : sale.branch_company,
          quantity: {
            kg   : ( sale.yield * sale.quantity ),
            price: ( sale.yield * sale.quantity ) * percent,
          },
        };
      }

      if( sale.assistant ) {
        if( commissionsObject.hasOwnProperty( sale.assistant ) ) {
          const percent = commissionPercents.percent_assistant;
        
          commissionsObject[ sale.assistant ].quantity.kg += ( sale.yield * sale.quantity );
          commissionsObject[ sale.assistant ].quantity.price += ( sale.yield * sale.quantity ) * percent;
        } else {
          const percent = commissionPercents.percent_assistant;

          commissionsObject[ sale.operator ] = {
            employee: sale.operator,
            branch  : sale.branch_company,
            quantity: {
              kg   : ( sale.yield * sale.quantity ),
              price: ( sale.yield * sale.quantity ) * percent,
            },
          };
        }
      }
    });

    for( const key in commissionsObject ) {
      if( Object.hasOwnProperty.call( commissionsObject, key ) ) {
        const { employee, branch, quantity } = commissionsObject[ key ];
        const { kg, price } = quantity;
        
        const commissionPercents  = configCommissions.find( item => item.branch.toLowerCase() === branch.toLowerCase() );

        if( kg > commissionPercents.non_commissionable_kg ) {
  
          commissionsArray = [ ...commissionsArray, {
            employee,
            branch,
            commission: parseFloat( ( ( ( kg - commissionPercents.non_commissionable_kg ) * price ) / kg ).toFixed( 2 ) ),
          }];
        }

      }
    }

    return commissionsArray;
  } catch ( err ) {
    console.log({ err })
    return [];
  }
}

module.exports = {
  getSales,
  getCommissions,
};