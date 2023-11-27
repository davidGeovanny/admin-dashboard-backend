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
    addSale = ({ branch, name, price }) => {
      branch = branch.toLowerCase();
      
      if( !this._commissions.has( name ) ) {
        this.setEmployee( name, branch );
      }
  
      const currentCommission = this._commissions.get( name );
  
      this._commissions.set( name, {
        ...currentCommission,
        total_accumulated: currentCommission.total_accumulated + price,
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
        total_accumulated:  0.0,
        commission:         0.0,
      };
      this._commissions.set( name, value );
    }
  
    calculateCommissions = () => {
      this._commissions.forEach( ( value, key ) => {
        const { total_accumulated, branch } = value;
        const percent  = this.getCommissionPercent( branch, total_accumulated );

        this.setCommissionEmployee( key, percent, value );
      });
    }
  
    /**
     * Calculate employee commission based on commission percentage.
     * @param { string }											name    Name of the employee.
     * @param { DeliveryPointConfigType }			percent Commission percent.
     * @param { DeliveryPointCommissionType }	value   Employee commissions based on their position.
     */
    setCommissionEmployee = ( name, percent, value ) => {
      if( !value ) {
        value = this._commissions.get( name );
      }
  
      const { total_accumulated } = value;
      const commission = total_accumulated * percent.percent;

      this._commissions.set( name, {
        ...value,
        commission
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
              order:      [ ['min_range', 'ASC'] ]
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
     * @returns { DeliveryPointConfigType }
     */
    getCommissionPercent = ( branch, total_accumulated ) => {
      /** @type { DeliveryPointConfigType } */
      const emptyCommission = { percent: 0.0, min_range: 0,  max_range: 0 };
  
      if( !this._commissionConfig.has( branch.toLowerCase() ) ) return emptyCommission;
  
      const { delivery_point_commission_configs } = this._commissionConfig.get( branch.toLowerCase() );
  
      const percent = delivery_point_commission_configs.find( ( commission, index ) => {
        if( total_accumulated >= commission.min_range && total_accumulated <= commission.max_range ) {
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
          commission: parseFloat( value.commission.toFixed( 2 ) ),
        };
      });
  
      return array.filter( item => item.commission > 0 );
    }
  }
  
  module.exports = CommissionDeliveryPoint;