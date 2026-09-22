import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { Client } from '../../../Models/Client';
import { ClientService } from '../../../Service/client-service';

@Component({
  selector: 'app-agregar-cliente',
  imports: [],
  templateUrl: './agregar-cliente.html',
  styleUrl: './agregar-cliente.css',
})
export class AgregarCliente {

  router=inject(Router)
  service=inject(ClientService)
  guardando=signal<boolean>(false)
  errorMessage=signal<string>('')


  //Inputs Form
  name=signal<string>("")
  id=signal<string>("")
  phone=signal<string>("")
  limit=signal<number>(0)


  cancelar(): void {
  this.router.navigate(['Pulperia/Clients']);
  }


  saveClient(){
      if(!this.name() || !this.id() || !this.phone() || this.limit()===0 ){
        this.errorMessage.set("You must fill out every field");
        return;
      }

      this.errorMessage.set('');
      this.guardando.set(true);

      const client:Client={
        name:this.name(),
        id:this.id(),
        phone:this.phone(),
        creditLimit:this.limit(),
        balance:0,
        active:true,

      }

      this.service.saveClient(client).subscribe({
        next:()=>{
          this.guardando.set(false);
          this.router.navigate(["Pulperia/Clients"])
        },error:((err)=>{
          this.errorMessage.set("The client was not save")
        })
      })

  }




}
