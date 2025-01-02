import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ModalProductoComponent } from '../../Modales/modal-producto/modal-producto.component';
import { Producto } from 'src/app/Interfaces/producto';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import Swal from 'sweetalert2';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.scss']
})
export class ProductoComponent implements OnInit, AfterViewInit {

  columnasTabla: string[] = ['nombre', 'categoria', 'stock', 'precio', 'estado', 'acciones'];
  dataInicio: Producto[] = [];
  dataListaProducto = new MatTableDataSource(this.dataInicio)
  @ViewChild(MatPaginator) paginatorTabla!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _productoService: ProductoService,
    private _utilidadService: UtilidadService
  ){}

  ngOnInit(): void {
    this.obtenerProducto();
  }

  ngAfterViewInit(): void {
    this.dataListaProducto.paginator = this.paginatorTabla;
  }

  obtenerProducto(){
    // console.log('Obteniendo usuarios');

    this._productoService.lista().subscribe({
      next: (data) => {
        if(data.status) this.dataListaProducto.data = data.value;
        else this._utilidadService.mostrarAlerta("No se pudo obtener la informacion", "Error")
      },
      error: (e) => {}
    })
  }

  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaProducto.filter = filterValue.trim().toLocaleLowerCase();
  }

  nuevoProducto(){
    // console.log('Nuevo usuario');
    this.dialog.open(ModalProductoComponent, {
      disableClose: true
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true") this.obtenerProducto();
    });
  }

  editarProducto(producto: Producto){
    // console.log('Usuario a editar:', producto.idProducto);
    this.dialog.open(ModalProductoComponent, {
      disableClose: true,
      data: producto
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true") this.obtenerProducto();
    });
  }

  eliminarProducto(producto: Producto){
      // console.log('Usuario a eliminar:', usuario);
      Swal.fire({
        title: 'Desea eliminar el producto?',
        text: producto.nombre,
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Si, eliminar!',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        cancelButtonText: 'Cancelar'
      }).then((result) => {
        if(result.isConfirmed){
          this._productoService.eliminar(producto.idProducto).subscribe({
            next: (data) => {
              if(data.status){
                this._utilidadService.mostrarAlerta("El usuario se elimino correctamente", "Listo!");
                this.obtenerProducto();
              } else
                this._utilidadService.mostrarAlerta("No se pudo eliminar el usuario", "Error");
            },
            error: (e) => {}
          })
        }
      })
    }
}
