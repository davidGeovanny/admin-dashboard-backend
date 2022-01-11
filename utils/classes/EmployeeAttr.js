// @ts-check
/** @typedef { import('../types/ApiSectionType').ApiSection } ApiSection */

class EmployeeAttr {
  /** @type { ApiSection } */
  static SECTION = 'employees';
  static GENDERS = ['male', 'female', 'undefined'];

  /** @type { { attr: string; type: string; }[] } */
  static filterable = [
    {
      attr: 'id',
      type: 'number'
    },
    {
      attr: 'name',
      type: 'string'
    },
    {
      attr: 'first_lastname',
      type: 'string'
    },
    {
      attr: 'second_lastname',
      type: 'string'
    },
    {
      attr: 'gender',
      type: 'string'
    },
    {
      attr: 'email',
      type: 'string'
    },
  ];
};

module.exports = EmployeeAttr;