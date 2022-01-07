const { response, request } = require('express');
const { Op, Sequelize }     = require('sequelize');
const _ = require('underscore');

const { IcebarCommissionConfig } = require('../models');

const { attrIcebarCommissionConfig } = require('../data/attr-icebar-config');
const { formatSequelizeError } = require('../helpers/format-sequelize-error');
const { pagination }           = require('../helpers/pagination');
const { filterResultQueries }  = require('../helpers/filter');
const { 
  GET_CACHE, 
  SET_CACHE, 
  CLEAR_CACHE, 
  CLEAR_SECTION_CACHE 
} = require('../helpers/cache');

const getAllRowsData = async () => {
  try {
    const { keys } = attrIcebarCommissionConfig;
    
    let rows = JSON.parse( GET_CACHE( keys.all ) );
  
    if( !rows ) {
      rows = await IcebarCommissionConfig.findAll();
      SET_CACHE( keys.all, JSON.stringify( rows ), 60000 );
    }
  
    return rows;
  } catch ( err ) {
    return [];
  }
}

const getIcebarCommissionConfig = async ( req = request, res = response ) => {
  try {
    const { list } = attrIcebarCommissionConfig;
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
      msg:    'Ha ocurrido un error',
      errors: formatSequelizeError( err )
    });
  }
}

const createIcebarCommissionConfig = async ( req = request, res = response ) => {
  try {
    const configBody = _.pick( req.body, [
      'min_range',
      'max_range',
      'cost_bar_operator',
      'cost_bar_assistant',
      'cost_bar_operator_assistant',
      'id_branch_company'
    ]);

    /** Avoid min and max ranges from being between other rows */
    const available = await checkRangesAreAvailabe(
      configBody.id_branch_company,
      configBody.min_range,
      configBody.max_range,
    );

    if( !available ) {
      return res.status(400).json({
        ok:     false,
        msg:    'Ya existe una configuración que está entre los valores mínimos y máximos',
        errors: []
      });
    }

    const icebarCommissionConfig = await IcebarCommissionConfig.create( configBody );
    CLEAR_CACHE( attrIcebarCommissionConfig.keys.all );

    return res.json({
      ok: true,
      data: icebarCommissionConfig,
    });
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'Ha ocurrido un error',
      errors: formatSequelizeError( err )
    });
  }
}

const updateIcebarCommissionConfig = async ( req = request, res = response ) => {
  try {
    const { id } = req.params;
    
    const configBody = _.pick( req.body, [
      'min_range',
      'max_range',
      'cost_bar_operator',
      'cost_bar_assistant',
      'cost_bar_operator_assistant',
      'id_branch_company'
    ]);

    const icebarCommissionConfig = await IcebarCommissionConfig.findByPk( id );

    if( !icebarCommissionConfig ) {
      return res.status(400).json({
        ok: false,
        msg: 'La configuración no existe',
        errors: []
      });
    }

    /** Avoid min and max ranges from being between other rows */
    const available = await checkRangesAreAvailabe(
      configBody.id_branch_company,
      configBody.min_range,
      configBody.max_range,
      id
    );

    if( !available ) {
      return res.status(400).json({
        ok:     false,
        msg:    'Ya existe una configuración que está entre los valores mínimos y máximos',
        errors: []
      });
    }

    await icebarCommissionConfig.update( configBody );
    CLEAR_SECTION_CACHE('icebar_commission_configs');

    return res.json({
      ok: true,
      icebarCommissionConfig,
    })
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'Ha ocurrido un error',
      errors: formatSequelizeError( err )
    });
  }
}

const deleteIcebarCommissionConfig = async ( req = request, res = response ) => {
  try {
    const { id } = req.params;

    const icebarCommissionConfig = await IcebarCommissionConfig.findByPk( id );

    if( !icebarCommissionConfig ) {
      return res.status(400).json({
        ok:     false,
        msg:    'La configuración no existe',
        errors: []
      });
    }

    await icebarCommissionConfig.destroy();
    CLEAR_SECTION_CACHE('icebar_commission_configs');

    return res.json({
      ok: true,
      icebarCommissionConfig,
    });
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'Ha ocurrido un error',
      errors: formatSequelizeError( err )
    });
  }
}

const checkRangesAreAvailabe = async ( id_branch_company, min_range, max_range, id = 0 ) => {
  try {
    const configs = await IcebarCommissionConfig.findOne({
      where: {
        id_branch_company: {
          [ Op.eq ] : id_branch_company
        },
        [ Op.or ] : [
          Sequelize.literal(`
            ${ min_range } BETWEEN IcebarCommissionConfig.min_range AND IcebarCommissionConfig.max_range
          `),
          Sequelize.literal(`
            ${ max_range } BETWEEN IcebarCommissionConfig.min_range AND IcebarCommissionConfig.max_range
          `),
        ],
        id: {
          [ Op.ne ] : id
        }
      }
    });

    return configs ? false : true;
  } catch ( err ) {
    return false;
  }
}

module.exports = {
  getIcebarCommissionConfig,
  createIcebarCommissionConfig,
  updateIcebarCommissionConfig,
  deleteIcebarCommissionConfig,
};