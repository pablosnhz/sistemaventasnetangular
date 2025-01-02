import { DatalleVenta } from "./detalle-venta";

export interface Venta {
  idVenta?: number;
  numeroDocumento?: string;
  tipoPago?: string;
  fechaRegistro?: string;
  totalTexto?: string;
  datalleVenta?: DatalleVenta[];
}
