const { DataTypes } = require('sequelize');
const db = require('../db/connection');
const Employee = require('./employee');

const status = ['actived', 'disabled', 'waiting activation'];

const User = db.define( 'User', {
  username: {
    type: DataTypes.STRING,
    notNull: {
      msg: "Usernae can't be null"
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    customNull( value ) {
      if( !value ) {
        throw new Error('Need to provide a password');
      }
    },
    notNull: {
      msg: "Password can't be null"
    },
  },
  status: {
    type: DataTypes.ENUM( status ),
    validate: {
      isIn: {
        args: [ status ],
        msg: 'Current user status is not valid'
      }
    }
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