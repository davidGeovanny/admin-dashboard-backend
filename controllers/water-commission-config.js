const { response, request } = require('express');
const { Op } = require('sequelize');
const _      = require('underscore');

const { WaterCommissionConfig } = require('../models');

const { attrWaterCommissionConfig } = require('../data/attr-water-config');
const { formatSequelizeError }      = require('../helpers/format-sequelize-error');
const { pagination }                = require('../helpers/pagination');
const { filterResultQueries }       = require('../helpers/filter');
const { GET_CACHE, SET_CACHE, CLEAR_CACHE } = require('../helpers/cache');

const getAllRowsData = async () => {
  try {
    const { keys } = attrWaterCommissionConfig;
    
    let rows = JSON.parse( GET_CACHE( keys.all ) );
  
    if( !rows ) {
      rows = await WaterCommissionConfig.findAll();
      SET_CACHE( keys.all, JSON.stringify( rows ), 60000 );
    }
  
    return rows;
  } catch ( err ) {
    return [];
  }
}

const getWaterCommissionConfig = async ( req = request, res = response ) => {
  try {
    const { keys, list } = attrWaterCommissionConfig;
    const queries = req.query;
    
    let rows = await getAllRowsData();

    rows = filterResultQueries( rows, queries, list );
    rows = pagination( rows, queries, list );
  
    return res.json({
      ok: true,
      ...rows
    });
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'An error has ocurred',
      errors: formatSequelizeError( err )
    });
  }
}

const createWaterCommissionConfig = async ( req = request, res = response ) => {
  try {
    const configBody = _.pick( req.body, [
      'percent_operator', 
      'percent_assistant', 
      'percent_operator_assistant', 
      'id_branch_company'
    ]);

    await WaterCommissionConfig.destroy({
      where: {
        id_branch_company: {
          [ Op.eq ] : configBody.id_branch_company
        }
      }
    });

    const waterCommissionConfig = await WaterCommissionConfig.create( configBody );
    CLEAR_CACHE( attrWaterCommissionConfig.keys.all );

    return res.status(201).json({
      ok:   true,
      data: waterCommissionConfig
    });
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'An error has ocurred',
      errors: formatSequelizeError( err )
    });
  }
}

const deleteWaterCommissionConfig = async ( req = request, res = response ) => {
  try {
    const { id } = req.params;

    const waterCommissionConfig = await WaterCommissionConfig.findByPk( id );
    
    if( !waterCommissionConfig ) {
      return res.status(400).json({
        ok:     false,
        msg:    'The configuration does not exist',
        errors: []
      });
    }

    await waterCommissionConfig.destroy();
    CLEAR_CACHE( attrWaterCommissionConfig.keys.all );

    return res.json({
      ok: true,
      data: waterCommissionConfig
    });
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'An error has ocurred',
      errors: formatSequelizeError( err )
    });
  }
}

module.exports = {
  getWaterCommissionConfig,
  createWaterCommissionConfig,
  deleteWaterCommissionConfig,
};