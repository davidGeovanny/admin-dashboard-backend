const { DataTypes } = require('sequelize');
const db = require('../db/connection');
const { profileStatus } = require('../data/static-data');
const User = require('./user');
const Profile_User = require('./profile_user');

const Profile = db.define('Profile', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  profile: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
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
  status: {
    type: DataTypes.ENUM( profileStatus ),
    validate: {
      isIn: {
        args: [ profileStatus ],
        msg: 'Status not valid'
      },
    }
  },
}, {
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  paranoid: true,
  timestamps: true,
});

Profile.addScope('defaultScope', {
  attributes: {
    exclude: ['deleted_at']
  }
});

Profile.belongsToMany( User, {
  through: Profile_User,
  foreignKey: 'profile_id',
  as: 'users'
});

// Profile.belongsToMany( User, {
//   through: Profile_User,
//   foreignKey: 'id_profile',
// });

module.exports = Profile;