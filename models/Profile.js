const db = require('../db/Connection')
const { DataTypes } = require('sequelize');

const { profileStatus } = require('../data/static-data');

const Profile = db.define('Profile', {
  profile: {
    type      : DataTypes.STRING,
    allowNull : false,
    validate  : {
      customNull( value ) {
        if( !value ) {
          throw new Error('Necesita proporcionar el nombre del perfil');
        }
      },
      notNull: {
        msg: 'El nombre del perfil no puede estar vacío'
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
        msg : 'Estatus no es válido'
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