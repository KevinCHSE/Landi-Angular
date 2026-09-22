import { Component, inject } from "@angular/core";
import { RouterLink } from "@angular/router";

import { rxResource } from '@angular/core/rxjs-interop';
import { switchMap, throwError, of } from 'rxjs';
import { Client } from "../../Models/Client";
import { ClientService } from "../../Service/client-service";


@Component({
  templateUrl:'clientes.component.html',
  styleUrl:'clientes.component.css',
  imports: [RouterLink]
})
export class clientesComponent{
  //Injections
    service=inject(ClientService)

    getClients=rxResource({
      stream:(args)=>{
        return this.service.getClients()
        .pipe(
          switchMap(
            (result)=>result===null?throwError(()=>new Error("No se pudo conseguir a los clientes"))
            :of(result))
        )
      }
    })

    eliminarProducto(client:Client){
      client.active=false;
      this.service.updateCliente(client.id,client).subscribe({
        next:()=>{
          console.log("Desactivado")
          this.getClients.reload();
        },error:(err)=>{
          console.log("error en EliminarCliente")
        }
      })

    }
    ActivarCliente(client:Client){
      client.active=true;
      this.service.updateCliente(client.id,client).subscribe({
        next:()=>{
          console.log("Activado")
          this.getClients.reload();
        },error:()=>{
          console.log("error en ActivarCliente")
        }
      })
    }


  }
