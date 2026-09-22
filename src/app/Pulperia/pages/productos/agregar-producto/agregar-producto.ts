import { Component, inject, signal } from '@angular/core';
import { Router } from "@angular/router";

import { Products } from '../../../Models/Products';
import { ProductService } from '../../../Service/product-service';

@Component({
  selector: 'app-agregar-producto',
  imports: [],
  templateUrl: './agregar-producto.html',
  styleUrl: './agregar-producto.css',
})
export class AgregarProducto {

  //Injectios
  productService=inject(ProductService);
  router=inject(Router)

  //Values to manage errors
  protected guardando = signal(false);
  protected errorMensaje = signal('');

  //Categories that has the select
  protected categorias: string[] = ['Granos', 'Lácteos', 'Panadería', 'Otra'];

  // inputs Form
  protected nombre = signal('');
  protected categoria = signal('');
  protected precio = signal<number | null>(null);
  protected stock = signal<number | null>(null);



  cancelar(): void {
  this.router.navigate(['Pulperia/Products']);
  }

  // El modelo: una señal con el estado del formulario
  productoModel = signal<Products>({
    name: '',
    type: 'Granos',
    price: 0,
    stock: 0,
    active:true
  });

   guardarProducto(): void {

    // Si alguno está vacío, mostramos el error y no seguimos
    if (!this.nombre() || !this.categoria() || !this.precio() || !this.stock()) {
      this.errorMensaje.set('Completá todos los campos antes de guardar.');
      return
    }

    this.errorMensaje.set('');
    this.guardando.set(true);

    const producto: Products = {
      name: this.nombre(),
      type: this.categoria(),
      price: this.precio()!,
      stock: this.stock()!,
      active:true
    };

    this.productService.saveProduct(producto).subscribe({
      next: () => {
        this.guardando.set(false);
        this.router.navigate(['Pulperia/Products']);
      },
      error: (err) => {
        this.guardando.set(false);
        this.errorMensaje.set('No se pudo guardar el producto.');
        console.error(err);
      }
    });
  }



}
