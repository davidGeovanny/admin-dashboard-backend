const db = require('../db/Connection');
const { DataTypes } = require('sequelize');

const BranchCompany = require('./BranchCompany');

const IcecubeCommissionConfig = db.define('IcecubeCommissionConfig', {
  non_commissionable_kg: {
    type: DataTypes.DECIMAL(7, 2).UNSIGNED,
    defaultValue: 0,
    validate: {
      customNull( value ) {
        if( !value && value !== 0 ) {
          throw new Error('Necesita proporcionar los kg no comisionables');
        }
      },
    }
  },
  percent_operator: {
    type: DataTypes.DECIMAL(6, 3).UNSIGNED,
    allowNull: false,
    defaultValue: 0,
    validate: {
      customNull( value ) {
        if( !value && value !== 0 ) {
          throw new Error('Necesita proporcionar el porcentaje para el operador');
        }
      },
      notNull : {
        msg: 'El porcentaje de operador no puede estar vacío'
      },
    }
  },
  percent_assistant: {
    type: DataTypes.DECIMAL(6, 3).UNSIGNED,
    defaultValue: 0,
    validate: {
      customNull( value ) {
        if( !value && value !== 0 ) {
          throw new Error('Necesita proporcionar el porcentaje para el asistente');
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
          throw new Error('Necesita proporcionar el porcentaje para el operador asistente');
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
  tableName: 'icecube_commission_config',
  timestamps: true,
  createdAt : 'created_at',
  updatedAt : 'updated_at',
  deletedAt : 'deleted_at',
  paranoid  : true,
});

/** Relations */
IcecubeCommissionConfig.belongsTo( BranchCompany, {
  as        : 'branch',
  foreignKey: 'id_branch_company'
});

BranchCompany.hasMany( IcecubeCommissionConfig, {
  as:         'icecube_commission_configs', 
  foreignKey: 'id_branch_company'
});

/** Scopes */
IcecubeCommissionConfig.addScope('defaultScope', {
  attributes: {
    exclude: ['id_branch_company', 'deleted_at']
  }
});

module.exports = IcecubeCommissionConfig;