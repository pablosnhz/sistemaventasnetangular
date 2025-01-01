import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Rol } from 'src/app/Interfaces/rol';
import { Usuario } from 'src/app/Interfaces/usuario';
import { RolService } from 'src/app/services/rol.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Component({
  selector: 'app-modal-usuario',
  templateUrl: './modal-usuario.component.html',
  styleUrls: ['./modal-usuario.component.scss']
})
export class ModalUsuarioComponent implements OnInit{

  formularioUsuario: FormGroup;
  ocultarPassword: boolean = true;
  tituloAccion: string = "Agregar";
  botonAccion: string = "Guardar";
  listaRoles: Rol[] = [];

  constructor(
    private modalActual: MatDialogRef<ModalUsuarioComponent>,
    @Inject(MAT_DIALOG_DATA) public datasUsuario: Usuario,
    private fb: FormBuilder,
    private _rolService: RolService,
    private _usuarioService: UsuarioService,
    private _utilidadService: UtilidadService
  ) {
    this.formularioUsuario = this.fb.group({
      nombreCompleto: ['', [Validators.required]],
      correo: ['', [Validators.required]],
      idRol: ['', [Validators.required]],
      clave: ['', [Validators.required]],
      esActivo: ['1', [Validators.required]]
    })
    if(this.datasUsuario != null){
      this.tituloAccion = "Editar";
      this.botonAccion = "Actualizar";
    }
    this._rolService.lista().subscribe({
      next: (data) => {
        if(data.status) this.listaRoles = data.value;
      },
      error: (e) => {}
    })
  }

  ngOnInit(): void {
    if(this.datasUsuario != null){
      this.formularioUsuario.patchValue({
        nombreCompleto: this.datasUsuario.nombreCompleto,
        correo: this.datasUsuario.correo,
        idRol: this.datasUsuario.idRol,
        clave: this.datasUsuario.clave,
        esActivo:  this.datasUsuario.esActivo.toString()
      })
    }
  }

  guardarEditar_Usuario(){
    const _usuario: Usuario = {
      idUsuario: this.datasUsuario == null ? 0 : this.datasUsuario.idUsuario,
      nombreCompleto: this.formularioUsuario.value.nombreCompleto,
      correo: this.formularioUsuario.value.correo,
      idRol: this.formularioUsuario.value.idRol,
      rolDescripcion: '',
      clave: this.formularioUsuario.value.clave,
      esActivo: parseInt(this.formularioUsuario.value.esActivo)
    }
    if(this.datasUsuario == null){
      this._usuarioService.guardar(_usuario).subscribe({
        next: (data) => {
          if(data.status){
            this._utilidadService.mostrarAlerta("El usuario se guardo correctamente", "Guardado con exito!")
            // cuando se cierra el modal va a enviar la informacion
            this.modalActual.close("true");
          } else {
            this._utilidadService.mostrarAlerta("No se pudo registrar el usuario", "Error")
          }
        },
        error: (e) => {}
      })
    } else {
      this._usuarioService.editar(_usuario).subscribe({
        next: (data) => {
          if(data.status){
            this._utilidadService.mostrarAlerta("El usuario fue editado correctamente", "Guardado con exito!")
            // cuando se cierra el modal va a enviar la informacion
            this.modalActual.close("true");
          } else {
            this._utilidadService.mostrarAlerta("No se pudo editar el usuario", "Error")
          }
        },
        error: (e) => {}
      })
    }
}
}
