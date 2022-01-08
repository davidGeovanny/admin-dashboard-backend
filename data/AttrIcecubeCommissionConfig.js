/** List of public attributes for searches and queries and key for cache */
const attrIcecubeCommissionConfig = {
  keys: {
    all: '__icecube_commission_config__all__',
  },
  list: [
    {
      attr: 'id',
      type: 'number'
    },
    {
      attr: 'non_commissionable_kg',
      type: 'number'
    },
    {
      attr: 'percent_operator',
      type: 'number'
    },
    {
      attr: 'percent_assistant',
      type: 'number'
    },
    {
      attr: 'percent_operator_assistant',
      type: 'number'
    },
  ],
};

module.exports = {
  attrIcecubeCommissionConfig,
};