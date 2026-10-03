import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UserModule } from '../../Models/user/user-model';
import { HttpClient } from '@angular/common/http';
import { UserService } from '../../Service/user-service';

@Component({
  selector: 'app-new-user',
  imports: [],
  templateUrl: './new-user.html',
  styleUrl: './new-user.css',
})
export class NewUser {
  userService=inject(UserService)
  router=inject(Router)

  protected roles:Map<string,string>=new Map([["ADMIN","Administrador"],["USER","Usuario"],]);

  //signals form
  id=signal<string>("")
  name= signal<string>("")
  phone=signal<string>("")
  password=signal<string>("")
  role=signal<string>("false")

  //Message error
  guardando= signal<boolean>(false)
  errorMessage=signal<string>("")

  saveUser(){
    if(!this.name() || !this.id()|| !this.phone()|| !this.password()|| !this.role()){
      this.guardando.set(false);
      this.errorMessage.set("tiene que rellenar todos los espacios")
    }


    this.guardando.set(true);
    const newUser:UserModule={
      id:this.id(),
      name:this.name(),
      password:this.password(),
      phone:this.phone(),
      anable:true,
      Admin:this.role()==="ADMIN"

    }
    this.userService.saveUser(newUser).subscribe({
      next:()=>{
        this.router.navigate(["/Pulperia/**"])
        this.guardando.set(false);
        this.errorMessage.set("")
      },
      error:()=>{
        this.guardando.set(false);
        this.errorMessage.set("No se pudo guardar al Usuario")
      }
    })
  }

  cancelar(){
    this.router.navigate(["/Pulperia/**"])
  }
}
