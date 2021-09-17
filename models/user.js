const { DataTypes } = require('sequelize');
const db = require('../db/connection');
const Employee = require('./employee');

const User = db.define( 'User', {
  username: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
    scopes: false || [] // Don't EVER include
  },
  status: {
    type: DataTypes.STRING,
  },
  id_employee: {
    type: DataTypes.INTEGER,
    references: {
      model: Employee,
      key: 'id_employee'
    }
  }
}, {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  paranoid: true,
  timestamps: true,
});

User.addScope('defaultScope', {
  attributes: {
    exclude: ['password', 'id_employee', 'deleted_at']
  }
});

User.belongsTo( Employee, {
  as        : 'employee',
  foreignKey: 'id_employee',
});

module.exports = User;