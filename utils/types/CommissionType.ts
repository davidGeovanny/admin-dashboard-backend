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
  icebar_commission_configs: IcebarConfigType[];
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

/** Delivery Point */
export type DeliveryPointCommissionType = {
  branch:                     string;
  total_accumulated_water:    number;
  total_accumulated_icebar:   number;
  total_accumulated_icecube:  number;
  commission_water:           number;
  commission_icebar:          number;
  commission_icecube:         number;
};

export type DeliveryPointSaleEmployeeType = {
  branch:       string,
  name:         string,
  price:        number,
  type_product: string,
}

export type DeliveryPointCommissionConfigType = {
  delivery_point_commission_configs: DeliveryPointConfigType[];
}

export type DeliveryPointConfigType = {
  min_range:        number;
  max_range:        number;
  percent:          number;
  id_product_type:  number;
  type_product:     string;
}

/** General */
export type CommissionType = {
  branch:     string;
  employee:   string;
  commission: number;
};