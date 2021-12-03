const { request, response } = require('express');
const _ = require('underscore');

const { BranchCompany } = require('../models');

const { attrBranchesCompany }  = require('../data/attr-branch');
const { branchCompanyStatus }  = require('../data/static-data');
const { formatSequelizeError } = require('../helpers/format-sequelize-error');
const { pagination }           = require('../helpers/pagination');
const { filterResultQueries }  = require('../helpers/filter');
const { GET_CACHE, SET_CACHE, CLEAR_CACHE } = require('../helpers/cache');

const getAllRowsData = async () => {
  try {
    const { keys } = attrBranchesCompany;
    
    let rows = JSON.parse( GET_CACHE( keys.all ) );
  
    if( !rows ) {
      rows = await BranchCompany.findAll();
      SET_CACHE( keys.all, JSON.stringify( rows ), 60000 );
    }
  
    return rows;
  } catch ( err ) {
    return [];
  }
}

const getBranchesCompany = async ( req = request, res = response ) => {
  try {
    const { list } = attrBranchesCompany;
    const queries = req.query;
    
    let rows = await getAllRowsData();

    rows = filterResultQueries( rows, queries, list );
    rows = pagination( rows, queries, list );
    
    return res.json({
      ok: true,
      ...rows,
    });
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'Ha ocurrido un error',
      errors: formatSequelizeError( err )
    });
  }
}

const createBranchCompany = async ( req = request, res = response ) => {
  try {
    const branchBody  = _.pick( req.body, ['branch'] );
    branchBody.status = branchCompanyStatus[0];

    const branchCompany = await BranchCompany.create( branchBody );
    CLEAR_CACHE( attrBranchesCompany.keys.all );

    return res.status(201).json({
      ok:   true,
      data: branchCompany,
    });
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'Ha ocurrido un error',
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
        ok:     false,
        msg:    'La sucursal no existe',
        errors: []
      });
    }

    await branchCompany.update( branchBody );
    CLEAR_CACHE( attrBranchesCompany.keys.all );

    return res.json({
      ok:   true,
      data: branchCompany,
    });
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'Ha ocurrido un error',
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
        ok:     false,
        msg:    'La sucursal no existe',
        errors: []
      });
    }

    await branchCompany.destroy();
    CLEAR_CACHE( attrBranchesCompany.keys.all );

    return res.json({
      ok:   true,
      data: branchCompany,
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
  getBranchesCompany,
  createBranchCompany,
  updateBranchCompany,
  deleteBranchCompany,
};