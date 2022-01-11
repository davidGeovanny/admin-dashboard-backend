const { response, request } = require('express');
const { Op } = require('sequelize');
const _      = require('underscore');

const { WaterCommissionConfig } = require('../../models');

const { formatSequelizeError } = require('../../helpers/FormatSequelizeError');
const { pagination }           = require('../../helpers/Pagination');
const { filterResultQueries }  = require('../../helpers/Filter');
const { 
  GET_CACHE, 
  SET_CACHE, 
  CLEAR_CACHE, 
  CLEAR_SECTION_CACHE 
} = require('../../helpers/Cache');
const WaterCommissionConfigAttr = require('../../utils/classes/WaterCommissionConfigAttr');

const getAllRowsData = async () => {
  try {
    let rows = JSON.parse( GET_CACHE( `${ WaterCommissionConfigAttr.SECTION }(all)` ) );
  
    if( !rows ) {
      rows = await WaterCommissionConfig.findAll();
      SET_CACHE( `${ WaterCommissionConfigAttr.SECTION }(all)`, JSON.stringify( rows ), 60000 );
    }
  
    return rows;
  } catch ( err ) {
    return [];
  }
}

const getWaterCommissionConfig = async ( req = request, res = response ) => {
  try {
    const queries = req.query;
    
    let rows = await getAllRowsData();

    rows = filterResultQueries( rows, queries, WaterCommissionConfigAttr.filterable );
    rows = pagination( rows, queries, WaterCommissionConfigAttr.filterable );
  
    return res.json({
      ok: true,
      ...rows
    });
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'Ha ocurrido un error',
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
    CLEAR_CACHE( `${ WaterCommissionConfigAttr.SECTION }(all)` );

    return res.status(201).json({
      ok:   true,
      data: waterCommissionConfig
    });
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'Ha ocurrido un error',
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
        msg:    'La configuración no existe',
        errors: []
      });
    }

    await waterCommissionConfig.destroy();
    CLEAR_SECTION_CACHE('water_commission_configs');

    return res.json({
      ok: true,
      data: waterCommissionConfig
    });
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'Ha ocurrido un error',
      errors: formatSequelizeError( err )
    });
  }
}

module.exports = {
  getWaterCommissionConfig,
  createWaterCommissionConfig,
  deleteWaterCommissionConfig,
};