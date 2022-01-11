// @ts-check
/** @typedef { import('../types/ApiSectionType').ApiSection } ApiSection */

class UserAttr {
  /** @type { ApiSection } */
  static SECTION = 'users';
  static STATUS  = ['activated', 'disabled', 'waiting activation'];

  /** @type { { attr: string; type: string; }[] } */
  static filterable = [
    {
      attr: 'id',
      type: 'number'
    },
    {
      attr: 'username',
      type: 'string'
    },
    {
      attr: 'status',
      type: 'string'
    },
  ];
};

module.exports = UserAttr;