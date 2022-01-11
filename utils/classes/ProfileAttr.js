// @ts-check
/** @typedef { import('../types/ApiSectionType').ApiSection } ApiSection */

class ProfileAttr {
  /** @type { ApiSection } */
  static SECTION = 'profiles';
  static STATUS  = ['activated', 'disabled'];

  /** @type { { attr: string; type: string; }[] } */
  static filterable = [
    {
      attr: 'id',
      type: 'number'
    },
    {
      attr: 'profile',
      type: 'string'
    },
    {
      attr: 'status',
      type: 'string'
    },
  ];
};

module.exports = ProfileAttr;