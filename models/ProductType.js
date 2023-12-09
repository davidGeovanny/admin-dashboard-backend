const db = require('../db/Connection');
const { DataTypes } = require('sequelize');

const ProductTypeAttr = require('../utils/classes/ProductTypeAttr');

const ProductType = db.define('ProductType', {
  type_product: {
    type      : DataTypes.STRING,
    allowNull : false,
    validate  : {
      customNull( value ) {
        if( !value ) {
          throw new Error('Necesita proporcionar el nombre del tipo de producto');
        }
      },
      notNull: {
        msg: 'El nombre del tipo de producto no puede estar vacío'
      },
    },
    set( value ) {
      this.setDataValue( 'type_product', value.toUpperCase() );
    },
  },
}, {
  tableName: 'product_types',
  timestamps: true,
  createdAt : 'created_at',
  updatedAt : 'updated_at',
  deletedAt : 'deleted_at',
  paranoid  : true,
});

ProductType.addScope('defaultScope', {
  attributes: {
    exclude: ['deleted_at']
  }
});

module.exports = ProductType;