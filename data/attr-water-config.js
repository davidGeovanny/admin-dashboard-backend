const attrWaterCommissionConfig = {
  keys: {
    all: 'water-commission-config-all',
  },
  list: [
    {
      attr: 'id',
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
  attrWaterCommissionConfig,
};