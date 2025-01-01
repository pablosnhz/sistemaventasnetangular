import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from 'src/app/Interfaces/login';
import { UsuarioService } from 'src/app/services/usuario.service';
import { UtilidadService } from 'src/app/Reutilizable/utilidad.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  formularioLogin: FormGroup;
  ocultarPassword: boolean = true;
  mostrarLoading: boolean = false;

  constructor(private _utilidadService: UtilidadService,
    private fb: FormBuilder,
    private router: Router,
    private _usuarioService: UsuarioService){
      this.formularioLogin = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required]]
      })
    }

  ngOnInit(): void {

  }

  iniciarSesion(){
    this.mostrarLoading = true;
    const request: Login = {
      correo: this.formularioLogin.value.email,
      clave: this.formularioLogin.value.password
    }
    this._usuarioService.iniciarSesion(request).subscribe({
      next: (data) => {
        if(data.status){
          this._utilidadService.guardarSesionUsuario(data.value);
          this.router.navigate(["pages"])
        } else {
          this._utilidadService.mostrarAlerta(data.msg, "No se encontraron coincidencias")
        }
      },
      complete: () => {
        this.mostrarLoading = false
      },
      error: () => {
        this._utilidadService.mostrarAlerta("Error al iniciar sesion", "Error")
      }
    })
  }

}
