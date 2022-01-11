const db = require('../db/Connection');
const { DataTypes } = require('sequelize');

const EmployeeAttr = require('../utils/classes/EmployeeAttr');
const { toUpperCaseWords } = require('../helpers/Capitalize');

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
    },
    set( value ) {
      this.setDataValue( 'name', toUpperCaseWords( value ) );
    },
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
    },
    set( value ) {
      this.setDataValue( 'first_lastname', toUpperCaseWords( value ) );
    },
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
    },
    set( value ) {
      this.setDataValue( 'second_lastname', toUpperCaseWords( value ) );
    },
  },
  gender: {
    type      : DataTypes.ENUM( EmployeeAttr.GENDERS ),
    allowNull : false,
    validate  : {
      isIn: {
        args:[ EmployeeAttr.GENDERS ],
        msg : 'Género no válido. Géneros disponibles: ' + EmployeeAttr.GENDERS.join(' | ')
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
    },
    set( value ) {
      this.setDataValue( 'email', value.toLowerCase() );
    },
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