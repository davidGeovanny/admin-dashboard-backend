/** List of public attributes for searches and queries and key for cache */
const attrEmployees = {
  keys: {
    all: 'employees-all',
  },
  list: [
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
  ],
};

module.exports = {
  attrEmployees,
};