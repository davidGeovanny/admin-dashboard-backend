class Commissions {
  constructor() {
    this._commissionConfig = new Map();
    this._commissions      = new Map();

    this._positions = ['operator', 'assistant', 'operator_assistant'];
  }
}

module.exports = Commissions;