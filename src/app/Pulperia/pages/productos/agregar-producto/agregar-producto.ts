import { Component, inject, signal } from '@angular/core';
import { Router } from "@angular/router";

import { Products } from '../../../Models/Products';
import { ProductService } from '../../../Service/product-service';
import { Image } from '../../../Models/Image';
import { catchError, of, switchMap } from 'rxjs';
import { ProductImageService } from '../../../Service/product-image-service';

@Component({
  selector: 'app-agregar-producto',
  imports: [],
  templateUrl: './agregar-producto.html',
  styleUrl: './agregar-producto.css',
})
export class AgregarProducto {

  //Injectios
  productService=inject(ProductService);
  imageService=inject(ProductImageService)
  router=inject(Router)

  //Values to manage errors
  guardando = signal(false);
  errorMensaje = signal('');

  //Categories that has the select
  categorias: string[] = ['Granos', 'Lácteos', 'Panadería', 'Otra'];

  // inputs Form
  nombre = signal('');
  categoria = signal('');
  precio = signal<number | null>(null);
  stock = signal<number | null>(null);
  Image= signal<File | null>(null)



  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      this.errorMensaje.set('El archivo debe ser una imagen');
      input.value = '';
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      this.errorMensaje.set('La imagen no puede pesar más de 2 MB');
      input.value = '';
      return;
    }

    this.errorMensaje.set('');
    this.Image.set(file);
  }

  quitarImagen(input: HTMLInputElement): void {
    this.Image.set(null);
    input.value = '';
  }


  cancelar(): void {
  this.router.navigate(['Pulperia/Products']);
  }

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
      active:true,
    };

    const file=this.Image()

    this.productService.saveProduct(producto)
    .pipe(
      switchMap(
        saved=>file?this.imageService.saveImage(saved.id!,file)
        .pipe(
          catchError(err=>{
            this.errorMensaje.set(`No se pudo subir la Imagen ${err}`)
            return of(null)
          })
        )
        :of(null)
      )
    )
    .subscribe({
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
