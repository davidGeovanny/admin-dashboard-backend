/** List of public attributes for searches and queries and key for cache */
const attrIcebarCommissionConfig = {
  keys: {
    all: '__icebar_commission_config__all__',
  },
  list: [
    {
      attr: 'id',
      type: 'number'
    },
    {
      attr: 'min_range',
      type: 'number'
    },
    {
      attr: 'max_range',
      type: 'number'
    },
    {
      attr: 'cost_bar_operator',
      type: 'number'
    },
    {
      attr: 'cost_bar_assistant',
      type: 'number'
    },
    {
      attr: 'cost_bar_operator_assistant',
      type: 'number'
    },
  ],
};

module.exports = {
  attrIcebarCommissionConfig,
};