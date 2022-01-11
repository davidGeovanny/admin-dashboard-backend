const db = require('../db/Connection');
const { DataTypes, Op } = require('sequelize');

const BranchCompanyAttr = require('../utils/classes/BranchCompanyAttr');
const { toUpperCaseWords } = require('../helpers/Capitalize');

const BranchCompany = db.define('BranchCompany', {
  branch: {
    type      : DataTypes.STRING,
    allowNull : false,
    validate  : {
      customNull( value ) {
        if( !value ) {
          throw new Error('Necesita proporcionar un nombre de la sucursal válido');
        }
      },
      notNull: {
        msg: 'El nombre de la sucursal no puede estar vacío'
      },
    },
    set( value ) {
      this.setDataValue( 'branch', toUpperCaseWords( value ) );
    },
  },
  status: {
    type: DataTypes.ENUM( BranchCompanyAttr.STATUS ),
    validate: {
      isIn: {
        args: [ BranchCompanyAttr.STATUS ],
        msg : 'Estatus no válido'
      },
    }
  },
}, {
  tableName : 'branches_company',
  timestamps: true,
  createdAt : 'created_at',
  updatedAt : 'updated_at',
  deletedAt : 'deleted_at',
  paranoid  : true,
});

/** Scopes */
BranchCompany.addScope('defaultScope', {
  attributes: {
    exclude: ['deleted_at']
  }
});

BranchCompany.addScope('activeBranchesScope', {
  attributes: {
    exclude: ['deleted_at']
  },
  where: {
    status: {
      [ Op.eq ] : BranchCompanyAttr.STATUS[0]
    }
  }
});

module.exports = BranchCompany;