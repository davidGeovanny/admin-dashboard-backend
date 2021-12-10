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
          throw new Error('Need to provide a username');
        }
      },
      notNull : {
        msg: "Username can't be null"
      },
    }
  },
  password: {
    type      : DataTypes.STRING,
    allowNull : false,
    validate  : {
      customNull( value ) {
        if( !value ) {
          throw new Error('Need to provide a password');
        }
      },
      notNull: {
        msg: "Password can't be null"
      },
    }
  },
  status: {
    type: DataTypes.ENUM( userStatus ),
    validate: {
      isIn: {
        args: [ userStatus ],
        msg : 'Current user status is not valid'
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
  as: 'users',
  foreignKey: 'id_employee'
});

User.addScope('defaultScope', {
  attributes: {
    exclude: ['password', 'deleted_at']
  }
});

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