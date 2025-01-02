import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ProductoService } from 'src/app/services/producto.service';
import { VentaService } from 'src/app/services/venta.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

import { Producto } from 'src/app/Interfaces/producto';
import { Venta } from 'src/app/Interfaces/venta';
import { DatalleVenta } from 'src/app/Interfaces/detalle-venta';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-venta',
  templateUrl: './venta.component.html',
  styleUrls: ['./venta.component.scss']
})
export class VentaComponent {

  listaProductos: Producto[] = [];
  listaProductosFiltro: Producto[] = [];
  listaProductosParaVenta: DatalleVenta[] = [];
  bloquearBotonRegistrar: boolean = false;
  // este producto seleccionado pasa luego a lista productos para venta
  productoSeleccionado!: Producto;
  tipoDePagoPorDefecto: string = "Efectivo";
  totalPagar: number = 0;

  formularioProductoVenta: FormGroup;
  columnasTabla: string[] = ['producto', 'cantidad', 'precio', 'total', 'accion'];
  datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);

  retornarProductosPorFiltro(busqueda: any):Producto[]{
    const valorBuscado = typeof busqueda === 'string' ? busqueda.toLowerCase() : busqueda.nombre.toLowerCase();
    return this.listaProductos.filter(item => item.nombre.toLowerCase().includes(valorBuscado));
  }

  constructor(
    private fb: FormBuilder,
    private _productoService: ProductoService,
    private _ventaService: VentaService,
    private _utilidadService: UtilidadService
  ){
    this.formularioProductoVenta = this.fb.group({
      producto: ['', [Validators.required]],
      cantidad: ['', [Validators.required]],
    });
    this._productoService.lista().subscribe({
      next: (data) => {
        if(data.status){
          const lista = data.value as Producto[];
          this.listaProductos = lista.filter(item => item.esActivo == 1 && item.stock > 0);
        };
      },
      error: (e) => {}
    })
    this.formularioProductoVenta.get('producto')?.valueChanges.subscribe(value => {
      this.listaProductosFiltro = this.retornarProductosPorFiltro(value);
    })
  }

  ngOnInit(): void {

  }

  mostrarProducto(producto: Producto){
    return producto.nombre;
  }

  productoParaVenta(event: any){
    this.productoSeleccionado = event.option.value;
  }

  agregarProductoParaVenta(){
    const _cantidad: number = this.formularioProductoVenta.value.cantidad;
    const _precio: number = parseFloat(this.productoSeleccionado.precio.toString());
    const _total: number = _cantidad * _precio;
    this.totalPagar = this.totalPagar + _total;
    this.listaProductosParaVenta.push({
      idProducto: this.productoSeleccionado.idProducto,
      descripcionProducto: this.productoSeleccionado.nombre,
      cantidad: _cantidad,
      precioTexto: String(_precio.toFixed(2)),
      totalTexto: String(_total.toFixed(2))
    })
    this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);
    this.formularioProductoVenta.patchValue({
      producto: '',
      cantidad: ''
    })
  }

  eliminarVenta(detalle: DatalleVenta){
    this.totalPagar = this.totalPagar - parseFloat(detalle.totalTexto),
    this.listaProductosParaVenta = this.listaProductosParaVenta.filter(
      p => p.idProducto != detalle.idProducto
    )
    this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);
  }

  registrarVenta(){
    console.log();

    if(this.listaProductosParaVenta.length > 0){
      this.bloquearBotonRegistrar = true;
      const request: Venta = {
        tipoPago: this.tipoDePagoPorDefecto,
        totalTexto: String(this.totalPagar.toFixed(2)),
        datalleVenta: this.listaProductosParaVenta
      }
      this._ventaService.registrar(request).subscribe({
        next: (data) => {
          if(data.status){
            this.totalPagar = 0.00;
            this.listaProductosParaVenta = [];
            this.datosDetalleVenta = new MatTableDataSource(this.listaProductosParaVenta);
            this.tipoDePagoPorDefecto = "Efectivo";

            Swal.fire({
              icon: 'success',
              title: 'La venta se realizo correctamente',
              text: `El ID de la venta es: ${data.value.numeroDocumento}`,
            })
          } else {
            this._utilidadService.mostrarAlerta("No se pudo registrar la venta", "Error")
          }
        },
        complete: () => {
          this.bloquearBotonRegistrar = false;
        },
        error: (e) => {}
      })
    }
  }
}
