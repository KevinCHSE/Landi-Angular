import { Component, inject, Signal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { of, switchMap, throwError } from 'rxjs';
import { Products } from '../../../Models/Products';
import { ProductService } from '../../../Service/product-service';

@Component({
  selector: 'app-editar-producto',
  imports: [],
  templateUrl: './editar-producto.html',
  styleUrl: './editar-producto.css',
})
export class EditarProducto {
  router=inject(Router)
  activatedRouter=inject(ActivatedRoute)
  ProductService=inject(ProductService)

  id:string="";
  name=signal<string>('');
  stock=signal<number>(0);
  newStock=signal<number>(0);
  price=signal<number>(0);
  categoria=signal<string>('')
  isActive=signal<boolean>(false)

  cargando = signal<boolean>(true);
  errorMensaje = signal<string>('');

  constructor(){
    this.id= this.activatedRouter.snapshot.paramMap.get("id") || ""
    if(!this.id){
      this.errorMensaje.set("No se encontro el producto")
      this.cargando.set(false);
      return;
    }
    this.ProductService.findById(Number(this.id)).subscribe({
      next:(product)=>{
         this.name.set(product.name)
         this.stock.set(product.stock)
         this.price.set(product.price)
         this.categoria.set(product.type)
         this.isActive.set(product.active)

         this.cargando.set(false)


      },error:(err: any): void=>{
        this.errorMensaje.set("El Producto no se pudo cargar")
        this.cargando.set(false)
        console.log(err);
      }
    })
  }

  cancelar(): void {
  this.router.navigate(['/Products']);
  }

  actualizar():void{
    const product:Products={
      name:this.name(),
      stock:this.stock(),
      price:this.price(),
      type:this.categoria(),
      active:this.isActive()
    }
    const newId:number= Number(this.id);
    this.ProductService.updateProduct(newId, product).subscribe({
      next:()=>{
        this.cargando.set(false),
        this.router.navigate(['/Products'])
      },
      error:(err)=>{
        this.cargando.set(false),
        this.errorMensaje.set("No se pudo actualizar los datos del producto")
        console.log(err)
      }
    })
  }

  ActualizarStock():void{
    const newId:number= Number(this.id);
    this.ProductService.updateStock(newId,this.newStock()).subscribe({
      next:()=>{
        this.cargando.set(false),
        this.router.navigate(['/Products'])
      },error:(err)=>{
        this.cargando.set(false),
        this.errorMensaje.set("No se pudo actualizar el Stock del producto")
        console.log(err)
      }
    })

  }

}
