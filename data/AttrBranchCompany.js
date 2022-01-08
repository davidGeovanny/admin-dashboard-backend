/** List of public attributes for searches and queries and key for cache */
const attrBranchesCompany = {
  keys: {
    all: '__branches_company__all__',
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