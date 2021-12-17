const db = require('../db/connection');
const { DataTypes } = require('sequelize');

const BranchCompany = require('./branch-company');

const IcebarCommissionConfig = db.define('IcebarCommissionConfig', {
  min_range: {
    type: DataTypes.DECIMAL(6, 3).UNSIGNED,
    allowNull: false,
    defaultValue: 0,
    validate: {
      customNull( value ) {
        if( !value && value !== 0 ) {
          throw new Error('Necesita proporcionar el rango mínimo');
        }
      },
      notNull : {
        msg: 'El rango mínimo no puede estar vacío'
      },
    }
  },
  max_range: {
    type: DataTypes.DECIMAL(6, 3).UNSIGNED,
    allowNull: false,
    defaultValue: 0,
    validate: {
      customNull( value ) {
        if( !value && value !== 0 ) {
          throw new Error('Necesita proporcionar el rango máximo');
        }
      },
      notNull : {
        msg: 'El rango máximo no puede estar vacío'
      },
    }
  },
  cost_bar_operator: {
    type: DataTypes.DECIMAL(6, 3).UNSIGNED,
    allowNull: false,
    defaultValue: 0,
    validate: {
      customNull( value ) {
        if( !value && value !== 0 ) {
          throw new Error('Necesita proporcionar el costo de barra para el operador');
        }
      },
      notNull : {
        msg: 'El costo de barra por operador no puede estar vacío'
      },
    }
  },
  cost_bar_assistant: {
    type: DataTypes.DECIMAL(6, 3).UNSIGNED,
    defaultValue: 0,
    validate: {
      customNull( value ) {
        if( !value && value !== 0 ) {
          throw new Error('Necesita proporcionar el costo de barra para el asistente');
        }
      },
    }
  },
  cost_bar_operator_assistant: {
    type: DataTypes.DECIMAL(6, 3).UNSIGNED,
    defaultValue: 0,
    validate: {
      customNull( value ) {
        if( !value && value !== 0 ) {
          throw new Error('Necesita proporcionar el costo de barra para el operador asistente');
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
  tableName:  'icebar_commission_config',
  timestamps: true,
  createdAt:  'created_at',
  updatedAt:  'updated_at',
  deletedAt:  'deleted_at',
  paranoid:   true,
});

/** Relations */
IcebarCommissionConfig.belongsTo( BranchCompany, {
  as:         'branch',
  foreignKey: 'id_branch_company'
});

BranchCompany.hasMany( IcebarCommissionConfig, {
  as:         'icebar_commission_configs', 
  foreignKey: 'id_branch_company'
});

/** Scopes */
IcebarCommissionConfig.addScope('defaultScope', {
  attributes: {
    exclude: ['id_branch_company', 'deleted_at']
  }
});

module.exports = IcebarCommissionConfig;