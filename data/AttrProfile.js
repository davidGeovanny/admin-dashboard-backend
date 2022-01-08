/** List of public attributes for searches and queries and key for cache */
const attrProfiles = {
  keys: {
    all: '__profiles_all__',
  },
  list: [
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
  ],
};

module.exports = {
  attrProfiles,
};