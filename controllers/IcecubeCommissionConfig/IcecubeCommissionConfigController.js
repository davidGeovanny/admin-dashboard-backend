const { response, request } = require('express');
const { Op } = require('sequelize');
const _      = require('underscore');

const { IcecubeCommissionConfig } = require('../../models');
const IcecubeCommissionConfigAttr = require('../../utils/classes/IcecubeCommissionConfigAttr');

const { formatSequelizeError } = require('../../helpers/FormatSequelizeError');
const { pagination }           = require('../../helpers/Pagination');
const { filterResultQueries }  = require('../../helpers/Filter');

const getIcecubeCommissionConfig = async ( req = request, res = response ) => {
  try {
    const queries = req.query;
    
    let rows = await IcecubeCommissionConfig.findAll();

    rows = filterResultQueries( rows, queries, IcecubeCommissionConfigAttr.filterable );
    rows = pagination( rows, queries, IcecubeCommissionConfigAttr.filterable );
  
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

    return res.status(201).json({
      ok:   true,
      data: icecubeCommissionConfig
    });
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'Ha ocurrido un error',
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
        msg:    'La configuración no existe',
        errors: []
      });
    }

    await icecubeCommissionConfig.destroy();

    return res.json({
      ok:   true,
      data: icecubeCommissionConfig
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
  getIcecubeCommissionConfig,
  createIcecubeCommissionConfig,
  deleteIcecubeCommissionConfig,
};