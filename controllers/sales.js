const { request, response } = require('express');

const hieleraApi = require('../helpers/hielera-api');
const { formatSequelizeError } = require('../helpers/format-sequelize-error');
const Sale = require('../models/sale');

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

    const ventas = await Sale.findAll({
      // attributes: [
      //   'route_name',
      //   sequelize.fn('max', sequelize.col('quantity'))
      // ],
      group: ['route_name']
    });

    // console.log(sales)

    // const ventas = await Sale.findAll({
    //   attributes: ['sales_folio', 'route_name']
    // });

    res.json({
      ok: true,
      ventas,
      sales: resp.data.sales.slice(0, 100),
    });
  } catch ( err ) {
    res.status(400).json({
      ok: false,
      msg: 'An error has ocurred',
      errors: formatSequelizeError( err )
    });
  }
}

module.exports = {
  getSales,
  getCommissions,
};