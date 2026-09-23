import { Component, inject } from "@angular/core";

import { rxResource } from "@angular/core/rxjs-interop";
import { of, switchMap, throwError } from "rxjs";
import { ClientService } from "../../Service/client-service";
import { InvoiceDetailsService } from "../../Service/invoice-details-service";
import { ProductService } from "../../Service/product-service";
import { reporteComprasComponent } from "./reporte-compras/reporte-compras.component";




@Component({
  templateUrl:'inicio.component.html',
  styleUrl:'inicio.component.css',
  imports: [reporteComprasComponent]
})
export class inicioComponent{

  clientService=inject(ClientService)
  invoiceDetailsService=inject(InvoiceDetailsService)
  productService=inject(ProductService)




  clientCount=rxResource({
    stream:()=>{
      return this.clientService.clientCount()
      .pipe(
        switchMap((result)=>result===null?throwError(()=>new Error("Sin clientes"))
        :of(result))
      )
    }
  })

  getTotal=rxResource({
    stream:()=>{
      return this.invoiceDetailsService.getTotal()
      .pipe(
        switchMap((result)=>result===null?throwError(()=>new Error("No se encontro el total de ventas")):of(result)))
    }
  })

  needStock=rxResource({
    stream:()=>{
      return this.productService.needStock()
      .pipe(
        switchMap(
          (result)=>result===null?throwError(()=>new Error("No se encontro productos sin falta de stock")):of(result)
        )
      )
    }
  })
}
