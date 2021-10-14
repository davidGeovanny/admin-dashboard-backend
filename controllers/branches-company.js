const { request, response } = require('express');
const _      = require('underscore');

const { BranchCompany } = require('../models');

const { branchCompanyStatus } = require('../data/static-data');
const { formatSequelizeError } = require('../helpers/format-sequelize-error');

const getBranchesCompany = async ( req = request, res = response ) => {
  try {
    const getBranchesCompany = await BranchCompany.findAll();

    res.json({
      ok: true,
      getBranchesCompany
    });
  } catch ( err ) {
    res.status(400).json({
      ok: false,
      msg: 'An error has ocurred',
      errors: formatSequelizeError( err )
    });
  }
}

const createBranchCompany = async ( req = request, res = response ) => {
  try {
    const branchBody  = _.pick( req.body, ['branch'] );
    branchBody.status = branchCompanyStatus[0];

    const branchCompany = await BranchCompany.create( branchBody );

    res.status(201).json({
      ok: true,
      branchCompany,
    });
  } catch ( err ) {
    res.status(400).json({
      ok: false,
      msg: 'An error has ocurred',
      errors: formatSequelizeError( err )
    });
  }
}

const updateBranchCompany = async ( req = request, res = response ) => {
  try {
    const { id } = req.params;
    const branchBody = _.pick( req.body, ['branch', 'status'] );

    const branchCompany = await BranchCompany.findByPk( id );

    if( !branchCompany ) {
      return res.status(404).json({
        ok: false,
        msg: 'The branch company does not exist',
        errors: []
      });
    }

    await branchCompany.update( branchBody );

    res.json({
      ok: true,
      branchCompany,
    });
  } catch ( err ) {
    res.status(400).json({
      ok: false,
      msg: 'An error has ocurred',
      errors: formatSequelizeError( err )
    });
  }
}

const deleteBranchCompany = async ( req = request, res = response ) => {
  try {
    const { id } = req.params;

    const branchCompany = await BranchCompany.findByPk( id );

    if( !branchCompany ) {
      return res.status(404).json({
        ok: false,
        msg: 'The branch company does not exist',
        errors: []
      });
    }

    await branchCompany.destroy();

    res.json({
      ok: true,
      branchCompany,
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
  getBranchesCompany,
  createBranchCompany,
  updateBranchCompany,
  deleteBranchCompany,
};