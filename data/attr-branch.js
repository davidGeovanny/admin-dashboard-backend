/** List of public attributes for searches and queries and key for cache */
const attrBranchesCompany = {
  keys: {
    all: 'branches-company-all',
  },
  list: [
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
  ],
};

module.exports = {
  attrBranchesCompany,
};