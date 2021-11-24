import { SalesType } from '../interfaces/sales-interface';

export type RespSalesType = {
  data: | { ok: false, msg: string }
        | { ok: true,  sales: SalesType[] }
}