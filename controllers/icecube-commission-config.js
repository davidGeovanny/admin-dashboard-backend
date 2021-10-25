const { response, request } = require('express');
const { Op } = require('sequelize');
const _      = require('underscore');

const { IcecubeCommissionConfig } = require('../models');

const { formatSequelizeError } = require('../helpers/format-sequelize-error');

const getIcecubeCommissionConfig = async ( req = request, res = response ) => {
  try {
    const icecubeCommissionConfig = await IcecubeCommissionConfig.findAll();

    res.json({
      ok: true,
      icecubeCommissionConfig,
    });
  } catch ( err ) {
    res.status(400).json({
      ok: false,
      msg: 'An error has ocurred',
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

    res.status(201).json({
      ok: true,
      icecubeCommissionConfig
    });
  } catch ( err ) {
    res.status(400).json({
      ok: false,
      msg: 'An error has ocurred',
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
        ok: false,
        msg: 'The configuration does not exist',
        errors: []
      });
    }

    await icecubeCommissionConfig.destroy();

    res.json({
      ok: true,
      icecubeCommissionConfig
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
  getIcecubeCommissionConfig,
  createIcecubeCommissionConfig,
  deleteIcecubeCommissionConfig,
};