// @ts-check
/** @typedef { import('../types/ApiSectionType').ApiSection } ApiSection */

class WaterCommissionConfigAttr {
  /** @type { ApiSection } */
  static SECTION = 'water_commission_configs';

  /** @type { { attr: string; type: string; }[] } */
  static filterable = [
    {
      attr: 'id',
      type: 'number'
    },
    {
      attr: 'percent_operator',
      type: 'number'
    },
    {
      attr: 'percent_assistant',
      type: 'number'
    },
    {
      attr: 'percent_operator_assistant',
      type: 'number'
    },
  ];
};

module.exports = WaterCommissionConfigAttr;