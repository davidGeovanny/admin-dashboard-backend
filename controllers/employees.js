const { response, request } = require('express');
const { Op } = require('sequelize');

const Employee = require('../models/employee');
const User = require('../models/user');

const getEmployees = async ( req = request, res = response ) => {
  try {
    const employees = await Employee.findAll();
  
    res.json({
      ok: true,
      employees
    });
  } catch ( err ) {
    res.status(400).json({
      ok: false,
      msg: 'An error has ocurred',
      errors: err
    });
  }
}

const createEmployee = async ( req = request, res = response ) => {
  const { name, first_lastname, second_lastname, gender, email } = req.body;

  try {
    const employee = new Employee({ 
      name, 
      first_lastname, 
      second_lastname, 
      gender, 
      email, 
    });
  
    await employee.save();
  
    res.status(201).json({
      ok: true,
      employee,
    });
  } catch ( err ) {
    res.status(400).json({
      ok: false,
      msg: 'An error has ocurred',
      errors: err
    });
  }
}

const updateEmployee = async ( req = request, res = response ) => {
  try {
    const { id } = req.params;
    const { body } = req;

    const employee = await Employee.findByPk( id );

    if( !employee ) {
      return res.status(400).json({
        ok: false,
        msg: 'The employee does not exist',
        errors: {}
      });
    }

    employee.update( body );

    res.json({
      ok: true,
      employee,
    });
  } catch ( err ) {
    res.status(400).json({
      ok: false,
      msg: 'An error has ocurred',
      errors: err
    });
  }
}

const deleteEmployee = async ( req = request, res = response ) => {
  try {
    const { id } = req.params;

    const employee = await Employee.findByPk( id );

    if( !employee ) {
      return res.status(400).json({
        ok: false,
        msg: 'The employee does not exist',
        errors: {}
      });
    }

    employee.destroy();

    await User.destroy({
      where: {
        id_employee: {
          [ Op.eq ] : employee.id
        }
      }
    });

    res.json({
      ok: true,
      employee,
    });
  } catch ( err ) {
    res.status(400).json({
      ok: false,
      msg: 'An error has ocurred',
      errors: err
    });
  }
}

module.exports = {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};