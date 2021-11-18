/** Water */
export type WaterCommissionType = {
  branch:     string;
  commission: number;
};

export type WaterCommissionConfigType = {
  percent_operator:           number;
  percent_assistant:          number;
  percent_operator_assistant: number;
};

/** Icebar */
export type IcebarCommissionType = {
  branch:             string;
  operator_assistant: IcebarSaleType;
  operator:           IcebarSaleType;
  assistant:          IcebarSaleType;
  commission:         number;
};

type IcebarSaleType = {
  quantity: number;
  price:    number;
};

export type IcebarSaleEmployeeType = {
  branch:   string,
  name:     string,
  quantity: number,
  price:    number,
  position: string,
}

export type IcebarCommissionConfigType = {
  commissions: IcebarConfigType[];
}

export type IcebarConfigType = {
  min_range:                   number;
  max_range:                   number;
  cost_bar_operator:           number;
  cost_bar_assistant:          number;
  cost_bar_operator_assistant: number;
}

/** Icecube */
export type IcecubeCommissionType = {
  branch:     string;
  quantity:   IcecubeQuantityType;
  commission: number;
};

type IcecubeQuantityType = {
  kg:    number;
  price: number;
};

export type IcecubeCommissionConfigType = {
  non_commissionable_kg:      number;
  percent_operator:           number;
  percent_assistant:          number;
  percent_operator_assistant: number;
};

/** General */
export type CommissionType = {
  branch:     string;
  employee:   string;
  commission: number;
};