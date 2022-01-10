const db = require('../db/Connection_t');
const { DataTypes, Op } = require('sequelize');

const { branchCompanyStatus } = require('../data/static-data');

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
    }
  },
  status: {
    type: DataTypes.ENUM( branchCompanyStatus ),
    validate: {
      isIn: {
        args: [ branchCompanyStatus ],
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
      [ Op.eq ] : branchCompanyStatus[0]
    }
  }
});

module.exports = BranchCompany;