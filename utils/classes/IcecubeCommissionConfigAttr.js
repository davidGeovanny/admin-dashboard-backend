// @ts-check
/** @typedef { import('../types/api-section-types').ApiSection } ApiSection */

class IcecubeCommissionConfigAttr {
  /** @type { ApiSection } */
  static SECTION = 'icecube_commission_configs';

  /** @type { { attr: string; type: string; }[] } */
  static filterable = [
    {
      attr: 'id',
      type: 'number'
    },
    {
      attr: 'non_commissionable_kg',
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

module.exports = IcecubeCommissionConfigAttr;