// @ts-check
/**
 * @typedef { import('./types/commissions-type').IcecubeCommissionType }       IcecubeCommissionType
 * @typedef { import('./types/commissions-type').IcecubeCommissionConfigType } IcecubeCommissionConfigType
 * @typedef { import('./types/commissions-type').CommissionType }              CommissionType
 */
const {
  BranchCompany,
  IcecubeCommissionConfig,
} = require('../models');

const { toTitleCase } = require('../helpers/Capitalize');

class CommissionIcecube {
  constructor() {
    /** @type { Map<string, IcecubeCommissionConfigType> } */
    this._commissionConfig = new Map();

    /** @type { Map<string, IcecubeCommissionType> } */
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
   * @param { number } quantity Quantity of kg sold.
   * @param { string } position Employee's position in the sale.
   */
  addSale = ( branch, name, quantity, position ) => {
    branch = branch.toLowerCase();
    
    if( !this._positions.includes( position ) ) return;
    
    if( !this._commissions.has( name ) ) {
      this.setEmployee( name, branch );
    }

    const percent = this.getCommissionPercent( branch, position );
    const currentCommission = this._commissions.get( name );
    const { kg, price }     = currentCommission.quantity;

    this._commissions.set( name, {
      ...currentCommission,
      quantity: {
        kg   : kg    + quantity,
        price: price + ( quantity * percent )
      }
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
      quantity:   { kg: 0, price: 0 },
      commission: 0,
    };
    
    this._commissions.set( name, value );
  }

  calculateCommissions = () => {
    this._commissions.forEach( ( value, key ) => {
      const nonCommissionableKg = this.getNonCommissionsableKg( value.branch );
      const { kg, price } = value.quantity;

      if( kg > nonCommissionableKg ) {
        this._commissions.set( key, {
          ...value,
          commission: parseFloat( ( ( ( kg - nonCommissionableKg ) * price ) / kg ).toFixed( 2 ) ),
        });
      }
    });
  }

  findCommissionConfig = async () => {
    const commissionsBranch = await IcecubeCommissionConfig.findAll({
      include: [
        {
          model     : BranchCompany,
          as        : 'branch',
          attributes: []
        }
      ],
      attributes: [
        'non_commissionable_kg', 
        'percent_operator', 
        'percent_assistant', 
        'percent_operator_assistant', 
        'branch.branch'
      ],
      raw: true,
    });

    this.setCommissionConfig( commissionsBranch );
  }

  setCommissionConfig = ( commissions = [] ) => {
    commissions.forEach( commission => {
      const { branch, percent_operator, percent_assistant, percent_operator_assistant, non_commissionable_kg } = commission;
      
      if( !this._commissionConfig.has( branch.toLowerCase() ) ) {
        this._commissionConfig.set( branch.toLowerCase(), {
          percent_operator,
          percent_assistant,
          percent_operator_assistant,
          non_commissionable_kg,
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
   * Returns the amount of non-commissionable kg for the commission.
   * @param   { string } branch Branch to which the employee belongs.
   * @returns { number }
   */
  getNonCommissionsableKg = ( branch ) => {
    if( !this._commissionConfig.has( branch.toLowerCase() ) ) return 0;

    const { non_commissionable_kg } = this._commissionConfig.get( branch.toLowerCase() );
    return non_commissionable_kg;
  }

  /**
   * Transform Map to Array.
   * @returns { CommissionType[] }
   */
  getCommissionsToArray = () => {
    const array = Array.from( this._commissions, ( [ key, value ] ) => {
      return {
        employee  : toTitleCase( key ),
        branch    : toTitleCase( value.branch ),
        commission: parseFloat( value.commission.toFixed( 2 ) ),
      };
    });

    return array.filter( item => item.commission > 0 );
  }
}

module.exports = CommissionIcecube;