const { DataTypes } = require('sequelize');
const db = require('../db/connection');

const Employee = db.define( 'Employee', {
  name: {
    type: DataTypes.STRING,
  },
  first_lastname: {
    type: DataTypes.STRING,
  },
  second_lastname: {
    type: DataTypes.STRING,
  },
  gender: {
    type: DataTypes.STRING,
  },
}, {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  paranoid: true,
  timestamps: true,
});

Employee.addScope('defaultScope', {
  attributes: {
    exclude: ['deleted_at']
  }
});

module.exports = Employee;