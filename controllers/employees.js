const { response, request } = require('express');
const { Op } = require('sequelize');
const _      = require('underscore');

const { Employee, User } = require('../models');

const { attrEmployees } = require('../data/attr-employee');
const { formatSequelizeError } = require('../helpers/format-sequelize-error');
const { pagination }           = require('../helpers/pagination');
const { filterResultQueries }  = require('../helpers/filter');
const { GET_CACHE, SET_CACHE, CLEAR_CACHE } = require('../helpers/cache');

const getEmployees = async ( req = request, res = response ) => {
  try {
    const { keys, list } = attrEmployees;
    const queries = req.query;
    
    let rows = JSON.parse( GET_CACHE( keys.all ) );

    if( !rows ) {
      rows = await Employee.findAll();
      SET_CACHE( keys.all, JSON.stringify( rows ), 60000 );
    }

    rows = filterResultQueries( rows, queries, list );
    rows = pagination( rows, queries, list );
  
    return res.json({
      ok: true,
      ...rows
    });
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'An error has ocurred',
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
      msg:    'An error has ocurred',
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
        msg:    'The employee does not exist',
        errors: []
      });
    }

    await employee.update( employeeBody );
    CLEAR_CACHE( attrEmployees.keys.all );

    return res.json({
      ok:   true,
      data: employee,
    });
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'An error has ocurred',
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
        msg:    'The employee does not exist',
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

    CLEAR_CACHE( attrEmployees.keys.all );

    return res.json({
      ok: true,
      data: employee,
    });
  } catch ( err ) {
    return res.status(400).json({
      ok:     false,
      msg:    'An error has ocurred',
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