export interface Garantia {
  id: string;
  numero: number;
  /** Vinculación opcional y excluyente; sin ninguna = certificado suelto. */
  presupuestoId?: string;
  cuentaReciboId?: string;
  /** Snapshot del número del presupuesto vinculado (lo completa el servidor). */
  presupuestoNumero?: number;
  /** Referencia libre a un presupuesto cuando el certificado es suelto. */
  referenciaPresupuesto?: string;
  /** Tipo del catálogo del que se partió (solo informativo). */
  tipoGarantiaId?: string;

  // Contenido de la garantía (snapshot editable del tipo elegido)
  trabajosGarantizados: string;
  aniosGarantia: number;
  alcance: string;
  exclusiones: string[];

  // Cliente
  cliente: string;
  clienteDocumento?: string;
  clienteTelefono?: string;

  // Obra
  domicilioObra: string;
  localidad?: string;
  superficieM2?: number;
  trabajosRealizados: string;
  materialesSistema?: string;
  fechaInicio?: string;
  fechaFinalizacion: string;

  // Vigencia (YYYY-MM-DD). `vigenciaHasta` la calcula el servidor.
  vigenciaDesde: string;
  vigenciaHasta: string;

  lugarEmision: string;
  fechaEmision: string;
  observaciones?: string;

  /** Muestra la firma del certificado o, si no tiene una, la firma global. */
  incluirFirmaEmpresa: boolean;
  /** Firma de la empresa propia de este certificado, en formato data URL. */
  firmaEmpresaDataUrl?: string;
  /** data:image/(png|jpeg|webp);base64,... */
  firmaClienteDataUrl?: string;

  creadoEn: string;
  actualizadoEn: string;
}

export interface GarantiasDB {
  version: 1;
  ultimoNumero: number;
  garantias: Garantia[];
}

/** Lo que manda el cliente (form) al crear/editar. */
export type GarantiaInput = Omit<
  Garantia,
  'id' | 'numero' | 'presupuestoNumero' | 'vigenciaHasta' | 'creadoEn' | 'actualizadoEn'
>;

/** Lo que persiste la store: el input más los campos derivados server-side. */
export type GarantiaDatos = Omit<Garantia, 'id' | 'numero' | 'creadoEn' | 'actualizadoEn'>;

export interface FirmaEmpresa {
  dataUrl: string;
  actualizadoEn: string;
}

/** Datos para precargar el form desde un presupuesto o una cuenta de recibos. */
export interface GarantiaPrefill {
  presupuestoId?: string;
  cuentaReciboId?: string;
  presupuestoNumero?: number;
  cliente: string;
  domicilioObra: string;
  trabajosRealizados: string;
  /** Informativo para la UI (no se guarda en el certificado). */
  resumenPagos: {
    total: number;
    entregado: number;
    saldoPendiente: number;
  };
}
