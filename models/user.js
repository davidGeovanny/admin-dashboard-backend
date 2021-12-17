const db = require('../db/connection');
const { DataTypes } = require('sequelize');

const Employee = require('./employee');

const { encryptPassword } = require('../helpers/encrypt-password');
const { userStatus } = require('../data/static-data');

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
    }
  },
  status: {
    type: DataTypes.ENUM( userStatus ),
    validate: {
      isIn: {
        args: [ userStatus ],
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
    status: userStatus[0]
  }
})

User.addScope('loginScope', {
  attributes: {
    exclude: ['id_employee', 'status', 'created_at', 'updated_at', 'deleted_at']
  },
  where: {
    status: userStatus[0]
  }
});

User.addScope('tokenScope', {
  attributes: {
    exclude: ['id_employee', 'password', 'status', 'created_at', 'updated_at', 'deleted_at'],
  },
  where: {
    status: userStatus[0]
  }
});

User.beforeCreate( ( user ) => {
  user.password = encryptPassword( user.password );
});

User.beforeUpdate( ( user ) => {
  if( !!user.password ) {
    user.password = encryptPassword( user.password );
  }
});

module.exports = User;