// @ts-check
/**
 * @typedef { import('./types/CommissionType').DeliveryPointCommissionType }				DeliveryPointCommissionType
 * @typedef { import('./types/CommissionType').DeliveryPointCommissionConfigType } 	DeliveryPointCommissionConfigType
 * @typedef { import('./types/CommissionType').DeliveryPointConfigType }						DeliveryPointConfigType
 * @typedef { import('./types/CommissionType').DeliveryPointSaleEmployeeType }			DeliveryPointSaleEmployeeType
 * @typedef { import('./types/CommissionType').CommissionType }											CommissionType
 */
const {
    BranchCompany,
    DeliveryPointCommissionConfig,
  } = require('../models');
  
  const { toUpperCaseWords } = require('../helpers/Capitalize');
const ProductType = require('../models/ProductType');
  
  class CommissionDeliveryPoint {
    constructor() {
      /** @type { Map<string, DeliveryPointCommissionConfigType> } */
      this._commissionConfig = new Map();
  
      /** @type { Map<string, DeliveryPointCommissionType> } */
      this._commissions = new Map();
    }
  
    get commissionConfig() {
      return this._commissionConfig;
    }
  
    /**
     * Add sale to employee.
     * @param { DeliveryPointSaleEmployeeType } sale Sale information.
     */
    addSale = ({ branch, name, price, type_product }) => {
      branch = branch.toLowerCase();
      
      if( !this._commissions.has( name ) ) {
        this.setEmployee( name, branch );
      }
  
      const currentCommission = this._commissions.get( name );

      let property = 'total_accumulated_water';

      if( type_product.toLowerCase() === 'barra' ) {
        property = 'total_accumulated_icebar';
      } else if( type_product.toLowerCase() === 'cubo' ) {
        property = 'total_accumulated_icecube';
      }

      this._commissions.set( name, {
        ...currentCommission,
        [property]: currentCommission[property] + price
      });
    }
  
    /**
     * Add new employee to commissions.
     * @param { string } name   Name of the employee.
     * @param { string } branch Branch to which the employee belongs.
     */
    setEmployee = ( name, branch ) => {
      const value = {
        branch,
        total_accumulated_water:    0.0,
        total_accumulated_icebar:   0.0,
        total_accumulated_icecube:  0.0,
        commission_water:           0.0,
        commission_icebar:          0.0,
        commission_icecube:         0.0,
      };
      this._commissions.set( name, value );
    }
  
    calculateCommissions = () => {
      this._commissions.forEach( ( value, key ) => {
        const { total_accumulated_water, branch, } = value;
        let percent  = this.getCommissionPercent( branch, total_accumulated_water, 'AGUA EMBOTELLADA' );
        this.setCommissionEmployee( key, percent, value, 'water' );
      });

      this._commissions.forEach( ( value, key ) => {
        const { total_accumulated_icebar, branch, } = value;
        let percent = this.getCommissionPercent( branch, total_accumulated_icebar, 'BARRA' );
        this.setCommissionEmployee( key, percent, value, 'icebar' );
      });

      this._commissions.forEach( ( value, key ) => {
        const { total_accumulated_icecube, branch, } = value;
        let percent  = this.getCommissionPercent( branch, total_accumulated_icecube, 'CUBO' );
        this.setCommissionEmployee( key, percent, value, 'icecube' );
      });
    }
  
    /**
     * Calculate employee commission based on commission percentage.
     * @param { string }											name    Name of the employee.
     * @param { DeliveryPointConfigType }			percent Commission percent.
     * @param { DeliveryPointCommissionType }	value   Employee commissions based on their position.
     */
    setCommissionEmployee = ( name, percent, value, type ) => {
      if( !value ) {
        value = this._commissions.get( name );
      }
  
      const { total_accumulated_water, total_accumulated_icebar, total_accumulated_icecube } = value;

      let commission = 0;
      let property = 'commission_water';

      if ( type === 'water' ) {
        commission = total_accumulated_water * percent.percent;
      } else if ( type === 'icebar' ) {
        commission = total_accumulated_icebar * percent.percent;
        property = 'commission_icebar';
      } else if ( type === 'icecube' ) {
        commission = total_accumulated_icecube * percent.percent;
        property = 'commission_icecube';
      }

      this._commissions.set( name, {
        ...value,
        [property]: commission
      });
    }
  
    findCommissionConfig = async () => {
      try {
        const commissionsBranch = await BranchCompany.findAll({
          include: [
            {
              model:      DeliveryPointCommissionConfig,
              as:         'delivery_point_commission_configs',
              attributes: ['min_range', 'max_range', 'percent'],
              order:      [ ['min_range', 'ASC'] ],
              include: [
                {
                  model: ProductType,
                  as: 'product_type',
                  attributes: ['type_product']
                }
              ]
            }
          ],
          attributes: ['branch']
        });
        
        this.setCommissionConfig( commissionsBranch );
      } catch ( err ) {
        this.setCommissionConfig([]);
      }
    }
    
    setCommissionConfig = ( commissions = [] ) => {
      commissions.forEach( commission => {
        const { branch, delivery_point_commission_configs } = commission;
        
        if( !this._commissionConfig.has( branch.toLowerCase() ) ) {
          this._commissionConfig.set( branch.toLowerCase(), { delivery_point_commission_configs });
        }
      });
    }
  
    /**
     * Get the commission percentage according to the products sold per delivery pouint.
     * @param   { string } branch							Branch to which the employee belongs.
     * @param   { number } total_accumulated	Total price of sold products.
     * @param   { string } type_product				Type of product sold.
     * @returns { DeliveryPointConfigType }
     */
    getCommissionPercent = ( branch, total_accumulated, type_product ) => {
      /** @type { DeliveryPointConfigType } */
      const emptyCommission = { percent: 0.0, min_range: 0,  max_range: 0, id_product_type: 0, type_product: '' };
  
      if( !this._commissionConfig.has( branch.toLowerCase() ) ) return emptyCommission;
  
      const { delivery_point_commission_configs } = this._commissionConfig.get( branch.toLowerCase() );
  
      const percent = delivery_point_commission_configs.find( ( commission, index ) => {
        if( total_accumulated >= commission.min_range && total_accumulated <= commission.max_range && commission.product_type.type_product.toLowerCase() === type_product.toLowerCase() ) {
          return commission;
        }
  
        if( index === delivery_point_commission_configs.length - 1 ) {
          if( total_accumulated >= commission.max_range ) {
            return commission;
          } else {
            return emptyCommission;
          }
        }
      });
      return percent;
    }
  
    /**
     * Transform Map to Array.
     * @returns { CommissionType[] }
     */
    getCommissionsToArray = () => {
      const array = Array.from( this._commissions, ( [ key, value ] ) => {
        return {
          employee  : toUpperCaseWords( key ),
          branch    : toUpperCaseWords( value.branch ),
          commission: parseFloat(
            (value.commission_water + value.commission_icebar + value.commission_icecube).toFixed( 2 )
          ),
        };
      });
  
      return array.filter( item => item.commission > 0 );
    }
  }
  
  module.exports = CommissionDeliveryPoint;