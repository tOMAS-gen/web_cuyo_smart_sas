export interface CuentaRecibo {
  id: string;
  cliente: string;
  concepto: string;
  montoTotal: number;
  creadoEn: string;
}

export type CuentaReciboInput = Omit<CuentaRecibo, 'id' | 'creadoEn'>;

export interface ResumenCuentaRecibo {
  entregado: number;
  saldoPendiente: number;
  sobrepago: boolean;
}
