import { Component, inject, signal } from '@angular/core';

import { Router, ActivatedRoute } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { Client } from '../../../Models/Client';
import { ClientService } from '../../../Service/client-service';

@Component({
  selector: 'app-editar-cliente',
  imports: [DecimalPipe],
  templateUrl: './editar-cliente.html',
  styleUrl: './editar-cliente.css',
})
export class EditarCliente {

  service=inject(ClientService)
  ActivatedRoute=inject(ActivatedRoute)
  router=inject(Router)
  errorMessageUpdate=signal<string>("")
  updating=signal<boolean>(true)

  //URL params
  idParam:string="";
  fullName=signal<string>('')
  phone=signal<string>('')
  creditLimit=signal<number>(0)
  balance=signal<number>(0)
  active=signal<boolean>(false)


  constructor(){
    this.idParam= this.ActivatedRoute.snapshot.paramMap.get("id")||""
    if(!this.idParam){
      this.errorMessageUpdate.set("No se encontro el cliente")
      this.updating.set(false)
      return
    }

    this.service.getClient(this.idParam).subscribe({
      next:(client)=>{
        this.errorMessageUpdate.set("");
        this.fullName.set(client.name);
        this.phone.set(client.phone);
        this.creditLimit.set(client.creditLimit)
        this.balance.set(client.balance)
        this.active.set(client.active)
      },error:(err)=>{
        this.errorMessageUpdate.set("No se pudo cargar el cliente");
        this.updating.set(false)
        console.log(err)
      }
    })
  }

  updateClient(){
    const client:Client={
      id:this.idParam,
      name:this.fullName(),
      phone:this.phone(),
      creditLimit:this.creditLimit(),
      balance:this.balance(),
      active:this.active()
    }
    this.service.updateCliente(this.idParam,client).subscribe({
      next:()=>{
        console.log(client)
        console.log(this.idParam)
        this.updating.set(false);
        this.router.navigate(["Pulperia/Clients"])
      },error:(err)=>{
        this.updating.set(false);
        this.errorMessageUpdate.set("No se logro actualizar el usuario")
        console.log(err)
      }
    })

  }


  Cancelar(){
    this.router.navigate(["Pulperia/Clients"])
  }
}
