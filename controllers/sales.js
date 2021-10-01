const { request, response } = require('express');
const hieleraApi = require('../helpers/hielera-api');

const getSales = async ( req = request, res = response ) => {

  try {
    const resp = await hieleraApi.get('/sales/?initDate=2021-09-01&finalDate=2021-09-30');
    
    if( !resp.data.ok ) {
      return res.status(400).json({
        ok: false,
        msg: resp.data.msg,
        errors: {}
      });
    }

    
    
    res.json({
      ok: true,
      sales: resp.data.sales
    });
  } catch ( err ) {
    res.status(400).json({
      ok: false,
      msg: 'An error has ocurred',
      errors: err
    });
  }
}

module.exports = {
  getSales
};