// @ts-check
/** @typedef { import('../types/api-section-types').ApiSection } ApiSection */

class IcebarCommissionConfigAttr {
  /** @type { ApiSection } */
  static SECTION = 'icebar_commission_configs';

  /** @type { { attr: string; type: string; }[] } */
  static filterable = [
    {
      attr: 'id',
      type: 'number'
    },
    {
      attr: 'min_range',
      type: 'number'
    },
    {
      attr: 'max_range',
      type: 'number'
    },
    {
      attr: 'cost_bar_operator',
      type: 'number'
    },
    {
      attr: 'cost_bar_assistant',
      type: 'number'
    },
    {
      attr: 'cost_bar_operator_assistant',
      type: 'number'
    },
  ];
};

module.exports = IcebarCommissionConfigAttr;