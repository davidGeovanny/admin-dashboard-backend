const { request, response } = require('express');
const _ = require('underscore');

const { 
  BranchCompany, 
} = require('../../models');

const { formatSequelizeError } = require('../../helpers/FormatSequelizeError');
const { pagination }           = require('../../helpers/Pagination');
const { filterResultQueries }  = require('../../helpers/Filter');
const { createExcelFile }      = require('../../helpers/Excel');
const { deleteFile }           = require('../../helpers/File');
const { 
  GET_CACHE, 
  SET_CACHE, 
  CLEAR_CACHE, 
  CLEAR_SECTION_CACHE 
} = require('../../helpers/Cache');
const BranchCompanyAttr = require('../../utils/classes/BranchCompanyAttr');

const getAllRowsData = async () => {
  try {
    let rows = JSON.parse( GET_CACHE( `${ BranchCompanyAttr.SECTION }(all)` ) );
    
    if( !rows ) {
      rows = await BranchCompany.findAll();
      SET_CACHE( `${ BranchCompanyAttr.SECTION }(all)`, JSON.stringify( rows ), 60000 );
    }
    
    return rows;
  } catch ( err ) {
    return [];
  }
}

const getBranchesCompany = async ( req = request, res = response ) => {
  try {
    const queries  = req.query;
    
    let rows = await getAllRowsData();

    rows = filterResultQueries( rows, queries, BranchCompanyAttr.filterable );
    rows = pagination( rows, queries, BranchCompanyAttr.filterable );
    
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
    branchBody.status = BranchCompanyAttr.STATUS[0];

    const branchCompany = await BranchCompany.create( branchBody );
    CLEAR_CACHE( `${ BranchCompanyAttr.SECTION }(all)` );

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
    CLEAR_CACHE( `${ BranchCompanyAttr.SECTION }(all)` );

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
    CLEAR_CACHE( `${ BranchCompanyAttr.SECTION }(all)` );

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

const getExportData = async ( req = request, res = response ) => {
  try {
    const queries  = req.query;

    let rows = await BranchCompany.findAll({ raw: true });

    rows = filterResultQueries( rows, queries, BranchCompanyAttr.filterable );

    const fileName = createExcelFile( rows.map( row => ({
      Sucursal: row.branch,
      Estatus:  row.status, 
    })), 'branches' );

    if( fileName === '' ) {
      return res.status(404).json({
        ok:     false,
        msg:    'No ha podido crearse el archivo de Excel',
        errors: [],
      });
    }

    return res.download(`tmp/${ fileName }`, ( err ) => {
      if( err ) {
        console.log(`EXCEL: ${ err }`);
      }
      
      deleteFile( fileName );
    });
  } catch ( err ) {
    console.log( err );
    return res.status(404).json({
      ok:     false,
      msg:    'Ha ocurrido un error',
      errors: [],
    });
  }
}

module.exports = {
  getBranchesCompany,
  createBranchCompany,
  updateBranchCompany,
  deleteBranchCompany,
  getAllRowsData,
  getExportData,
};