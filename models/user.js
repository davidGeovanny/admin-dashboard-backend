const db = require('../db/connection');
const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const Employee = require('./employee');
const { userStatus } = require('../data/static-data');
const Profile = require('./profile');
const Profile_User = require('./profile_user');

const User = db.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  username: {
    type: DataTypes.STRING,
    notNull: {
      msg: "Username can't be null"
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
    type: DataTypes.ENUM( userStatus ),
    validate: {
      isIn: {
        args: [ userStatus ],
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

User.belongsToMany( Profile, {
  through: Profile_User,
  foreignKey: 'id_user',
  as: 'profiles'
});

User.beforeCreate( async ( user ) => {
  /** Encrypt password */
  const salt = bcrypt.genSaltSync();
  const passHash = bcrypt.hashSync( user.password, salt );
  user.password = passHash;
});

module.exports = User;