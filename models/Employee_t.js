const db = require('../db/Connection_t');
const { DataTypes } = require('sequelize');

const { userGenders } = require('../data/static-data');

const Employee = db.define('Employee', {
  name: {
    type      : DataTypes.STRING,
    allowNull : false,
    validate  : {
      customNull( value ) {
        if( !value ) {
          throw new Error('Necesita proporcionar un nombre válido');
        }
      },
      notNull: {
        msg: 'El nombre no puede estar vacío'
      },
    }
  },
  first_lastname: {
    type      : DataTypes.STRING,
    allowNull : false,
    validate  : {
      customNull( value ) {
        if( !value ) {
          throw new Error('Necesita proporcionar un apellido paterno válido');
        }
      },
      notNull: {
        msg: 'El apellido paterno no puede estar vacío'
      },
    }
  },
  second_lastname: {
    type      : DataTypes.STRING,
    allowNull : false,
    validate  : {
      customNull( value ) {
        if( !value ) {
          throw new Error('Necesita proporcionar un apellido materno válido');
        }
      },
      notNull: {
        msg: 'El apellido materno no puede estar vacío'
      },
    }
  },
  gender: {
    type      : DataTypes.ENUM( userGenders ),
    allowNull : false,
    validate  : {
      isIn: {
        args:[ userGenders ],
        msg : 'Género no válido. Géneros disponibles: ' + userGenders.join(' | ')
      },
    }
  },
  email: {
    type      : DataTypes.STRING,
    allowNull : false,
    validate  : {
      isEmail: {
        msg: 'Correo electrónico no válido'
      },
      notNull: {
        msg: 'El correo electrónico no puede estar vacío'
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