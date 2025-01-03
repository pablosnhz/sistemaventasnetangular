import { Component, OnInit, Inject } from '@angular/core';
import {  MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DatalleVenta } from 'src/app/Interfaces/detalle-venta';
import { Venta } from 'src/app/Interfaces/venta';

@Component({
  selector: 'app-modal-detalle-venta',
  templateUrl: './modal-detalle-venta.component.html',
  styleUrls: ['./modal-detalle-venta.component.scss']
})
export class ModalDetalleVentaComponent {

  fechaRegistro: string ="";
  numeroDocumento: string = "";
  tipoPago: string = "";
  total: string = "";
  detalleVenta?: DatalleVenta[] = [];
  columnasTabla: string[] = ['producto', 'cantidad', 'precio', 'total'];

  constructor(@Inject(MAT_DIALOG_DATA) public _venta: Venta) {
    this.fechaRegistro = _venta.fechaRegistro!;
    this.numeroDocumento = _venta.numeroDocumento!;
    this.tipoPago = _venta.tipoPago;
    this.total = _venta.totalTexto;
    this.detalleVenta = _venta.datalleVenta;
  }

  ngOnInit(): void {}
}
