// @ts-check
/** @typedef { import('../types/ApiSectionType').ApiSection } ApiSection */

class DeliveryPointCommissionConfigAttr {
  /** @type { ApiSection } */
  static SECTION = 'delivery_point_commission_configs';

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
      attr: 'percent',
      type: 'number'
    },
  ];
};

module.exports = DeliveryPointCommissionConfigAttr;