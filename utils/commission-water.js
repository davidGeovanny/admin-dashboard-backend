// @ts-check
/**
 * @typedef { import('./types/commissions-type').WaterCommissionType }       WaterCommissionType
 * @typedef { import('./types/commissions-type').WaterCommissionConfigType } WaterCommissionConfigType
 * @typedef { import('./types/commissions-type').CommissionType }            CommissionType
 */
const {
  BranchCompany,
  WaterCommissionConfig,
} = require('../models');

const { toTitleCase } = require('../helpers/Capitalize');

class CommissionWater {
  constructor() {
    /** @type { Map<string, WaterCommissionConfigType> } */
    this._commissionConfig = new Map();

    /** @type { Map<string, WaterCommissionType> } */
    this._commissions = new Map();

    /** @type { string[] } */
    this._positions = ['operator', 'assistant', 'operator_assistant'];
  }

  get commissionConfig() {
    return this._commissionConfig;
  }

  /**
   * Add sale to employee.
   * @param { string } branch   Branch company name.
   * @param { string } name     Name of the employee.
   * @param { number } price    Final sale price.
   * @param { string } position Employee's position in the sale.
   */
  addSale = ( branch, name, price, position ) => {
    branch = branch.toLowerCase();
    
    if( !this._positions.includes( position ) ) return;
    
    if( !this._commissions.has( name ) ) {
      this.setEmployee( name, branch );
    }

    const percent = this.getCommissionPercent( branch, position );
    const currentCommission = this._commissions.get( name );

    this._commissions.set( name, {
      ...currentCommission,
      commission: currentCommission.commission + ( price * percent ),
    });
  }

  /**
   * Add new employee to commissions.
   * @param { string } name   Name of the employee.
   * @param { string } branch Branch to which the employee belongs.
   */
  setEmployee = ( name, branch ) => {
    const value = { branch, commission: 0, };
    this._commissions.set( name, value );
  }
  
  findCommissionConfig = async () => {
    try {
      const commissionsBranch = await WaterCommissionConfig.findAll({
        include: [
          {
            model     : BranchCompany,
            as        : 'branch',
            attributes: []
          }
        ],
        attributes: [
          'percent_operator', 
          'percent_assistant', 
          'percent_operator_assistant', 
          'branch.branch'
        ],
        raw: true,
      });
  
      this.setCommissionConfig( commissionsBranch );
    } catch ( err ) {
      this.setCommissionConfig( [] );
    }
  }

  setCommissionConfig = ( commissions = [] ) => {
    commissions.forEach( commission => {
      const { branch, percent_operator, percent_assistant, percent_operator_assistant } = commission;
      
      if( !this._commissionConfig.has( branch.toLowerCase() ) ) {
        this._commissionConfig.set( branch.toLowerCase(), {
          percent_operator,
          percent_assistant,
          percent_operator_assistant,
        });
      }
    });
  }

  /**
   * Returns the commission percentage for the sale.
   * @param   { string } branch   Branch to which the employee belongs.
   * @param   { string } position Employee's position in the sale.
   * @returns { number }
   */
  getCommissionPercent = ( branch, position ) => {
    if( !this._commissionConfig.has( branch.toLowerCase() ) ) return 0;

    const { percent_operator, percent_assistant, percent_operator_assistant } = this._commissionConfig.get( branch.toLowerCase() );

    switch ( position ) {
      case 'operator':
        return percent_operator;

      case 'assistant':
        return percent_assistant;

      case 'operator_assistant':
        return percent_operator_assistant || percent_operator;
    }
  }

  /**
   * Transform Map to Array.
   * @returns { CommissionType[] }
   */
  getCommissionsToArray = () => {
    const array = Array.from( this._commissions, ( [ key, value ] ) => {
      return {
        ...value,
        employee  : toTitleCase( key ),
        branch    : toTitleCase( value.branch ),
        commission: parseFloat( value.commission.toFixed( 2 ) ),
      };
    });

    return array.filter( item => item.commission > 0 );
  }
}

module.exports = CommissionWater;