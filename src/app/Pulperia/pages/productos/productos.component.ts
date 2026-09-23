import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from "@angular/router";
import { Products } from '../../Models/Products';
import { rxResource } from '@angular/core/rxjs-interop';

import { of, switchMap, throwError } from 'rxjs';

import { FormsModule } from '@angular/forms';
import { SearchProductPipe } from '../../Pipes/search-product-pipe';
import { ProductService } from '../../Service/product-service';


@Component({
  templateUrl:'productos.component.html',
  styleUrl:'productos.component.css',
  imports: [RouterLink,SearchProductPipe,FormsModule]
})
export class productosComponent{
  service=inject(ProductService)
  protected guardando = signal(false);
  protected errorMensaje = signal('');
  searchPipe=signal<string>("")


  getProducts=rxResource({
    stream:(args)=>{
      return this.service.getProducts()
      .pipe(
        switchMap(result=>result===null?throwError(()=>new Error(`Products are not found`)):of(result))
      )
    }
  })

  desactivarProduct(product:Products){
    product.active=false;
      this.service.updateProduct(product.id!,product).subscribe({
        next:()=>{
          console.log("Desactivado")
        }
      })
  }

  ActivarProducto(product:Products){
    product.active=true;
      this.service.updateProduct(product.id!,product).subscribe({
        next:()=>{
          console.log("Desactivado")
        }
      })
  }
}
