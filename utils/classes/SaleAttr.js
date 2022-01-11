// @ts-check
/** @typedef { import('../types/ApiSectionType').ApiSection } ApiSection */

class SaleAttr {
  /** @type { ApiSection } */
  static SECTION = 'sales';
  static SALE_PAYMENTH_METHOD   = ['cash payment', 'credit payment'];
  static SALE_TYPE_MODIFICATION = ['discount', 'over price', 'without changes'];

  /** @type { { attr: string; type: string; }[] } */
  static filterable = [
    {
      attr: 'id',
      type: 'number'
    },
    {
      attr: 'branch_company',
      type: 'string'
    },
    {
      attr: 'client',
      type: 'string'
    },
    {
      attr: 'delivery_point_key',
      type: 'string'
    },
    {
      attr: 'delivery_point',
      type: 'string'
    },
    {
      attr: 'route_name',
      type: 'string'
    },
    {
      attr: 'operator',
      type: 'string'
    },
    {
      attr: 'assistant',
      type: 'string'
    },
    {
      attr: 'helper',
      type: 'string'
    },
    {
      attr: 'sales_folio',
      type: 'string'
    },
    {
      attr: 'date',
      type: 'date'
    },
    {
      attr: 'payment_method',
      type: 'string'
    },
    {
      attr: 'product',
      type: 'string'
    },
    {
      attr: 'type_product',
      type: 'string'
    },
    {
      attr: 'original_price',
      type: 'number'
    },
    {
      attr: 'quantity',
      type: 'number'
    },
    {
      attr: 'yield',
      type: 'number'
    },
    {
      attr: 'type_modification',
      type: 'string'
    },
    {
      attr: 'modified_price',
      type: 'number'
    },
    {
      attr: 'final_price',
      type: 'number'
    },
    {
      attr: 'bonification',
      type: 'boolean'
    },
  ];
};

module.exports = SaleAttr;