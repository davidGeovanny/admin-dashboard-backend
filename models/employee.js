const db = require('../db/connection');
const { DataTypes } = require('sequelize');

const { userGenders } = require('../data/static-data');

const Employee = db.define('Employee', {
  name: {
    type      : DataTypes.STRING,
    allowNull : false,
    validate  : {
      customNull( value ) {
        if( !value ) {
          throw new Error('Need to provide a valid name');
        }
      },
      notNull: {
        msg: "Name can't be null"
      },
    }
  },
  first_lastname: {
    type      : DataTypes.STRING,
    allowNull : false,
    validate  : {
      customNull( value ) {
        if( !value ) {
          throw new Error('Need to provide a valid first_lastname');
        }
      },
      notNull: {
        msg: "first_lastname can't be null"
      },
    }
  },
  second_lastname: {
    type      : DataTypes.STRING,
    allowNull : false,
    validate  : {
      customNull( value ) {
        if( !value ) {
          throw new Error('Need to provide a valid second_lastname');
        }
      },
      notNull: {
        msg: "second_lastname can't be null"
      },
    }
  },
  gender: {
    type      : DataTypes.ENUM( userGenders ),
    allowNull : false,
    validate  : {
      isIn: {
        args:[ userGenders ],
        msg : 'Gender not valid. Valid values: ' + userGenders.join(' | ')
      },
    }
  },
  email: {
    type      : DataTypes.STRING,
    allowNull : false,
    validate  : {
      isEmail: {
        msg: 'Email not valid'
      },
      notNull: {
        msg: "Email can't be null"
      },
    }
  },
}, {
  tableName: 'employees',
  timestamps: true,
  createdAt : 'created_at',
  updatedAt : 'updated_at',
  deletedAt : 'deleted_at',
  paranoid  : true,
});

Employee.addScope('defaultScope', {
  attributes: {
    exclude: ['deleted_at']
  }
});

module.exports = Employee;