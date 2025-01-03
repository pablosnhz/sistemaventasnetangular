import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import { ModalDetalleVentaComponent } from '../../Modales/modal-detalle-venta/modal-detalle-venta.component';
import { VentaService } from 'src/app/services/venta.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { Venta } from 'src/app/Interfaces/venta';
import { Reporte } from 'src/app/Interfaces/reporte';

export const MY_DATA_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-reporte',
  templateUrl: './reporte.component.html',
  styleUrls: ['./reporte.component.scss'],
  providers: [
      {
        provide: MAT_DATE_FORMATS,
        useValue: MY_DATA_FORMATS,
      },
    ]
})
export class ReporteComponent implements OnInit, AfterViewInit {

  formularioFiltro: FormGroup;
  listaVentaReporte: Reporte[] = [];
  columnasTabla: string[] = ['fechaRegistro', 'numeroVenta', 'tipoPago', 'total', 'producto', 'cantidad', 'precio', 'totalProducto'];
  dataVentaReporte = new MatTableDataSource(this.listaVentaReporte);

  @ViewChild(MatPaginator) paginatorTabla!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private _ventaService: VentaService,
    private _utilidadService: UtilidadService
  ){
    this.formularioFiltro = this.fb.group({
      fechaInicio: ['', Validators.required],
      fechaFin: ['', Validators.required],
    })
  }

  ngAfterViewInit(): void {
    this.dataVentaReporte.paginator = this.paginatorTabla;
  }
  ngOnInit(): void {

  }

  buscarVentas(){
    const _fechaInicio = moment(this.formularioFiltro.value.fechaInicio).format('DD/MM/YYYY');
    const _fechaFin = moment(this.formularioFiltro.value.fechaFin).format('DD/MM/YYYY');

    if(_fechaInicio === 'Invalid date' || _fechaFin === 'Invalid date'){
      this._utilidadService.mostrarAlerta('Seleccione un rango de fechas valido', 'error');
      return;
    }
    this._ventaService.reporte(_fechaInicio, _fechaFin).subscribe({
      next: (data) => {
        if(data.status) {
          this.dataVentaReporte.data = data.value;
          this.dataVentaReporte.data = data.value;
        } else {
          this.listaVentaReporte = [];
          this.dataVentaReporte.data = [];
          this._utilidadService.mostrarAlerta("No se encontro informacion", "Error")
        }
      },
      error: (e) => {}
    })
  }

  exportarExcel(){
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(this.listaVentaReporte);

    XLSX.utils.book_append_sheet(wb, ws, 'Reporte');
    XLSX.writeFile(wb, 'ReporteVenta.xlsx');
  }

}
