export interface SalesType {
  ok:    boolean;
  sales: Sale[];
}

export interface Sale {
  branch_company:        string;
  client:                string;
  delivery_point_key:    number;
  delivery_point:        string;
  route_name:            string;
  operator:              null | string;
  assistant:             null | string;
  helper:                null | string;
  is_assistant_operator: number;
  sales_folio:           string;
  date:                  string;
  hour:                  string;
  payment_method:        PaymentMethod;
  product:               string;
  short_product:         string;
  type_product:          TypeProduct;
  original_price:        number;
  quantity:              number;
  yield:                 number;
  type_modification:     TypeModification;
  modified_price:        number;
  final_price:           number;
  bonification:          number;
}

enum PaymentMethod {
  CashPayment   = "cash payment",
  CreditPayment = "credit payment",
}

enum TypeModification {
  Discount  = "discount",
  OverPrice = "over price",
}

enum TypeProduct {
  AguaEmbotellada = "AGUA EMBOTELLADA",
  Barra = "BARRA",
  Cubo  = "CUBO",
}

export interface RespTopSale {
  ok:   boolean,
  data: {
    by_frequency: TopSale[],
    by_money    : TopSale[],
  },
  err:  null | string,
}

export interface TopSale {
  [ key: string ]: any;
  frequency:       number;
  money:           number;
}