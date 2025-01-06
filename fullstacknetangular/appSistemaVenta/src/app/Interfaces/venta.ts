import { DatalleVenta } from "./detalle-venta";

export interface Venta {
  idVenta?: number;
  numeroDocumento?: string;
  tipoPago: string;
  totalTexto: string;
  fechaRegistro?: string;
  datalleVenta?: DatalleVenta[];
}
