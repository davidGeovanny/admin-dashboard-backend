const { response, request } = require('express');
const { Op } = require('sequelize');
const _      = require('underscore');

const { Employee, User } = require('../models');

const { attrEmployees }        = require('../data/attr-employee');
const { formatSequelizeError } = require('../helpers/format-sequelize-error');
const { pagination }           = require('../helpers/pagination');
const { filterResultQueries }  = require('../helpers/filter');
const { 
  GET_CACHE, 
  SET_CACHE, 
  CLEAR_CACHE, 
  CLEAR_SECTION_CACHE 
} = require('../helpers/cache');

const getAllRowsData = async () => {
  try {
    const { keys } = attrEmployees;
    
    let rows = JSON.parse( GET_CACHE( keys.all ) );
  
    if( !rows ) {
      rows = await Employee.findAll();
      SET_CACHE( keys.all, JSON.stringify( rows ), 60000 );
    }
  
    return rows;
  } catch ( err ) {
    return [];
  }
}

const getEmployees = async ( req = request, res = response ) => {
  try {
    const { list } = attrEmployees;
    const queries = req.query;
    
    let rows = await getAllRowsData();

    rows = filterResultQueries( rows, queries, list );
    rows = pagination( rows, queries, list );
  
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

const getSpecificEmployee = async ( req = request, res = response ) => {
  try {
    const key    = req.originalUrl;
    const { id } = req.params;

    let row = JSON.parse( GET_CACHE( key ) );

    if( !row ) {
      row = await Employee.findByPk( id, {
        include: [
          {
            model: User.scope( 'activeUsersScope' ),
            as: 'users',
          },
        ]
      });
      SET_CACHE( key, JSON.stringify( row ), 60000 );
    }

    if( !row ) {
      return res.status(404).json({
        ok:     false,
        msg:    'El empleado no existe',
        errors: []
      });
    }
  
    return res.json({
      ok: true,
      data: row
    });
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'Ha ocurrido un error',
      errors: formatSequelizeError( err )
    });
  }
}

const createEmployee = async ( req = request, res = response ) => {
  const employeeBody = _.pick( req.body, [
    'name',
    'first_lastname',
    'second_lastname',
    'gender',
    'email',
  ]);

  try {
    const employee = await Employee.create( employeeBody );
    CLEAR_CACHE( attrEmployees.keys.all );
  
    return res.status(201).json({
      ok:   true,
      data: employee,
    });
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'Ha ocurrido un error',
      errors: formatSequelizeError( err )
    });
  }
}

const updateEmployee = async ( req = request, res = response ) => {
  try {
    const { id } = req.params;
    const employeeBody = _.pick( req.body, [
      'name',
      'first_lastname',
      'second_lastname',
      'gender',
      'email',
    ]);

    const employee = await Employee.findByPk( id );

    if( !employee ) {
      return res.status(400).json({
        ok:     false,
        msg:    'El empleado no existe',
        errors: []
      });
    }

    await employee.update( employeeBody );
    CLEAR_SECTION_CACHE('employees');

    return res.json({
      ok:   true,
      data: employee,
    });
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'Ha ocurrido un error',
      errors: formatSequelizeError( err )
    });
  }
}

const deleteEmployee = async ( req = request, res = response ) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByPk( id );

    if( !employee ) {
      return res.status(400).json({
        ok:     false,
        msg:    'El empleado no existe',
        errors: []
      });
    }

    await employee.destroy();

    await User.destroy({
      where: {
        id_employee: {
          [ Op.eq ] : employee.id
        }
      }
    });

    CLEAR_SECTION_CACHE('employees');

    return res.json({
      ok: true,
      data: employee,
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
  getEmployees,
  getSpecificEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};