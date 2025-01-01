import { Injectable } from '@angular/core';
// alertas
import { MatSnackBar } from '@angular/material/snack-bar';
import { Sesion } from '../Interfaces/sesion';

@Injectable({
  providedIn: 'root'
})
export class UtilidadService {

  constructor(private _snackBar: MatSnackBar) { }

  mostrarAlerta( mensaje: string, tipo: string ){
    this._snackBar.open(mensaje, tipo, {
      horizontalPosition: 'end',
      verticalPosition: 'top',
      duration: 3000
    })
  }

  // guardar la sesion del usuario
  guardarSesionUsuario( usuarioSesion: Sesion ){
    localStorage.setItem("usuario", JSON.stringify(usuarioSesion))
  }

  // obtener la sesion del usuario
  obtenerSesionUsuario(){
    const dataCadena = localStorage.getItem("usuario");
    const usuario = JSON.parse(dataCadena!);
    return usuario
  }

  // eliminar la sesion del usuario
  eliminarSesionUsuario(){
    localStorage.removeItem("usuario")
  }
}
