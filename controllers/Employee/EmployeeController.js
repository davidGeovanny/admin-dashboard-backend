const { response, request } = require('express');
const { Op } = require('sequelize');
const _      = require('underscore');

const { Employee, User } = require('../../models');
const EmployeeAttr       = require('../../utils/classes/EmployeeAttr');

const { formatSequelizeError } = require('../../helpers/FormatSequelizeError');
const { pagination }           = require('../../helpers/Pagination');
const { filterResultQueries }  = require('../../helpers/Filter');
const { GET_CACHE, SET_CACHE, CLEAR_CACHE } = require('../../helpers/Cache');

const getAllRowsData = async () => {
  try {
    let rows = JSON.parse( GET_CACHE( `${ EmployeeAttr.SECTION }(all)` ) );
  
    if( !rows ) {
      rows = await Employee.findAll();
      SET_CACHE( `${ EmployeeAttr.SECTION }(all)`, JSON.stringify( rows ), 60000 );
    }
  
    return rows;
  } catch ( err ) {
    return [];
  }
}

const getEmployees = async ( req = request, res = response ) => {
  try {
    const queries = req.query;
    
    let rows = await getAllRowsData();

    rows = filterResultQueries( rows, queries, EmployeeAttr.filterable );
    rows = pagination( rows, queries, EmployeeAttr.filterable );
  
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
    CLEAR_CACHE( `${ EmployeeAttr.SECTION }(all)` );
  
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
    CLEAR_CACHE( `${ EmployeeAttr.SECTION }(all)` );
    CLEAR_CACHE( `${ EmployeeAttr.SECTION }(${ id })` );

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

    CLEAR_CACHE( `${ EmployeeAttr.SECTION }(all)` );
    CLEAR_CACHE( `${ EmployeeAttr.SECTION }(${ id })` );

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
  createEmployee,
  updateEmployee,
  deleteEmployee,
};