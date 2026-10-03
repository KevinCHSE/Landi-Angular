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
  errorMessage=signal<string>("")
  guardando=signal<boolean>(true)

  //URL params
  idParam:string="";
  fullName=signal<string>('')
  phone=signal<string>('')
  creditLimit=signal<number>(0)
  UsedCredit=signal<number>(0)
  TotalSpent=signal<number>(0)
  active=signal<boolean>(false)


  constructor(){
    this.idParam= this.ActivatedRoute.snapshot.paramMap.get("id")||""
    if(!this.idParam){
      this.errorMessage.set("No se encontro el cliente")
      this.guardando.set(false)
      return
    }

    this.service.getClient(this.idParam).subscribe({
      next:(client)=>{
        this.errorMessage.set("");
        this.fullName.set(client.name);
        this.phone.set(client.phone);
        this.creditLimit.set(client.creditLimit)
        this.UsedCredit.set(client.usedCredit)
        this.TotalSpent.set(client.totalSpent)
        this.active.set(client.active)
      },error:(err)=>{
        this.errorMessage.set("No se pudo cargar el cliente");
        this.guardando.set(false)
        console.log(err)
      }
    })
  }

  updateClient(){
    if(!this.fullName() || !this.phone() || !this.creditLimit()){
      this.guardando.set(false);
      this.errorMessage.set("rellene todos los espacios")
      return
    }
    this.guardando.set(true);

    const client:Client={
      id:this.idParam,
      name:this.fullName(),
      phone:this.phone(),
      creditLimit:this.creditLimit(),
      usedCredit:this.UsedCredit(),
      totalSpent:this.TotalSpent(),
      active:this.active()
    }
    this.service.updateCliente(this.idParam,client).subscribe({
      next:()=>{
        this.guardando.set(false);
        this.errorMessage.set("")
        this.router.navigate(["Pulperia/Clients"])
      },error:(err)=>{
        this.guardando.set(false);
        this.errorMessage.set("No se logro actualizar el usuario")
        console.log(err)
      }
    })

  }


  Cancelar(){
    this.router.navigate(["Pulperia/Clients"])
  }
}
