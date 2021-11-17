export type CommissionIcebarType = {
  branch:             string,
  operator_assistant: SaleIcebarType,
  operator:           SaleIcebarType,
  assistant:          SaleIcebarType,
  commission:         number,
};

type SaleIcebarType = {
  quantity: number,
  price:    number,
};