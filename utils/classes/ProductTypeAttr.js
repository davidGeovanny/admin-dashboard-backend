// @ts-check
/** @typedef { import('../types/ApiSectionType').ApiSection } ApiSection */

class ProductTypeAttr {
    /** @type { ApiSection } */
    static SECTION = 'product_types';
  
    /** @type { { attr: string; type: string; }[] } */
    static filterable = [
      {
        attr: 'id',
        type: 'number'
      },
      {
        attr: 'type_product',
        type: 'string'
      },
    ];
  };
  
  module.exports = ProductTypeAttr;