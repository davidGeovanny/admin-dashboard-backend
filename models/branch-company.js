// const db = require('../db/connection');
// const { DataTypes, Op } = require('sequelize');

// const { branchCompanyStatus } = require('../data/static-data');

// const BranchCompany = db.define('BranchCompany', {
//   branch: {
//     type      : DataTypes.STRING,
//     allowNull : false,
//     validate  : {
//       customNull( value ) {
//         if( !value ) {
//           throw new Error('Need to provide a valid branch company');
//         }
//       },
//       notNull: {
//         msg: "branch company can't be null"
//       },
//     }
//   },
//   status: {
//     type: DataTypes.ENUM( branchCompanyStatus ),
//     validate: {
//       isIn: {
//         args: [ branchCompanyStatus ],
//         msg : 'Status not valid'
//       },
//     }
//   },
// }, {
//   tableName : 'branch_companies',
//   timestamps: true,
//   createdAt : 'created_at',
//   updatedAt : 'updated_at',
//   deletedAt : 'deleted_at',
//   paranoid  : true,
// });

// BranchCompany.addScope('defaultScope', {
//   attributes: {
//     exclude: ['deleted_at']
//   }
// });

// BranchCompany.addScope('activeBranchesScope', {
//   attributes: {
//     exclude: ['deleted_at']
//   },
//   where: {
//     status: {
//       [ Op.eq ] : branchCompanyStatus[0]
//     }
//   }
// });

// module.exports = BranchCompany;

const db = require('../db/connection');
const { DataTypes, Op } = require('sequelize');
const { branchCompanyStatus } = require('../data/static-data');

const BranchCompany = db.define('BranchCompany', {
  branch: {
    type      : DataTypes.STRING,
    allowNull : false,
    validate  : {
      customNull( value ) {
        if( !value ) {
          throw new Error('Need to provide a valid branch company');
        }
      },
      notNull: {
        msg: "branch company can't be null"
      },
    }
  },
  status: {
    type: DataTypes.ENUM( branchCompanyStatus ),
    validate: {
      isIn: {
        args: [ branchCompanyStatus ],
        msg : 'Status not valid'
      },
    }
  },
}, {
  tableName : 'branch_companies',
  timestamps: true,
  createdAt : 'created_at',
  updatedAt : 'updated_at',
  deletedAt : 'deleted_at',
  paranoid  : true,
});

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