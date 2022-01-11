const db = require('../db/Connection');
const { DataTypes } = require('sequelize');

const { toUpperCaseWords } = require('../helpers/Capitalize');
const EmployeeAttr = require('../utils/classes/EmployeeAttr');

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

Employee.beforeCreate( ( employee ) => {
  employee.name            = toUpperCaseWords( employee.name );
  employee.first_lastname  = toUpperCaseWords( employee.first_lastname );
  employee.second_lastname = toUpperCaseWords( employee.second_lastname );
  employee.email           = employee.email.toLowerCase();
});

Employee.beforeUpdate( ( employee ) => {
  if( !!employee.name ) {
    employee.name = toUpperCaseWords( employee.name );
  }

  if( !!employee.first_lastname ) {
    employee.first_lastname = toUpperCaseWords( employee.first_lastname );
  }

  if( !!employee.second_lastname ) {
    employee.second_lastname = toUpperCaseWords( employee.second_lastname );
  }

  if( !!employee.email ) {
    employee.email = employee.email.toLowerCase();
  }
});

module.exports = Employee;