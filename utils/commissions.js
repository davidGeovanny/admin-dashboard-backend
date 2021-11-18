/**
 * @typedef { import('./types/commissions-type').IcebarCommissionType } CommissionIcebarType
 * @typedef { import('./types/commissions-type').WaterCommissionType } CommissionWaterType
 * @typedef { import('./types/commissions-type').CommissionIcecubeType } CommissionIcecubeType
 */
class Commissions {
  constructor() {
    this._commissionConfig = new Map();

    /** @type {Map<string, CommissionWaterType | CommissionIcebarType | CommissionIcecubeType>} */
    this._commissions = new Map();

    this._positions = ['operator', 'assistant', 'operator_assistant'];
  }
}

module.exports = Commissions;