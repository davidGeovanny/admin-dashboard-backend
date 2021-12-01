const { response, request } = require('express');
const { Op } = require('sequelize');
const _      = require('underscore');

const { IcecubeCommissionConfig } = require('../models');

const { attrIcecubeCommissionConfig } = require('../data/attr-icecube-config');
const { formatSequelizeError }        = require('../helpers/format-sequelize-error');
const { pagination }                  = require('../helpers/pagination');
const { filterResultQueries }         = require('../helpers/filter');
const { GET_CACHE, SET_CACHE, CLEAR_CACHE } = require('../helpers/cache');

const getAllRowsData = async () => {
  try {
    const { keys } = attrIcecubeCommissionConfig;
    
    let rows = JSON.parse( GET_CACHE( keys.all ) );
  
    if( !rows ) {
      rows = await IcecubeCommissionConfig.findAll();
      SET_CACHE( keys.all, JSON.stringify( rows ), 60000 );
    }
  
    return rows;
  } catch ( err ) {
    return [];
  }
}

const getIcecubeCommissionConfig = async ( req = request, res = response ) => {
  try {
    const { list } = attrIcecubeCommissionConfig;
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

const createIcecubeCommissionConfig = async ( req = request, res = response ) => {
  try {
    const configBody = _.pick( req.body, [
      'non_commissionable_kg', 
      'percent_operator', 
      'percent_assistant', 
      'percent_operator_assistant', 
      'id_branch_company'
    ]);

    await IcecubeCommissionConfig.destroy({
      where: {
        id_branch_company: {
          [ Op.eq ] : configBody.id_branch_company
        }
      }
    });

    const icecubeCommissionConfig = await IcecubeCommissionConfig.create( configBody );
    CLEAR_CACHE( attrIcecubeCommissionConfig.keys.all );

    return res.status(201).json({
      ok:   true,
      data: icecubeCommissionConfig
    });
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'An error has ocurred',
      errors: formatSequelizeError( err )
    });
  }
}

const deleteIcecubeCommissionConfig = async ( req = request, res = response ) => {
  try {
    const { id } = req.params;

    const icecubeCommissionConfig = await IcecubeCommissionConfig.findByPk( id );
    
    if( !icecubeCommissionConfig ) {
      return res.status(400).json({
        ok:     false,
        msg:    'The configuration does not exist',
        errors: []
      });
    }

    await icecubeCommissionConfig.destroy();
    CLEAR_CACHE( attrIcecubeCommissionConfig.keys.all );

    return res.json({
      ok:   true,
      data: icecubeCommissionConfig
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
  getIcecubeCommissionConfig,
  createIcecubeCommissionConfig,
  deleteIcecubeCommissionConfig,
};