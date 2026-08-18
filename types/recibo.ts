export type FormaPagoRecibo = 'Efectivo' | 'Transferencia' | 'Otro';

export interface Recibo {
  id: string;
  numero: number;
  presupuestoId?: string;
  cuentaReciboId?: string;
  fecha: string;
  recibiDe: string;
  concepto: string;
  monto: number;
  montoEnLetras: string;
  formaPago: FormaPagoRecibo;
  formaPagoOtroDetalle?: string;
  observaciones?: string;
  creadoEn: string;
}

export interface RecibosDB {
  version: 1;
  ultimoNumero: number;
  recibos: Recibo[];
}

export type ReciboInput = Omit<Recibo, 'id' | 'numero' | 'creadoEn'>;

export interface ResumenPresupuesto {
  entregado: number;
  saldoPendiente: number;
  sobrepago: boolean;
}
