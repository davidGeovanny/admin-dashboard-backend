import { SalesType } from '../interfaces/SaleInterface';

export type RespSalesType = {
  data: | { ok: false, msg: string }
        | { ok: true,  sales: SalesType[] }
}