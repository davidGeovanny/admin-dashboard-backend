const Commissions = require('./commissions');
const {
  BranchCompany,
  IcebarCommissionConfig,
} = require('../models');

class CommissionIcebar extends Commissions {
  constructor() { super() }

  get commissionConfig() {
    return this._commissionConfig;
  }

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

  setEmployee = ( name, branch ) => {
    const sale  = { quantity: 0, price: 0 };
    const value = {
      branch,
      operator_assistant: sale,
      operator : sale,
      assistant: sale,
      commission: 0,
    };
    this._commissions.set( name, value );
  }

  calculateCommissions = () => {
    this._commissions.forEach( ( value, key ) => {
      const { operator_assistant, operator, assistant, branch } = value;
      const quantity = operator_assistant.quantity + operator.quantity + assistant.quantity;
      const price    = operator_assistant.price + operator.price + assistant.price;
      const average  = Math.round( price / quantity );

      const percent = this.getCommissionPercent( branch, average );

      this.setCommissionEmployee( key, percent, value );
    });
  }

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
            model: IcebarCommissionConfig,
            as: 'commissions',
            attributes: ['min_range', 'max_range', 'cost_bar_operator', 'cost_bar_assistant', 'cost_bar_operator_assistant'],
            order: [ ['min_range', 'ASC'] ]
          }
        ],
        attributes: ['branch']
      });
      
      this.setCommissionConfig( commissionsBranch );
    } catch ( err ) {
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

  getCommissionPercent = ( branch, average ) => {
    const emptyCommission = { operator: 0, assistant: 0, operator_assistant: 0 };

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

  getCommissionsToArray = () => {
    const array = Array.from( this._commissions, ( [ key, value ] ) => {
      return {
        employee: key.toUpperCase(),
        branch  : value.branch.toUpperCase(), 
        commission: parseFloat( value.commission.toFixed( 2 ) ),
      };
    });

    return array.filter( item => item.commission > 0 );
  }
}

module.exports = CommissionIcebar;