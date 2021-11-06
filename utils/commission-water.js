const Commissions = require('./commissions');
const {
  BranchCompany,
  WaterCommissionConfig,
} = require('../models');

class CommissionWater extends Commissions {
  constructor() { super() }

  get commissionConfig() {
    return this._commissionConfig;
  }

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

  getCommissionPercent = ( branch, position ) => {
    if( !this._commissionConfig.has( branch.toLowerCase() ) ) return 0;

    const { percent_operator, percent_assistant, percent_operator_assistant } = this._commissionConfig.get( branch.toLowerCase() );

    switch ( position ) {
      case 'operator':
        return parseFloat( percent_operator );

      case 'assistant':
        return parseFloat( percent_assistant );

      case 'operator_assistant':
        return parseFloat( percent_operator_assistant | percent_operator );
    }
  }

  getCommissionsToArray = () => {
    const array = Array.from( this._commissions, ( [ key, value ] ) => {
      return {
        employee: key.toLowerCase(),
        ...value,
        commission: parseFloat( value.commission.toFixed( 2 ) ),
      };
    });

    return array.filter( item => item.commission > 0 );
  }
}

module.exports = CommissionWater;