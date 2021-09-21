const { response, request } = require('express');

const Employee = require('../models/employee');

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

module.exports = {
  getEmployees,
  createEmployee,
};