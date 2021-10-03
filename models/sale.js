/** No usar */

const INCREMENTATION = 100000;

const db = require('../db/connection');
const { DataTypes } = require('sequelize');
const { salePaymentMethod, saleTypeModification } = require('../data/static-data');

const Sale = db.define('Sale', {
  branch_company: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      customNull( value ) {
        if( !value ) {
          throw new Error('Need to provide a branch_company');
        }
      },
      notNull: {
        msg: "Branch company can't be null"
      },
    }
  },
  client: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      customNull( value ) {
        if( !value ) {
          throw new Error('Need to provide a client');
        }
      },
      notNull: {
        msg: "client can't be null"
      },
    }
  },
  delivery_point_key: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      customNull( value ) {
        if( !value ) {
          throw new Error('Need to provide a delivery_point_key');
        }
      },
      notNull: {
        msg: "delivery_point_key can't be null"
      },
    }
  },
  delivery_point: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      customNull( value ) {
        if( !value ) {
          throw new Error('Need to provide a delivery_point');
        }
      },
      notNull: {
        msg: "delivery_point can't be null"
      },
    }
  },
  route_name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      customNull( value ) {
        if( !value ) {
          throw new Error('Need to provide a route_name');
        }
      },
      notNull: {
        msg: "route_name can't be null"
      },
    }
  },
  sales_folio: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      customNull( value ) {
        if( !value ) {
          throw new Error('Need to provide a sales_folio');
        }
      },
      notNull: {
        msg: "sales_folio can't be null"
      },
    }
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      customNull( value ) {
        if( !value ) {
          throw new Error('Need to provide a date');
        }
      },
      notNull: {
        msg: "date can't be null"
      },
    }
  },
  hour: {
    type: DataTypes.TIME,
    allowNull: false,
    validate: {
      customNull( value ) {
        if( !value ) {
          throw new Error('Need to provide a date');
        }
      },
      notNull: {
        msg: "hour can't be null"
      },
    }
  },
  payment_method: {
    type: DataTypes.ENUM( salePaymentMethod ),
    validate: {
      isIn: {
        args: [ salePaymentMethod ],
        msg : 'Payment method is not valid'
      }
    }
  },
  product: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      customNull( value ) {
        if( !value ) {
          throw new Error('Need to provide a product');
        }
      },
      notNull: {
        msg: "product can't be null"
      },
    }
  },
  original_price: {
    type: DataTypes.BIGINT,
    allowNull: false,
    validate: {
      customNull( value ) {
        if( !value ) {
          throw new Error('Need to provide a original_price');
        }
      },
      notNull: {
        msg: "original_price can't be null"
      },
    }
  },
  quantity: {
    type: DataTypes.MEDIUMINT,
    allowNull: false,
    validate: {
      customNull( value ) {
        if( !value ) {
          throw new Error('Need to provide a quantity');
        }
      },
      notNull: {
        msg: "quantity can't be null"
      },
    }
  },
  type_modification: {
    type: DataTypes.ENUM( saleTypeModification ),
    validate: {
      isIn: {
        args: [ saleTypeModification ],
        msg : 'price modification type is invalid'
      }
    }
  },
  modified_price: {
    type: DataTypes.BIGINT,
    allowNull: false,
    validate: {
      customNull( value ) {
        if( !value ) {
          throw new Error('Need to provide a modified_price');
        }
      },
      notNull: {
        msg: "modified_price can't be null"
      },
    }
  },
  final_price: {
    type: DataTypes.BIGINT,
    allowNull: false,
    validate: {
      customNull( value ) {
        if( !value ) {
          throw new Error('Need to provide a final_price');
        }
      },
      notNull: {
        msg: "final_price can't be null"
      },
    }
  },
  bonification: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    validate: {
      customNull( value ) {
        if( !value ) {
          throw new Error('Need to provide a bonification');
        }
      },
      notNull: {
        msg: "bonification can't be null"
      },
    }
  },
}, {
  timestamps: true,
  createdAt : 'created_at',
  updatedAt : 'updated_at',
  deletedAt : 'deleted_at',
  paranoid  : true,
});

Sale.addScope('defaultScope', {
  attributes: {
    exclude: ['deleted_at']
  }
});

Sale.beforeCreate( ( sale ) => {
  sale.original_price = sale.original_price * INCREMENTATION;
  sale.original_price = sale.original_price * INCREMENTATION;
  sale.original_price = sale.original_price * INCREMENTATION;
  sale.original_price = sale.original_price * INCREMENTATION;
});

Sale.beforeBulkCreate( ( sales ) => {
  sales.map( sale => {
    sale.original_price = sale.original_price * INCREMENTATION;
    sale.quantity       = sale.quantity       * INCREMENTATION;
    sale.modified_price = sale.modified_price * INCREMENTATION;
    sale.final_price    = sale.final_price    * INCREMENTATION;

    return sale;
  });
});

Sale.afterBulkCreate( ( sales ) => {
  sales.map( sale => {
    sale.original_price = sale.original_price / INCREMENTATION;
    sale.quantity       = sale.quantity       / INCREMENTATION;
    sale.modified_price = sale.modified_price / INCREMENTATION;
    sale.final_price    = sale.final_price    / INCREMENTATION;

    return sale;
  });
});

// Sale.afterFind( ( sale ) => {
//   sale.original_price = sale.original_price / INCREMENTATION;
//   sale.original_price = sale.original_price / INCREMENTATION;
//   sale.original_price = sale.original_price / INCREMENTATION;
//   sale.original_price = sale.original_price / INCREMENTATION;
// });

module.exports = Sale;