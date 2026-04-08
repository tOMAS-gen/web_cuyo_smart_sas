export type FormaPago =
  | 'Efectivo'
  | 'Transferencia bancaria'
  | 'Cheque'
  | '50% anticipo / 50% al finalizar'
  | 'A convenir';

export type EstadoPresupuesto = 'borrador' | 'enviado' | 'aceptado' | 'rechazado';

export type TipoItem = 'material' | 'mano_de_obra' | 'ambos';

export interface PresupuestoItem {
  descripcion: string;
  tipo?: TipoItem;
  manoDeObra: number;
  materiales: number;
}

export interface Presupuesto {
  id: string;
  numero: number;
  fecha: string;
  cliente: string;
  ubicacion: string;
  detalle: string;
  plazoRealizacion?: string;
  items: PresupuestoItem[];
  total: number;
  validezDias: number;
  formaPago: FormaPago;
  estado: EstadoPresupuesto;
  notas?: string;
  creadoEn: string;
}

export interface PresupuestosDB {
  version: 1;
  ultimoNumero: number;
  presupuestos: Presupuesto[];
}

export type PresupuestoInput = Omit<Presupuesto, 'id' | 'numero' | 'total' | 'creadoEn'>;
