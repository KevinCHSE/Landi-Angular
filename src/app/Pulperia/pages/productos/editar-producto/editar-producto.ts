import { Component, inject, Signal, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';

import { catchError, of, switchMap, throwError } from 'rxjs';
import { Products } from '../../../Models/Products';
import { ProductService } from '../../../Service/product-service';
import { ProductImageService } from '../../../Service/product-image-service';

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
  imageService=inject(ProductImageService)

  id:string="";
  name=signal<string>('');
  stock=signal<number>(0);
  newStock=signal<number>(0);
  price=signal<number>(0);
  categoria=signal<string>('')
  isActive=signal<boolean>(false)
  Image=signal<File|null>(null)

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

  actualizar():void{

    if(!this.name() || !this.price() || !this.Image()){
      this.cargando.set(false)
      this.errorMensaje.set("Hay espacios sin rellenar o le falta la imagen")
      return
    }

    this.cargando.set(true)
    const product:Products={
      name:this.name(),
      stock:this.stock(),
      price:this.price(),
      type:this.categoria(),
      active:this.isActive(),
    }

    const file = this.Image()

    const newId:number= Number(this.id);
    this.ProductService.updateProduct(newId, product)
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
      next:()=>{
        this.cargando.set(false),
        this.errorMensaje.set("")
        this.router.navigate(['Pulperia/Products'])
      },
      error:(err)=>{
        this.cargando.set(false),
        this.errorMensaje.set("No se pudo actualizar los datos del producto")
        console.log(err)
      }
    })
  }

  ActualizarStock():void{
    if(!this.newStock()){
      this.cargando.set(false),
      this.errorMensaje.set("Rellene el espacio del stock")
      return
    }
    const newId:number= Number(this.id);
    this.ProductService.updateStock(newId,this.newStock()).subscribe({
      next:()=>{
        this.cargando.set(false),
        this.router.navigate(['Pulperia/Products'])
      },error:(err)=>{
        this.cargando.set(false),
        this.errorMensaje.set("No se pudo actualizar el Stock del producto")
        console.log(err)
      }
    })

  }

}
