import { Component, inject, signal } from "@angular/core";
import { Router, RouterLink } from "@angular/router";

import { rxResource } from '@angular/core/rxjs-interop';
import { switchMap, throwError, of } from 'rxjs';
import { Client } from "../../Models/Client";
import { ClientService } from "../../Service/client-service";
import { SearchClientPipe } from "../../Pipes/search-client-pipe";



@Component({
  templateUrl:'clientes.component.html',
  styleUrl:'clientes.component.css',
  imports: [RouterLink,SearchClientPipe]
})
export class clientesComponent{
    //Injections
    service=inject(ClientService)
    routes=inject(Router)

    searchPipe=signal<string>("")


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

    deleteClient(client:Client){
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
    ActivedClient(client:Client){
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

    updateClient(id:string){
      this.routes.navigate(["Pulperia/Clients/editarClient",id])
    }


  }
