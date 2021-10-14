const db = require('../db/connection');
const { DataTypes } = require('sequelize');

const BranchCompany = require('./branch-company');

const WaterCommissionConfig = db.define('WaterCommissionConfig', {
  percent_operator: {
    type: DataTypes.DECIMAL(6, 3).UNSIGNED,
    allowNull: false,
    defaultValue: 0,
    validate: {
      customNull( value ) {
        if( !value && value !== 0 ) {
          throw new Error('Need to provide a percent_operator');
        }
      },
      notNull : {
        msg: "percent_operator can't be null"
      },
    }
  },
  percent_assistant: {
    type: DataTypes.DECIMAL(6, 3).UNSIGNED,
    defaultValue: 0,
    validate: {
      customNull( value ) {
        if( !value && value !== 0 ) {
          throw new Error('Need to provide a percent_assistant');
        }
      },
    }
  },
  percent_operator_assistant: {
    type: DataTypes.DECIMAL(6, 3).UNSIGNED,
    defaultValue: 0,
    validate: {
      customNull( value ) {
        if( !value && value !== 0 ) {
          throw new Error('Need to provide a percent_operator_assistant');
        }
      },
    }
  },
  id_branch_company: {
    type: DataTypes.INTEGER.UNSIGNED,
    references: {
      model: BranchCompany,
      key  : 'id_branch_company'
    }
  }
}, {
  tableName: 'water_commission_config',
  timestamps: true,
  createdAt : 'created_at',
  updatedAt : 'updated_at',
  deletedAt : 'deleted_at',
  paranoid  : true,
});

/** Relations */
WaterCommissionConfig.belongsTo( BranchCompany, {
  as        : 'branch',
  foreignKey: 'id_branch_company'
});

WaterCommissionConfig.addScope('defaultScope', {
  attributes: {
    exclude: ['id_branch_company', 'deleted_at']
  }
});

module.exports = WaterCommissionConfig;