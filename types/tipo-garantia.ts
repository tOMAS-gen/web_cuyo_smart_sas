// Catálogo editable de garantías predefinidas por servicio. Al emitir un
// certificado se copia (snapshot) el contenido del tipo elegido: editar o
// borrar un tipo después NO altera los certificados ya emitidos.

export interface TipoGarantia {
  id: string;
  nombre: string;
  /** Frase que completa "...otorga una garantía de X AÑOS sobre los trabajos de ___". */
  trabajosGarantizados: string;
  aniosPorDefecto: number;
  /** Párrafos separados por línea en blanco. Admite placeholders, ver lib/garantia-logic.ts. */
  alcance: string;
  exclusiones: string[];
  creadoEn: string;
  actualizadoEn: string;
}

export interface TiposGarantiaDB {
  version: 1;
  tipos: TipoGarantia[];
}

export type TipoGarantiaInput = Omit<TipoGarantia, 'id' | 'creadoEn' | 'actualizadoEn'>;
