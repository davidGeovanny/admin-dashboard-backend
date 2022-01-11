// @ts-check
/** @typedef { import('../types/api-section-types').ApiSection } ApiSection */

class BranchCompanyAttr {
  /** @type { ApiSection } */
  static SECTION = 'branches_company';
  static STATUS  = ['activated', 'disabled'];


  /** @type { { attr: string; type: string; }[] } */
  static filterable = [
    {
      attr: 'id',
      type: 'number'
    },
    {
      attr: 'branch',
      type: 'string'
    },
    {
      attr: 'status',
      type: 'string'
    },
  ];
};

module.exports = BranchCompanyAttr;