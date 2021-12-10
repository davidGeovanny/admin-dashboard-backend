// @ts-check
/**
 * @typedef { import('./types/commissions-type').IcebarCommissionType }       IcebarCommissionType
 * @typedef { import('./types/commissions-type').IcebarCommissionConfigType } IcebarCommissionConfigType
 * @typedef { import('./types/commissions-type').IcebarConfigType }           IcebarConfigType
 * @typedef { import('./types/commissions-type').IcebarSaleEmployeeType }     IcebarSaleEmployeeType
 * @typedef { import('./types/commissions-type').CommissionType }             CommissionType
 */
const {
  BranchCompany,
  IcebarCommissionConfig,
} = require('../models');

const { toTitleCase } = require('../helpers/capitalize');

class CommissionIcebar {
  constructor() {
    /** @type { Map<string, IcebarCommissionConfigType> } */
    this._commissionConfig = new Map();

    /** @type { Map<string, IcebarCommissionType> } */
    this._commissions = new Map();

    /** @type { string[] } */
    this._positions = ['operator', 'assistant', 'operator_assistant'];
  }

  get commissionConfig() {
    return this._commissionConfig;
  }

  /**
   * Add sale to employee.
   * @param { IcebarSaleEmployeeType } sale Sale information.
   */
  addSale = ({ branch, name, quantity, price, position }) => {
    branch = branch.toLowerCase();
    
    if( !this._positions.includes( position ) ) return;
    
    if( !this._commissions.has( name ) ) {
      this.setEmployee( name, branch );
    }

    const currentCommission    = this._commissions.get( name );
    const currentSalesPosition = currentCommission[ position ];

    this._commissions.set( name, {
      ...currentCommission,
      [ position ]: {
        ...currentSalesPosition,
        quantity: currentSalesPosition.quantity + quantity,
        price   : currentSalesPosition.price + price,
      }
    });
  }

  /**
   * Add new employee to commissions.
   * @param { string } name   Name of the employee.
   * @param { string } branch Branch to which the employee belongs.
   */
  setEmployee = ( name, branch ) => {
    const sale  = { quantity: 0, price: 0 };
    const value = {
      branch,
      operator_assistant: sale,
      operator:           sale,
      assistant:          sale,
      commission:         0,
    };
    this._commissions.set( name, value );
  }

  calculateCommissions = () => {
    this._commissions.forEach( ( value, key ) => {
      const { operator_assistant, operator, assistant, branch } = value;
      const quantity = operator_assistant.quantity + operator.quantity + assistant.quantity;
      const price    = operator_assistant.price + operator.price + assistant.price;
      const average  = Math.round( price / quantity );
      const percent  = this.getCommissionPercent( branch, average );

      this.setCommissionEmployee( key, percent, value );
    });
  }

  /**
   * Calculate employee commission based on commission percentage.
   * @param { string }               name    Name of the employee.
   * @param { IcebarConfigType }     percent Commission percent.
   * @param { IcebarCommissionType } value   Employee commissions based on their position.
   */
  setCommissionEmployee = ( name, percent, value ) => {
    if( !value ) {
      value = this._commissions.get( name );
    }

    const { operator_assistant, operator, assistant } = value;

    const commission = ( operator_assistant.quantity * percent.cost_bar_operator_assistant ) + 
                       ( operator.quantity  * percent.cost_bar_operator ) + 
                       ( assistant.quantity * percent.cost_bar_assistant );

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
            model:      IcebarCommissionConfig,
            as:         'commissions',
            attributes: ['min_range', 'max_range', 'cost_bar_operator', 'cost_bar_assistant', 'cost_bar_operator_assistant'],
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
      const { branch, commissions } = commission;
      
      if( !this._commissionConfig.has( branch.toLowerCase() ) ) {
        this._commissionConfig.set( branch.toLowerCase(), { commissions });
      }
    });
  }

  /**
   * Get the commission percentage according to the bars sold.
   * @param   { string } branch  Branch to which the employee belongs.
   * @param   { number } average Average number of icebar solds.
   * @returns { IcebarConfigType }
   */
  getCommissionPercent = ( branch, average ) => {
    /** @type { IcebarConfigType } */
    const emptyCommission = { cost_bar_operator: 0, cost_bar_assistant: 0, cost_bar_operator_assistant: 0, min_range: 0,  max_range: 0 };

    if( !this._commissionConfig.has( branch.toLowerCase() ) ) return emptyCommission;

    const { commissions } = this._commissionConfig.get( branch.toLowerCase() );

    const percent = commissions.find( ( commission, index ) => {
      if( average >= commission.min_range && average <= commission.max_range ) {
        return commission;
      }

      if( index === commissions.length - 1 ) {
        if( average >= commission.max_range ) {
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
        employee  : toTitleCase( key ),
        branch    : toTitleCase( value.branch ),
        commission: parseFloat( value.commission.toFixed( 2 ) ),
      };
    });

    return array.filter( item => item.commission > 0 );
  }
}

module.exports = CommissionIcebar;