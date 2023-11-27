const { response, request } = require('express');
const { Op, Sequelize }     = require('sequelize');
const _ = require('underscore');

const { DeliveryPointCommissionConfig } = require('../../models');
const DeliveryPointCommissionConfigAttr = require('../../utils/classes/DeliveryPointCommissionConfigAttr');

const { formatSequelizeError } = require('../../helpers/FormatSequelizeError');
const { pagination }           = require('../../helpers/Pagination');
const { filterResultQueries }  = require('../../helpers/Filter');

const getDeliveryPointCommissionConfig = async ( req = request, res = response ) => {
  try {
    const queries = req.query;
    
    let rows = await DeliveryPointCommissionConfig.findAll();

    rows = filterResultQueries( rows, queries, DeliveryPointCommissionConfigAttr.filterable );
    rows = pagination( rows, queries, DeliveryPointCommissionConfigAttr.filterable );
  
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

const createDeliveryPointCommissionConfig = async ( req = request, res = response ) => {
  try {
    const configBody = _.pick( req.body, [
      'min_range',
      'max_range',
      'percent',
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

    const deliveryPointCommissionConfig = await DeliveryPointCommissionConfig.create( configBody );

    return res.json({
      ok: true,
      data: deliveryPointCommissionConfig,
    });
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'Ha ocurrido un error',
      errors: formatSequelizeError( err )
    });
  }
}

const updateDeliveryPointCommissionConfig = async ( req = request, res = response ) => {
  try {
    const { id } = req.params;
    
    const configBody = _.pick( req.body, [
      'min_range',
      'max_range',
      'percent',
      'id_branch_company'
    ]);

    const deliveryPointCommissionConfig = await DeliveryPointCommissionConfig.findByPk( id );

    if( !deliveryPointCommissionConfig ) {
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

    await deliveryPointCommissionConfig.update( configBody );

    return res.json({
      ok:   true,
      data: deliveryPointCommissionConfig,
    });
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'Ha ocurrido un error',
      errors: formatSequelizeError( err )
    });
  }
}

const deleteDeliveryPointCommissionConfig = async ( req = request, res = response ) => {
  try {
    const { id } = req.params;

    const deliveryPointCommissionConfig = await DeliveryPointCommissionConfig.findByPk( id );

    if( !deliveryPointCommissionConfig ) {
      return res.status(400).json({
        ok:     false,
        msg:    'La configuración no existe',
        errors: []
      });
    }

    await deliveryPointCommissionConfig.destroy();

    return res.json({
      ok:   true,
      data: deliveryPointCommissionConfig,
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
    const configs = await DeliveryPointCommissionConfig.findOne({
      where: {
        id_branch_company: {
          [ Op.eq ] : id_branch_company
        },
        [ Op.or ] : [
          Sequelize.literal(`
            ${ min_range } BETWEEN DeliveryPointCommissionConfig.min_range AND DeliveryPointCommissionConfig.max_range
          `),
          Sequelize.literal(`
            ${ max_range } BETWEEN DeliveryPointCommissionConfig.min_range AND DeliveryPointCommissionConfig.max_range
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
  getDeliveryPointCommissionConfig,
  createDeliveryPointCommissionConfig,
  updateDeliveryPointCommissionConfig,
  deleteDeliveryPointCommissionConfig,
};