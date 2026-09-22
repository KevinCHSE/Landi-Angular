import { Component, inject, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { of, switchMap, throwError } from 'rxjs';
import { Client } from "../../Models/Client";
import { FormsModule } from "@angular/forms";
import { invoiceQueryReport } from '../../Models/report/invoiceQueryReport';
import { invoiceReport } from "../../Models/report/invoiceReport";
import { ClientService } from "../../Service/client-service";
import { InvoiceService } from "../../Service/invoice-service";




@Component({
  selector:"reporteCompras",
  templateUrl:'reporte-compras.component.html',
  styleUrl:'reporte-compras.component.css',
  imports: [FormsModule]
})
export class reporteComprasComponent{
  clientService=inject(ClientService)
  invoiceService=inject(InvoiceService)

  //signals of HTML's inputs
  selectClient=signal<Client | null>(null);
  selectStartDate=signal<string>("")
  selectEndDate=signal<string>("")


  //List to print the invoices
  invoices=signal<invoiceReport | null>(null)


  getReport(){
    if(!this.selectStartDate() || !this.selectEndDate() || !this.selectClient()){
      console.log("rellene todos los datos")
      return
    }
    const query:invoiceQueryReport={
      idClient:this.selectClient()?.id!,
      startDate:this.selectStartDate(),
      endDate:this.selectEndDate()

    }

    this.invoiceService.getReport(query).subscribe({
      next:(response)=>{
        console.log(response)
        this.invoices.set(response)
      },error:(err)=>{
        console.log(err)
      }
    })

  }

  getClient=rxResource({
    stream:()=>{
      return this.clientService.getClients()
      .pipe(
        switchMap((result)=>result===null?throwError(()=>new Error("No se encontraron a los clientes")):of(result))
      )
    }
  })

}
