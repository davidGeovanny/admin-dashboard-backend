const { response, request } = require('express');
const { Op } = require('sequelize');
const _      = require('underscore');

const { WaterCommissionConfig } = require('../models');

const { formatSequelizeError } = require('../helpers/format-sequelize-error');

const getWaterCommissionConfig = async ( req = request, res = response ) => {
  try {
    const waterCommissionConfig = await WaterCommissionConfig.findAll();

    res.json({
      ok: true,
      waterCommissionConfig
    });
  } catch ( err ) {
    res.status(400).json({
      ok: false,
      msg: 'An error has ocurred',
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
      'minimum_sale_week', 
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

    res.json({
      ok: true,
      waterCommissionConfig
    });
  } catch ( err ) {
    res.status(400).json({
      ok: false,
      msg: 'An error has ocurred',
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
        ok: false,
        msg: 'The configuration does not exist',
        errors: []
      });
    }

    await waterCommissionConfig.destroy();

    res.json({
      ok: true,
      waterCommissionConfig
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
  getWaterCommissionConfig,
  createWaterCommissionConfig,
  deleteWaterCommissionConfig,
};