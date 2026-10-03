import { Component, inject, signal } from '@angular/core';
import { ClientService } from '../../Service/client-service';
import { rxResource } from '@angular/core/rxjs-interop';
import { of, switchMap, throwError } from 'rxjs';
import { PaymentService } from '../../Service/payment-service';
import { payment } from '../../Models/Payment/payment';

@Component({
  selector: 'app-payment-report',
  imports: [],
  templateUrl: './payment-report.html',
  styleUrl: './payment-report.css',
})
export class PaymentReport {
  clientService=inject(ClientService)
  paymentService=inject(PaymentService)


  message=signal<string>("")
  clientId=signal<string>("")
  report=signal<payment[] | null>(null);

  getClient=rxResource({
    stream:()=>{
      return this.clientService.getClients()
      .pipe(
        switchMap(
          (result)=>result===null?throwError(()=>{new Error("No se encontro ningun cliente")}):of(result)
        )
      )
    }
  })

  getReport(){
    if(!this.clientId()){
      this.message.set("No hay cliente que buscar")
      this.report.set(null)
    }
    this.paymentService.getPaymentReports(this.clientId()).subscribe({
      next:(paymentReport)=>{
        this.report.set(paymentReport)
        this.message.set('')
      },
      error:()=>{
        this.message.set("Ocurrio un error a la hora de buscar al cliente, intentelo de nuevo")
      }
    })
  }


}
