const { response, request } = require('express');
const { Op, Sequelize }     = require('sequelize');
const _ = require('underscore');

const { IcebarCommissionConfig } = require('../../models');
const IcebarCommissionConfigAttr = require('../../utils/classes/IcebarCommissionConfigAttr');

const { formatSequelizeError } = require('../../helpers/FormatSequelizeError');
const { pagination }           = require('../../helpers/Pagination');
const { filterResultQueries }  = require('../../helpers/Filter');

const getIcebarCommissionConfig = async ( req = request, res = response ) => {
  try {
    const queries = req.query;
    
    let rows = await IcebarCommissionConfig.findAll();

    rows = filterResultQueries( rows, queries, IcebarCommissionConfigAttr.filterable );
    rows = pagination( rows, queries, IcebarCommissionConfigAttr.filterable );
  
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

    return res.json({
      ok:   true,
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

    return res.json({
      ok:   true,
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

    return !!!configs;
    // return configs ? false : true;
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