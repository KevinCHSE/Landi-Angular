import { Component, inject, signal } from "@angular/core";
import { rxResource } from "@angular/core/rxjs-interop";

import { forkJoin, of, switchMap, throwError } from "rxjs";
import { CartItem } from '../../Models/carItem';
import { Products } from '../../Models/Products';
import { FormsModule } from "@angular/forms";

import { invoiceRequest } from '../../Models/invoice/invoiceRequest';
import { Client } from "../../Models/Client";
import { ClientService } from "../../Service/client-service";
import { ProductService } from "../../Service/product-service";
import { InvoiceService } from "../../Service/invoice-service";


@Component({
  selector:"ShoppingCar",
  templateUrl:'carrito.component.html',
  styleUrl:'carrito.component.css',
  imports: [FormsModule]
})
export class carritoComponent{

  serviceClient=inject(ClientService)
  serviceProduct=inject(ProductService)
  serviceInvoice=inject(InvoiceService)

  //Errors
  ErrorMessage=signal<string>("")


  //Client
  selectedClient = signal<Client | null>(null);
  //variables which are need to addItem
  selectedProduct = signal<Products | null>(null);
  amount=signal<number>(1)

  //save Invoice
  selectedPayment=signal<string>("")

  invoiceItem=signal<CartItem[]>([])
  invoiceTotal=signal(0)


  //button addItem
    addItem(){
      if(this.selectedProduct()!=null){
      const items=this.invoiceItem();
      const exist= items.find(item=>item.product.id===this.selectedProduct()?.id)
        if(!exist){
          this.invoiceItem.set([...items, {product:this.selectedProduct()!,amount:this.amount()}])
        }else{
        this.invoiceItem.set(
          items.map(
            item=>item.product.id===this.selectedProduct()?.id?
            {...item,amount:item.amount+this.amount()}:item,
          )
        )}
        this.invoiceTotal.update(total=>total+(this.selectedProduct()!.price*this.amount()));
      }
    }

  //buttond delete Item
    deleteItem(id: number): void {
    const items = this.invoiceItem();
    const item = items.find(item => item.product.id === id);

    if (!item) {
      return; // no está en el carrito, no hay nada que borrar
    }

    this.invoiceItem.set(items.filter(item => item.product.id !== id));
    this.invoiceTotal.update(total => total - (item.product.price * item.amount));
    }


  //Products and clients
    getClients=rxResource({
      stream:(args)=>{
        return this.serviceClient.getClients()
        .pipe(
          switchMap((result)=>result===null?throwError(()=>new Error("No se pudo conseguir a los clientes")):of(result))
        )
      }
    })

    getProducts=rxResource({
      stream:(args)=>{
        return this.serviceProduct.getProducts()
        .pipe(
          switchMap(result=>result===null?throwError(()=>new Error(`Products are not found`)):of(result))
        )
      }
    })

    //create invoice
    saveInvoice():void{

      if (!this.selectedClient() || this.invoiceItem().length === 0 || !this.selectedPayment()) {
    this.ErrorMessage.set("rellene todos los espacios");
    return;
  }

  const items = this.invoiceItem();

  const invoice: invoiceRequest = {
    clientId: this.selectedClient()?.id!,
    payment: this.selectedPayment(),
    items: items.map(item => ({
      productId: item.product.id!,
      amount: item.amount
    }))
  };


  /**forkJoin consulta el stock de todos los productos del carrito en paralelo. switchMap decide: si falta stock, lanza un error que cae en tu error:; si todo está bien, hace el POST. */
  forkJoin(items.map(item => this.serviceProduct.findById(item.product.id!)))
    .pipe(
      switchMap(products => {
        const idx = products.findIndex((p, i) => p.stock < items[i].amount);
        if (idx !== -1) {
          return throwError(() => new Error(
            `No hay tanto producto de ${products[idx].name}, solo hay ${products[idx].stock}`
          ));
        }
        return this.serviceInvoice.saveInvoice(invoice);
      })
    )
    .subscribe({
      next: () => {
        this.selectedClient.set(null);
        this.invoiceItem.set([]);
        this.selectedPayment.set("");
        this.invoiceTotal.set(0);
        this.ErrorMessage.set("");
      },
      error: (err) => {
        this.ErrorMessage.set(err.error?.message ?? err.message);
      }
    });

    }
}
