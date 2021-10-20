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
          throw new Error('Need to provide a min_range');
        }
      },
      notNull : {
        msg: "min_range can't be null"
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
          throw new Error('Need to provide a max_range');
        }
      },
      notNull : {
        msg: "max_range can't be null"
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
          throw new Error('Need to provide a cost_bar_operator');
        }
      },
      notNull : {
        msg: "cost_bar_operator can't be null"
      },
    }
  },
  cost_bar_assistant: {
    type: DataTypes.DECIMAL(6, 3).UNSIGNED,
    defaultValue: 0,
    validate: {
      customNull( value ) {
        if( !value && value !== 0 ) {
          throw new Error('Need to provide a cost_bar_assistant');
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
          throw new Error('Need to provide a cost_bar_operator_assistant');
        }
      },
    }
  },
});

module.exports = IcebarCommissionConfig;