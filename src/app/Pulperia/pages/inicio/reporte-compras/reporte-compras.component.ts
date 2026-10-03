import { Component, inject, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";
import { of, switchMap, throwError } from 'rxjs';

import { FormsModule } from "@angular/forms";
import { ClientService } from "../../../Service/client-service";
import { InvoiceService } from "../../../Service/invoice-service";
import { Client } from "../../../Models/Client";
import { invoiceReport } from "../../../Models/report/invoiceReport";
import { invoiceQueryReport } from "../../../Models/report/invoiceQueryReport";
import { Router } from "@angular/router";
import { PaymentService } from '../../../Service/payment-service';
import { paymentQuery } from "../../../Models/Payment/paymentQuery";
import { payment } from '../../../Models/Payment/payment';





@Component({
  selector:"reporteCompras",
  templateUrl:'reporte-compras.component.html',
  styleUrl:'reporte-compras.component.css',
  imports: [FormsModule]
})
export class reporteComprasComponent{
  clientService=inject(ClientService)
  invoiceService=inject(InvoiceService)
  PaymentService=inject(PaymentService)
  router=inject(Router)

  //signals of HTML's inputs
  selectClient=signal<Client | null>(null);
  selectStartDate=signal<string>("")
  selectEndDate=signal<string>("")
  paymentAmount=signal<number>(0)


  //List to print the invoices
  invoices=signal<invoiceReport | null>(null)

  //message
  message=signal<string>("No se ha seleccionado ninguna fecha...")


  getReport(){
    if(!this.selectStartDate() || !this.selectEndDate() || !this.selectClient()){
      this.message.set("rellene todos los datos")
      return
    }
    const query:invoiceQueryReport={
      idClient:this.selectClient()?.id!,
      startDate:this.selectStartDate(),
      endDate:this.selectEndDate()

    }

    this.invoiceService.getReport(query).subscribe({
      next:(response)=>{
        this.invoices.set(response)
        this.message.set("")
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

  payAccount(){
    if(!this.paymentAmount() || this.paymentAmount()===0){
      this.message.set("Falta el monto que quiere pagar ")
      return
    }
    if(!this.selectStartDate() || !this.selectEndDate() || !this.selectClient()){
      this.message.set("rellene todos los datos")
      return
    }

    this.message.set("")

    const query:paymentQuery={
      clientId:this.selectClient()?.id!,
      amount:this.paymentAmount(),
      startDate:this.selectStartDate(),
      endDate:this.selectEndDate(),
    }

    this.PaymentService.savePayment(query).subscribe({
      next:()=>{
        this.selectClient.set(null)
        this.selectStartDate.set("")
        this.selectEndDate.set("")
        this.paymentAmount.set(0)
      },
      error:(err)=>{
        console.error("Error devuelto por el servidor:", err);
        this.message.set(`Ocurrio un error a la hora de hacer el pago ${err}`)
      }
    })


  }

}
