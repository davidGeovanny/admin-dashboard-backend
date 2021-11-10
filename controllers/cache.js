const { request, response } = require('express');
const mcache = require('memory-cache');

const clearCache = async ( req = request, res = response ) => {
  mcache.clear();

  res.json({
    ok: true,
    msg: 'Cleaned'
  });
}

module.exports = {
  clearCache,
};