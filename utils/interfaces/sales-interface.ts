export type RespSalesType = {
  data: | { ok: false, msg: string }
        | { ok: true,  sales: Sale[] }
}
  
export interface SalesType {
  ok:    boolean;
  sales: Sale[];
}

interface Sale {
  branch_company:     string;
  client:             string;
  delivery_point_key: number;
  delivery_point:     string;
  route_name:         string;
  operator:           string;
  assistant:          null | string;
  helper:             null | string;
  sales_folio:        string;
  date:               string;
  hour:               string;
  payment_method:     PaymentMethod;
  product:            string;
  type_product:       TypeProduct;
  original_price:     number;
  quantity:           number;
  yield:              number;
  type_modification:  TypeModification;
  modified_price:     number;
  final_price:        number;
  bonification:       number;
}

enum PaymentMethod {
  CashPayment = "cash payment",
  CreditPayment = "credit payment",
}

enum TypeModification {
  Discount = "discount",
  OverPrice = "over price",
}

enum TypeProduct {
  AguaEmbotellada = "AGUA EMBOTELLADA",
  Barra = "BARRA",
  Cubo = "CUBO",
}
