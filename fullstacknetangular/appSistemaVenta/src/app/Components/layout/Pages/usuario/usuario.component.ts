import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ModalUsuarioComponent } from '../../Modales/modal-usuario/modal-usuario.component';
import { Usuario } from 'src/app/Interfaces/usuario';
import  { UsuarioService } from 'src/app/services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss']
})
export class UsuarioComponent implements OnInit, AfterViewInit{

  columnasTabla: string[] = ['nombreCompleto', 'correo', 'rolDescripcion', 'estado', 'acciones'];
  dataInicio: Usuario[] = [];
  dataListaUsuario = new MatTableDataSource(this.dataInicio)
  @ViewChild(MatPaginator) paginatorTabla!: MatPaginator;

  constructor(
    private dialog: MatDialog,
    private _usuarioService: UsuarioService,
    private _utilidadService: UtilidadService
  ) { }

  ngOnInit(): void {
    this.obtenerUsuario();
  }

  ngAfterViewInit(): void {
    this.dataListaUsuario.paginator = this.paginatorTabla;
  }

  obtenerUsuario(){
    // console.log('Obteniendo usuarios');

    this._usuarioService.lista().subscribe({
      next: (data) => {
        if(data.status) this.dataListaUsuario.data = data.value;
        else this._utilidadService.mostrarAlerta("No se pudo obtener la informacion", "Error")
      },
      error: (e) => {}
    })
  }

  aplicarFiltroTabla(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaUsuario.filter = filterValue.trim().toLocaleLowerCase();
  }

  // abre el modal
  nuevoUsuario(){
    // console.log('Nuevo usuario');
    this.dialog.open(ModalUsuarioComponent, {
      disableClose: true
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true") this.obtenerUsuario();
    });
  }

  editarUsuario(usuario: Usuario){
    console.log('Usuario a editar:', usuario.idUsuario);
    this.dialog.open(ModalUsuarioComponent, {
      disableClose: true,
      data: usuario
    }).afterClosed().subscribe(resultado => {
      if(resultado === "true") this.obtenerUsuario();
    });
  }

  eliminarUsuario(usuario: Usuario){
    // console.log('Usuario a eliminar:', usuario);
    Swal.fire({
      title: 'Desea eliminar el usuario?',
      text: usuario.nombreCompleto,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Si, eliminar!',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if(result.isConfirmed){
        this._usuarioService.eliminar(usuario.idUsuario).subscribe({
          next: (data) => {
            if(data.status){
              this._utilidadService.mostrarAlerta("El usuario se elimino correctamente", "Listo!");
              this.obtenerUsuario();
            } else
              this._utilidadService.mostrarAlerta("No se pudo eliminar el usuario", "Error");
          },
          error: (e) => {}
        })
      }
    })
  }
}
