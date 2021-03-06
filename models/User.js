const db = require('../db/Connection');
const { DataTypes } = require('sequelize');

const Employee = require('./Employee');
const UserAttr = require('../utils/classes/UserAttr');

const { encryptPassword } = require('../helpers/EncryptPassword');

const User = db.define('User', {
  username: {
    type    : DataTypes.STRING,
    allowNull: false,
    validate: {
      customNull( value ) {
        if( !value ) {
          throw new Error('Necesita proporcionar un nombre de usuario');
        }
      },
      notNull : {
        msg: 'El nombre de usuario no puede estar vacío'
      },
    }
  },
  password: {
    type      : DataTypes.STRING,
    allowNull : false,
    validate  : {
      customNull( value ) {
        if( !value ) {
          throw new Error('Necesita proporcionar una contraseña');
        }
      },
      notNull: {
        msg: 'La contraseña no puede estar vacío'
      },
    },
    set( value ) {
      this.setDataValue( 'password', encryptPassword( value ) );
    }
  },
  status: {
    type: DataTypes.ENUM( UserAttr.STATUS ),
    validate: {
      isIn: {
        args: [ UserAttr.STATUS ],
        msg : 'El estatus del usuario no es válido'
      }
    }
  },
  id_employee: {
    type: DataTypes.INTEGER,
    references: {
      model: Employee,
      key  : 'id_employee'
    }
  }
}, {
  tableName: 'users',
  timestamps: true,
  createdAt : 'created_at',
  updatedAt : 'updated_at',
  deletedAt : 'deleted_at',
  paranoid  : true,
});

/** Relations */
User.belongsTo( Employee, {
  as        : 'employee',
  foreignKey: 'id_employee',
});

Employee.hasMany( User, {
  as:         'users',
  foreignKey: 'id_employee'
});

/** Scopes */
User.addScope('defaultScope', {
  attributes: {
    exclude: ['password', 'deleted_at']
  }
});

User.addScope('activeUsersScope', {
  attributes: {
    exclude: ['status', 'password', 'deleted_at']
  },
  where: {
    status: UserAttr.STATUS[0]
  }
})

User.addScope('loginScope', {
  attributes: {
    exclude: ['id_employee', 'status', 'created_at', 'updated_at', 'deleted_at']
  },
  where: {
    status: UserAttr.STATUS[0]
  }
});

User.addScope('tokenScope', {
  attributes: {
    exclude: ['id_employee', 'password', 'status', 'created_at', 'updated_at', 'deleted_at'],
  },
  where: {
    status: UserAttr.STATUS[0]
  }
});

module.exports = User;