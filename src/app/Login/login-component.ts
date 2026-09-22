import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../Security/auth-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-component',
  imports: [],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {
  service=inject(AuthService)
  route=inject(Router)

  errorMessage=signal<string>("")


  idSignal=signal<string>("");
  passwordSignal=signal<string>("")

  login(){
    if(!this.idSignal() || !this.passwordSignal()){
      this.errorMessage.set("Tienes que rellenar el id y el password")
    }
    this.service.login(this.idSignal(),this.passwordSignal()).subscribe({
      next:(token)=>{
        this.route.navigate(["/Pulperia"])
      },error:(err)=>{
        this.errorMessage.set("ID o password incorrectos")
      }
    })



  }
}
