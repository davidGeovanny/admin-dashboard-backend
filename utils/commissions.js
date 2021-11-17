class Commissions {
  constructor() {
    this._commissionConfig = new Map();

    /** @type {Map<string, import('./types/commissions-type').CommissionIcebarType>} */
    this._commissions = new Map();

    this._positions = ['operator', 'assistant', 'operator_assistant'];
  }
}

module.exports = Commissions;