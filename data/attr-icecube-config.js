const attrIcecubeCommissionConfig = {
  keys: {
    all: 'icecube-commission-config-all',
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