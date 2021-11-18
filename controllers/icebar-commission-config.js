const { response, request } = require('express');
const { Op, Sequelize }     = require('sequelize');
const _ = require('underscore');

const { IcebarCommissionConfig, BranchCompany } = require('../models');

const { formatSequelizeError } = require('../helpers/format-sequelize-error');

const getIcebarCommissionConfig = async ( req = request, res = response ) => {
  try {
    const icebarCommissionConfig = await BranchCompany.findAll({
      include: [
        {
          model: IcebarCommissionConfig,
          as: 'commissions',
          attributes: ['min_range', 'max_range', 'cost_bar_operator', 'cost_bar_assistant', 'cost_bar_operator_assistant'],
          order: [ ['min_range', 'ASC'] ]
        }
      ],
      attributes: ['branch']
    });

    res.json({
      ok: true,
      icebarCommissionConfig,
    });
  } catch ( err ) {
    res.status(400).json({
      ok: false,
      msg: 'An error has ocurred',
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
        ok: false,
        msg: 'A config is already exists that is between the min and max values',
        errors: []
      });
    }

    const icebarCommissionConfig = await IcebarCommissionConfig.create( configBody );

    res.json({
      ok: true,
      icebarCommissionConfig,
    });
  } catch ( err ) {
    res.status(400).json({
      ok: false,
      msg: 'An error has ocurred',
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
        msg: 'The configuration does not exist',
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
        ok: false,
        msg: 'A config is already exists that is between the min and max values',
        errors: []
      });
    }

    await icebarCommissionConfig.update( configBody );

    res.json({
      ok: true,
      icebarCommissionConfig,
    })
  } catch ( err ) {
    res.status(400).json({
      ok: false,
      msg: 'An error has ocurred',
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
        ok: false,
        msg: 'The configuration does not exist',
        errors: []
      });
    }

    await icebarCommissionConfig.destroy();

    res.json({
      ok: true,
      icebarCommissionConfig,
    });
  } catch ( err ) {
    res.status(400).json({
      ok: false,
      msg: 'An error has ocurred',
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