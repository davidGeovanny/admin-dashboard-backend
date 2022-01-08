/** List of public attributes for searches and queries and key for cache */
const attrUsers = {
  keys: {
    all: '__users_all__',
  },
  list: [
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
  ],
};

module.exports = {
  attrUsers,
};