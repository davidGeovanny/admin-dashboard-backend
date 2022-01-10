const { request, response } = require('express');
const _ = require('underscore');

const { 
  BranchCompany, 
  IcebarCommissionConfig, 
  IcecubeCommissionConfig, 
  WaterCommissionConfig 
} = require('../../models');

const { attrBranchesCompany }  = require('../../data/AttrBranchCompany');
const { branchCompanyStatus }  = require('../../data/static-data');
const { formatSequelizeError } = require('../../helpers/format-sequelize-error');
const { pagination }           = require('../../helpers/Pagination_t');
const { filterResultQueries }  = require('../../helpers/Filter_t');
const { createExcelFile }      = require('../../helpers/Excel_t');
const { deleteFile }           = require('../../helpers/File_t');
const { 
  GET_CACHE, 
  SET_CACHE, 
  CLEAR_CACHE, 
  CLEAR_SECTION_CACHE 
} = require('../../helpers/Cache_t');

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
    const queries  = req.query;
    
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

const getSpecificBranchCompany = async ( req = request, res = response ) => {
  try {
    const key    = req.originalUrl;
    const { id } = req.params;

    let row = JSON.parse( GET_CACHE( key ) );
    
    if( !row ) {
      row = await BranchCompany.findByPk( id, {
        include: [
          {
            model: IcebarCommissionConfig,
            as: 'icebar_commission_configs',
          },
          {
            model: IcecubeCommissionConfig,
            as: 'icecube_commission_configs',
          },
          {
            model: WaterCommissionConfig,
            as: 'water_commission_configs',
          },
        ]
      });
      SET_CACHE( key, JSON.stringify( row ), 60000 );
    }

    if( !row ) {
      return res.status(404).json({
        ok:     false,
        msg:    'La sucursal no existe',
        errors: []
      });
    }
    
    return res.json({
      ok:   true,
      data: row,
    });
  } catch ( err ) {
    console.log( err );
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
    CLEAR_SECTION_CACHE('branches_company');

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
    CLEAR_SECTION_CACHE('branches_company');

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
    const { list } = attrBranchesCompany;
    const queries  = req.query;

    let rows = await BranchCompany.findAll({ raw: true });

    rows = filterResultQueries( rows, queries, list );

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
  getSpecificBranchCompany,
  createBranchCompany,
  updateBranchCompany,
  deleteBranchCompany,
  getAllRowsData,
  getExportData,
};