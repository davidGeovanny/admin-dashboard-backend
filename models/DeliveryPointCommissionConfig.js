const db = require('../db/Connection');
const { DataTypes } = require('sequelize');

const BranchCompany = require('./BranchCompany');
const ProductType = require('./ProductType');

const DeliveryPointCommissionConfig = db.define('DeliveryPointCommissionConfig', {
  min_range: {
    type: DataTypes.INTEGER.UNSIGNED,
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
    type: DataTypes.INTEGER.UNSIGNED,
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
  percent: {
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
        msg: 'El porcentaje de comisión no puede estar vacío'
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
  tableName:  'delivery_point_commission_config',
  timestamps: true,
  createdAt:  'created_at',
  updatedAt:  'updated_at',
  deletedAt:  'deleted_at',
  paranoid:   true,
});

/** Relations */
DeliveryPointCommissionConfig.belongsTo( BranchCompany, {
  as:         'branch',
  foreignKey: 'id_branch_company'
});

DeliveryPointCommissionConfig.belongsTo( ProductType, {
  as:         'product_type',
  foreignKey: 'id_type_product'
});

BranchCompany.hasMany( DeliveryPointCommissionConfig, {
  as:         'delivery_point_commission_configs', 
  foreignKey: 'id_branch_company'
});

ProductType.hasMany( DeliveryPointCommissionConfig, {
  as:         'delivery_point_commission_configs', 
  foreignKey: 'id_type_product'
});

/** Scopes */
DeliveryPointCommissionConfig.addScope('defaultScope', {
  attributes: {
    // exclude: ['id_branch_company', 'deleted_at']
    exclude: ['deleted_at']
  }
});

module.exports = DeliveryPointCommissionConfig;