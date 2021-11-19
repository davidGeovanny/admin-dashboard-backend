const db = require('../db/connection')
const { DataTypes } = require('sequelize');

const { profileStatus } = require('../data/static-data');

const Profile = db.define('Profile', {
  profile: {
    type      : DataTypes.STRING,
    allowNull : false,
    validate  : {
      customNull( value ) {
        if( !value ) {
          throw new Error('Need to provide a valid profile');
        }
      },
      notNull: {
        msg: "profile can't be null"
      },
    }
  },
  default: {
    type        : DataTypes.BOOLEAN,
    defaultValue: 0,
  },
  status: {
    type    : DataTypes.ENUM( profileStatus ),
    validate: {
      isIn: {
        args: [ profileStatus ],
        msg : 'Status not valid'
      },
    }
  },
}, {
  tableName: 'profiles',
  timestamps: true,
  createdAt : 'created_at',
  updatedAt : 'updated_at',
  deletedAt : 'deleted_at',
  paranoid  : true,
});

Profile.addScope('defaultScope', {
  attributes: {
    exclude: ['deleted_at']
  }
});

Profile.addScope('activeProfileScope', {
  attributes: {
    exclude: ['default', 'deleted_at'],
  },
  where: {
    status: profileStatus[0]
  }
});

module.exports = Profile;