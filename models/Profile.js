const db = require('../db/Connection');
const { DataTypes } = require('sequelize');

const ProfileAttr = require('../utils/classes/ProfileAttr');
const { capitalizeFirstLetter } = require('../helpers/Capitalize');

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
    },
    set( value ) {
      this.setDataValue( 'profile', capitalizeFirstLetter( value ) );
    },
  },
  default: {
    type        : DataTypes.BOOLEAN,
    defaultValue: 0,
  },
  status: {
    type    : DataTypes.ENUM( ProfileAttr.STATUS ),
    validate: {
      isIn: {
        args: [ ProfileAttr.STATUS ],
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
    status: ProfileAttr.STATUS[0]
  }
});

module.exports = Profile;