import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import * as moment from 'moment';
import { ModalDetalleVentaComponent } from '../../Modales/modal-detalle-venta/modal-detalle-venta.component';
import { VentaService } from 'src/app/services/venta.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import { Venta } from 'src/app/Interfaces/venta';

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
  selector: 'app-historial-venta',
  templateUrl: './historial-venta.component.html',
  styleUrls: ['./historial-venta.component.scss'],
  providers: [
    {
      provide: MAT_DATE_FORMATS,
      useValue: MY_DATA_FORMATS,
    },
  ]
})
export class HistorialVentaComponent implements OnInit, AfterViewInit {

  formularioBusqueda: FormGroup;
  opcionesBusqueda: any[] = [
    {value: "fecha", descripcion: "Por fechas"},
    {value: "numero", descripcion: "Numero venta"},
  ];

  columnasTabla: string[] = ['fechaRegistro', 'numeroDocumento', 'tipoPago', 'total', 'accion'];
  dataInicio: Venta[] = [];
  datosListaVenta = new MatTableDataSource(this.dataInicio);

  @ViewChild(MatPaginator) paginatorTabla!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private fb: FormBuilder,
    private _ventaService: VentaService,
    private _utilidadService: UtilidadService
  ){
    this.formularioBusqueda = this.fb.group({
      buscarPor: ['fecha'],
      fechaInicio: [''],
      fechaFin: [''],
      numero: [''],
    })
    this.formularioBusqueda.get('buscarPor')?.valueChanges.subscribe(value => {
      this.formularioBusqueda.patchValue({
        fechaInicio: '',
        fechaFin: '',
        numero: '',
      })
    })
  }

  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  ngAfterViewInit(): void {
    this.datosListaVenta.paginator = this.paginatorTabla;
  }

  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.datosListaVenta.filter = filterValue.trim().toLocaleLowerCase();
  }

  buscarVentas(){
    let _fechaInicio = '';
    let _fechaFin = '';
    if(this.formularioBusqueda.value.buscarPor === 'fecha'){
      _fechaInicio = moment(this.formularioBusqueda.value.fechaInicio).format('DD/MM/YYYY');
      _fechaFin = moment(this.formularioBusqueda.value.fechaFin).format('DD/MM/YYYY');

      if(_fechaInicio === 'Invalid date' || _fechaFin === 'Invalid date'){
        this._utilidadService.mostrarAlerta('Seleccione un rango de fechas valido', 'error');
        return;
      }
    }
    this._ventaService.historial(
      this.formularioBusqueda.value.buscarPor,
      this.formularioBusqueda.value.numero,
      _fechaInicio,
      _fechaFin
    ).subscribe({
      next: (data) => {
        if(data.status)
          this.datosListaVenta = data.value;
          else
          this._utilidadService.mostrarAlerta("No se pudo obtener la informacion", "Error")
      },
      error: (e) => {}
    })
  }

  verDetalleVenta(_venta: Venta){
    this.dialog.open(ModalDetalleVentaComponent, {
      data: _venta,
      disableClose: true,
      width: '600px'
    })
  }
}
