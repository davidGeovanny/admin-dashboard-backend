const { DataTypes } = require('sequelize');
const { userStatus } = require('../data/static-data');
const db = require('../db/connection');
const bcrypt = require('bcryptjs');
const Employee = require('./employee');

const User = db.define('User', {
  username: {
    type    : DataTypes.STRING,
    notNull : {
      msg: "Username can't be null"
    },
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
      model : Employee,
      key   : 'id_employee'
    }
  }
}, {
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

User.addScope('defaultScope', {
  attributes: {
    exclude: ['password', 'id_employee', 'deleted_at']
  }
});

User.beforeCreate( async ( user ) => {
  /** Encrypt password */
  const salt     = bcrypt.genSaltSync();
  const passHash = bcrypt.hashSync( user.password, salt );
  user.password  = passHash;
});

module.exports = User;