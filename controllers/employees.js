const { response, request } = require('express');

const Employee = require('../models/employee');

const getEmployees = async ( req = request, res = response ) => {
  const employees = await Employee.findAll();

  res.json({
    ok: true,
    employees
  });
}

const createEmployee = async ( req = request, res = response ) => {
  const { name, first_lastname, second_lastname, gender, email } = req.body;

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

}

module.exports = {
  getEmployees,
  createEmployee,
};